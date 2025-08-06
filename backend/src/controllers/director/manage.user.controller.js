import models from "../../models/index.js";
import { db } from "../../config/db.js";

export const ListUsers = async (req, res) => {
    try {
        const { Accounts, Role, Department, Student, Coordinator, Staff, Course, YearLevel } = models;

        const getList = await Accounts.findAll({
            attributes: ['account_id', 'email', 'is_active'],
            include: [
                {
                    model: Role,
                    attributes: ['role_id', 'name']
                },
                {
                    model: Student,
                    attributes: ['firstname', 'lastname', 'phone_number'],
                    required: false,
                    include: [
                        {
                            model: Department,
                            attributes: ['department_id', 'department_name']
                        },
                        {
                            model: Course,
                            attributes: ['course_id', 'course_name']
                        },
                        {
                            model: YearLevel,
                            attributes: ['yl_id', 'year_level']
                        }
                    ]
                },
                {
                    model: Staff,
                    required: false, 
                    attributes: ['firstname','lastname','phone_number']
                },
                {
                    model: Coordinator,
                    required: false, 
                    include: [
                      {
                        model: Department,
                        attributes: ['department_id', 'department_name']
                      }
                    ], attributes: ['firstname','lastname','phone_number']
                }
            ],
            order: [['account_id', 'ASC']]
        });

        if (getList.length === 0) {
            return res.status(200).json({ message: 'List Currently Empty' });
        }

        const transformedList = getList.map(account => {
            const userData = {
                id: account.account_id,
                email: account.email,
                role: account.Role,
                is_active: account.is_active,
                type: account.Student ? 'student' : account.Staff ? 'staff' : account.Coordinator ? 'coordinator' : 'director',
                details: null,
                departments: []
            };

            if (account.Student) {
                userData.details = {
                    firstname: account.Student.firstname,
                    lastname: account.Student.lastname,
                    phone_number: account.Student.phone_number,
                    course: account.Student.Course,
                    year_level: account.Student.YearLevel
                };
                userData.departments = account.Student.Departments || [];
            } 
            else if (account.Staff) {
                userData.details = {
                    firstname: account.Staff.firstname,
                    lastname: account.Staff.lastname,
                    phone_number: account.Staff.phone_number
                };
                userData.departments = account.Staff.Departments || [];
            }
            else if(account.Coordinator) {
                userData.details = {
                    firstname: account.Staff.firstname,
                    lastname: account.Staff.lastname,
                    phone_number: account.Staff.phone_number
                };
                userData.departments = account.Staff.Departments || [];
            }

            return userData;
        });

        return res.json({ success: true, list: transformedList });

    } catch (error) {
        console.error('List Users Failed:', error.message);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const deleteUser = async (req, res) => {
    const t = await db.transaction()
  try {
    const userId = req.params.userId;

    const {
        Accounts,
        VerificationCodes,
        Role,
        Student,
        Volunteer,
        Attendance,
        EventRegistration,
        Course,
        YearLevel,
        Staff,
        StaffDepartment,
        RequestApproval,
        ApprovalToken
    } = models


    // 1. First find out if this is a student or staff account
    const account = await Accounts.findByPk(userId, { transaction: t });
    if (!account) {
      await t.rollback();
      return res.json({ message: 'Account not found' });
    }

    // 2. Delete verification codes if exists
    await VerificationCodes.destroy({
      where: { vc_id: userId },
      transaction: t
    });

    // 3. Delete role
    await Role.destroy({
      where: { role_id: userId },
      transaction: t
    });

    // 4. Check if student and delete student-related data
    const student = await Student.findOne({
      where: { student_id: userId },
      transaction: t
    });

    if (student) {
      const student_id = student.student_id;

      // Delete volunteer data and related records
      const volunteer = await Volunteer.findOne({
        where: { student_id: student_id },
        transaction: t
      });

      if (volunteer) {
        const volunteer_id = volunteer.volunteer_id;

        // Delete attendance records
        await Attendance.destroy({
          where: { volunteer_id: volunteer_id },
          transaction: t
        });

        // Delete event registrations
        await EventRegistration.destroy({
          where: { volunteer_id: volunteer_id },
          transaction: t
        });

        // Delete the volunteer
        await Volunteer.destroy({
          where: { volunteer_id: volunteer_id },
          transaction: t
        });
      }

      // Delete student-department associations
      await StudentDepartment.destroy({
        where: { student_id: student_id },
        transaction: t
      });

      // Delete course
      await Course.destroy({
        where: { student_id: student_id },
        transaction: t
      });

      // Delete year level
      await YearLevel.destroy({
        where: { student_id: student_id },
        transaction: t
      });

      // Finally delete the student
      await Student.destroy({
        where: { student_id: student_id },
        transaction: t
      });
    }

    // 5. Check if staff and delete staff-related data
    const staff = await Staff.findOne({
      where: { staff_id: userId },
      transaction: t
    });

    if (staff) {
      const staff_id = staff.staff_id;

      // Delete staff-department associations
      await StaffDepartment.destroy({
        where: { staff_id: staff_id },
        transaction: t
      });

      // Find and delete request approvals and their tokens
      const requestApprovals = await RequestApproval.findAll({
        where: { ra_id: staff_id },
        transaction: t
      });

      for (const ra of requestApprovals) {
        await ApprovalToken.destroy({
          where: { ra_id: ra.ra_id },
          transaction: t
        });
      }

      await RequestApproval.destroy({
        where: { ra_id: staff_id },
        transaction: t
      });

      // Delete the staff
      await Staff.destroy({
        where: { staff_id: staff_id },
        transaction: t
      });
    }

    // 7. Finally delete the account
    await Accounts.destroy({
      where: { account_id: userId },
      transaction: t
    });

    await t.commit();
    res.json({ success: true, message: 'Account Successfully Deleted' })
  } catch (error) {
    await t.rollback();
    console.log('Delete User failed:', error);
    res.json({ message: 'Internal Server Error' });
  }
};