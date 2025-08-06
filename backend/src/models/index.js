import Accounts from "./Accounts.model.js"
import Student from "./Student/Student.model.js"
import Department from "./Department.model.js"
import Course from "./Student/Course.model.js"
import YearLevel from "./Student/YearLevel.model.js"
import Role from "./Role.model.js"
import VerificationCodes from "./Student/VerificationCode.model.js"
import Staff from "./management/Staff.model.js"
import RequestApproval from "./management/RequestApproval.model.js"
import ApprovalToken from "./management/ApprovalToken.model.js"
import AuditLog from "./director/AuditLog.model.js"
import Event from "./event/Event.model.js"
import Category from "./event/Category.model.js"
import EventCategory from "./event/EventCategory.model.js"
import Organizer from "./event/Organizer.model.js"
import EventDepartment from "./event/EventDepartment.model.js"
import EventRegistration from "./event/EventRegistration.model.js"
import Volunteer from "./Student/Volunteer.model.js"
import EventQRCode from "./event/EventQRCode.model.js"
import Attendance from "./event/Attendance.model.js"
import Donor from "./donor/Donor.model.js"
import Director from "./director/Director.modal.js"
import PaymentInfo from "./director/PaymentInfo.model.js"
import SocialLinks from "./director/SocialLinks.model.js"
import Coordinator from "./management/Coordinator.model.js"
import Certificate_Template from "./event/Certificate_Template.model.js"
import Certificate from "./event/Certificate.model.js"



Accounts.hasOne(Role, { foreignKey: "account_id", onDelete: "CASCADE" });
Role.belongsTo(Accounts, { foreignKey: "account_id" });

Accounts.hasOne(Student, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });
Student.belongsTo(Accounts, { foreignKey: 'account_id' });

Accounts.hasOne(Staff, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });
Staff.belongsTo(Accounts, { foreignKey: 'account_id' });

Accounts.hasOne(Coordinator, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Coordinator.belongsTo(Accounts, { foreignKey: 'account_id' })

Accounts.hasOne(Donor, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Donor.belongsTo(Accounts, { foreignKey: 'account_id' })

Accounts.hasOne(Director, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Director.belongsTo(Accounts, { foreignKey: 'account_id' })



Department.hasMany(Student, { foreignKey: 'department_id' });
Student.belongsTo(Department, { foreignKey: 'department_id' });

Course.hasMany(Student, { foreignKey: "course_id", onDelete: "CASCADE", hooks: true });
Student.belongsTo(Course, { foreignKey: "course_id" });

YearLevel.hasMany(Student, { foreignKey: "yl_id", onDelete: "CASCADE", hooks: true });
Student.belongsTo(YearLevel, { foreignKey: "yl_id" });

Student.hasOne(VerificationCodes, { foreignKey: 'account_id', onDelete: 'CASCADE', hooks:true })
VerificationCodes.belongsTo(Student, { foreignKey: 'account_id' })

Department.hasMany(Coordinator, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true })
Coordinator.belongsTo(Department, { foreignKey: 'department_id' })


RequestApproval.hasOne(ApprovalToken, { foreignKey: 'ra_id', onDelete: "CASCADE", hooks: true })
ApprovalToken.belongsTo(RequestApproval, { foreignKey: 'ra_id', onDelete: "CASCADE", hooks: true })

AuditLog.belongsTo(Accounts, { through: Accounts, foreignKey: 'account_id', onDelete: "CASCADE", hooks: true }),
Accounts.belongsToMany(AuditLog,  { through: AuditLog, foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })



 
Event.belongsToMany(Category,{ through: EventCategory, foreignKey: 'event_id', otherKey: 'category_id', onDelete: "CASCADE", hooks: true })
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'category_id', otherKey: 'event_id', onDelete: "CASCADE", hooks: true})

Event.belongsTo(Organizer, { foreignKey: 'organizer_id', onDelete: "CASCADE", hooks: true })
Organizer.hasMany(Event, { foreignKey: 'organizer_id', onDelete: "CASCADE", hooks: true })

Event.belongsToMany(Department, { through: EventDepartment, foreignKey: 'event_id', otherKey: 'department_id', onDelete: "CASCADE", hooks: true })
Department.belongsToMany(Event, { through: EventDepartment, foreignKey: 'department_id', otherKey: 'event_id', onDelete: "CASCADE", hooks: true })

EventQRCode.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Event.hasMany(EventQRCode, { foreignKey: 'qr_id', onDelete: "CASCADE", hooks: true })

EventRegistration.belongsTo(Volunteer, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Volunteer.hasMany(EventRegistration, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true})
Event.hasMany(EventRegistration, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Certificate_Template.hasMany(Certificate, { foreignKey: 'ct_id', onDelete: "CASCADE", hooks: true } )
Category.hasOne(Certificate_Template, { foreignKey: 'category_id', onDelete: "CASCADE", hooks: true })
Certificate_Template.belongsTo(Category, { foreignKey: 'category_id' })
Certificate.belongsTo(Certificate_Template, { foreignKey: 'ct_id' })


Attendance.belongsTo(Volunteer, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Volunteer.hasMany(Attendance, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })
Event.hasMany(Attendance, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Volunteer.belongsTo(Student, { foreignKey: 'student_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(Department, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(Course, { foreignKey: 'course_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(YearLevel, { foreignKey: 'yl_id', onDelete: "CASCADE", hooks: true })

Student.hasOne(Volunteer, { foreignKey: 'student_id', onDelete: "CASCADE", hooks: true })

Director.hasOne(PaymentInfo, { foreignKey: 'director_id', onDelete: "CASCADE", hooks: true })
PaymentInfo.belongsTo(Director, { foreignKey: 'director_id' })

SocialLinks.hasOne(Director, { foreignKey: 'social_links_id', onDelete: "CASCADE", hooks: true })
Director.belongsTo(SocialLinks, { foreignKey: 'social_links_id' })

const models = {
    Director,
    SocialLinks,
    PaymentInfo,
    Donor,
    Coordinator,
    EventRegistration,
    Certificate_Template,
    Certificate,
    Volunteer,
    Attendance,
    EventQRCode,
    EventRegistration,
    EventDepartment,
    Event,
    Category,
    EventCategory,
    Organizer,
    AuditLog,
    RequestApproval,
    ApprovalToken,
    Student,
    Accounts,
    Staff,
    Department,
    Course,
    YearLevel,
    Role,
    VerificationCodes
}

export default models 