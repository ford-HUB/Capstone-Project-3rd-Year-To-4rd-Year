import models from "../../models/index.js";
import { sendMail } from "../../services/mailService.js";
import { db } from "../../config/db.js";
import { Op } from "sequelize";
import { getActiveUsers } from "../../socket.js";

export const ListUsers = async (req, res) => {
    try {
        const { Accounts, Role, Department, CampusUsers, Coordinator, Staff, Course, YearLevel, Beneficiary, Donor } = models;

        const getList = await Accounts.findAll({
            attributes: ['account_id', 'email', 'is_active', 'is_deactivated', 'createdAt', 'updatedAt', 'activeAt'],
            where: { account_id: { [Op.ne]: req.user.account_id } },
            distinct: true,
            include: [
                {
                    model: Role,
                    attributes: ['role_id', 'name'],
                    required: true
                },
                {
                    model: CampusUsers,
                    attributes: ['firstname', 'lastname', 'phone_number', 'school_number', 'school_image_id', 'type'],
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
                    attributes: ['firstname','lastname','phone_number', 'profile_image', 'signature_img']
                },
                {
                    model: Coordinator,
                    required: false, 
                    include: [
                      {
                        model: Department,
                        attributes: ['department_id', 'department_name']
                      }
                    ], attributes: ['firstname','lastname','phone_number', 'profile_image', 'signature_img']
                },
                {
                    model: Beneficiary,
                    required: false,
                    attributes: ['beneficiary_id', 'firstname', 'lastname', 'middle_initial', 'gender', 'age', 'phone_number', 'current_address', 'organization_name']
                },
                {
                    model: Donor,
                    required: false,
                    attributes: ['donor_id', 'fullname', 'profile_image', 'is_verified', 'auth_provider']
                }
            ],
            order: [['is_active', 'DESC'], ['account_id', 'ASC']]
        });


        if (getList.length === 0) {
            return res.status(200).json({ success: true, list: [], message: 'List Currently Empty' });
        }

        const activeUsers = getActiveUsers();
        const activeUserIds = new Set(activeUsers.map(user => user.userId));

        const transformedList = getList.map(account => {
            // Determine user type based on which model exists or role name
            let userType = account.Role?.name || 'unknown';
            
            // Override type based on specific models if they exist
            if (account.CampusUsers) {
                userType = account.CampusUsers.type || 'volunteer';
            } else if (account.Staff) {
                userType = 'staff';
            } else if (account.Coordinator) {
                userType = 'coordinator';
            } else if (account.Beneficiary) {
                userType = 'beneficiary';
            } else if (account.Donor) {
                userType = 'donor';
            }

            const userData = {
                id: account.account_id,
                email: account.email,
                role: account.Role,
                status: account.is_deactivated ? 'deactivated': account.is_active ? 'active' : 'inactive',
                type: userType,
                details: null,
                departments: [],
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
                activeAt: account.activeAt,
                isOnline: activeUserIds.has(account.account_id.toString())
            };

            if (account.CampusUsers) {
                userData.details = {
                    firstname: account.CampusUsers.firstname,
                    lastname: account.CampusUsers.lastname,
                    phone_number: account.CampusUsers.phone_number,
                    course: account.CampusUsers.Course,
                    year_level: account.CampusUsers.YearLevel,
                    school_number: account.CampusUsers.school_number,
                    school_image_id: account.CampusUsers.school_image_id,
                    type: account.CampusUsers.type
                };
                userData.departments = account.CampusUsers.Department
            } 
            else if (account.Staff) {
                userData.details = {
                    firstname: account.Staff.firstname || 'processing ',
                    lastname: account.Staff.lastname || 'completion...',
                    phone_number: account.Staff.phone_number || 'No phone number provided',
                    profile_image: account.Staff.profile_image,
                    signature_img: account.Staff.signature_img
                };
                userData.departments = account.Staff.Department || [];
            }
            else if(account.Coordinator) {
                userData.details = {
                    firstname: account.Coordinator.firstname || 'processing ',
                    lastname: account.Coordinator.lastname || 'completion...',
                    phone_number: account.Coordinator.phone_number || 'No phone number provided',
                    profile_image: account.Coordinator.profile_image,
                    signature_img: account.Coordinator.signature_img
                };
                userData.departments = account.Coordinator.Department || [];
            }
            else if (account.Beneficiary) {
                userData.details = {
                    firstname: account.Beneficiary.firstname,
                    lastname: account.Beneficiary.lastname,
                    middle_initial: account.Beneficiary.middle_initial,
                    gender: account.Beneficiary.gender,
                    age: account.Beneficiary.age,
                    phone_number: account.Beneficiary.phone_number,
                    current_address: account.Beneficiary.current_address,
                    organization_name: account.Beneficiary.organization_name
                };
            }
            else if (account.Donor) {
                userData.details = {
                    fullname: account.Donor.fullname,
                    profile_image: account.Donor.profile_image,
                    is_verified: account.Donor.is_verified,
                    auth_provider: account.Donor.auth_provider
                };
            }

            return userData;
        });

        return res.json({ success: true, list: transformedList });

    } catch (error) {
        console.error('List Users Failed:', error.message);
        console.error('List Users Error Stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const softDeleteUserAccount = async (req, res) => {
    const t = await db.transaction()
    try {
        const { Accounts } = models
        const userId = req.params.userId
        const { reason } = req.body || {}
    
        const account = await Accounts.findByPk(userId, { transaction: t })
        if (!account) {
            await t.rollback()
            return res.json({ success: false, message: 'Account not found' })
        }
    
        await account.destroy({ transaction: t })
        await t.commit()

        try {
            await notifyAccountAction(account.email, 'SOFT_DELETE', reason)
        } catch (err) {
            // Silent fail for notification
        }

        return res.json({ success: true, message: 'Account successfully soft deleted' })

    } catch (error) {
        await t.rollback()
        return res.json({ success: false, message: 'Internal Server Error' })
    }
  }
  

export const deactivateUserAccount = async (req, res) => {
    try {
        const { Accounts } = models
        const { reason } = req.body || {}

        const account = await Accounts.findByPk(req.params.id)

        if(!account) { return res.json({ success: false, message: 'account is not found' }) }

        await account.update({ is_deactivated: true, is_active: false })

        try {
            await notifyAccountAction(account.email, 'DEACTIVATED', reason)
        } catch (err) {
            // Silent fail for notification
        }

        return res.json({ success: true, message: 'Account successfully deactivated' })
    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const restoreUserAccount = async (req, res) => {
    try {
        const { Accounts } = models

        const account = await Accounts.findByPk(req.params.id)

        if(!account) { return res.json({ success: false, message: 'account is not found' }) }

        await account.update({ is_deactivated: false, is_active: true })

        try {
            await notifyAccountAction(account.email, 'RESTORED', 'Account restored by administrator')
        } catch (err) {
            // Silent fail for notification
        }

        return res.json({ success: true, message: 'Account successfully restored and activated' })
    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const listSoftDeletedUsers = async (req, res) => {
    try {
        const { Accounts, Role } = models;

        const users = await Accounts.findAll({
            attributes: ['account_id', 'email', 'deletedAt', 'createdAt'],
            where: { deletedAt: { [Op.ne]: null } },
            paranoid: false,
            include: [
                { model: Role, attributes: ['role_id', 'name'] }
            ],
            order: [['deletedAt', 'DESC']]
        })

        return res.json({ success: true, list: users })
    } catch (error) {
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const restoreSoftDeletedUser = async (req, res) => {
    try {
        const { Accounts } = models
        const accountId = req.params.id

        const account = await Accounts.findByPk(accountId, { paranoid: false })
        if (!account) {
            return res.json({ success: false, message: 'Account not found' })
        }

        if (!account.deletedAt) {
            return res.json({ success: false, message: 'Account is not soft-deleted' })
        }

        const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000
        const deletedAtMs = new Date(account.deletedAt).getTime()
        const nowMs = Date.now()
        if (nowMs - deletedAtMs > ninetyDaysMs) {
            return res.json({ success: false, message: 'Restore window expired (90 days)' })
        }

        await account.restore()
        await account.update({ is_active: true, is_deactivated: false })

        try {
            await notifyAccountAction(account.email, 'RESTORED', 'Account restored from archive by administrator')
        } catch (err) {
            // Silent fail for notification
        }

        return res.json({ success: true, message: 'Account successfully restored' })
    } catch (error) {
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

export const updateUserActivity = async (req, res) => {
    try {
        const { Accounts } = models;
        const accountId = req.user.account_id;

        await Accounts.update(
            { activeAt: new Date() },
            { where: { account_id: accountId } }
        );

        return res.json({ success: true, message: 'Activity updated' });
    } catch (error) {
        return res.json({ success: false, message: 'Internal Server Error' });
    }
};

const notifyAccountAction = async (email, action, reason = '') => {
    const actionConfig = {
        'DEACTIVATED': {
            subject: 'Your account has been deactivated',
            title: 'Account Deactivated',
            description: 'We are writing to inform you that your UCLM CARES account has been temporarily deactivated.',
            status_title: 'Account Status: Deactivated',
            status_description: 'Your account is temporarily disabled and you will not be able to log in or access system features.',
            action_title: 'What this means:',
            action_text: 'You cannot log in to your account until it is reactivated by an administrator. All your data remains safe and will be restored when your account is reactivated.'
        },
        'SOFT_DELETE': {
            subject: 'Your account has been archived',
            title: 'Account Archived',
            description: 'We are writing to inform you that your UCLM CARES account has been archived (soft-deleted).',
            status_title: 'Account Status: Archived',
            status_description: 'Your account has been moved to our archive system and is no longer accessible.',
            action_title: 'Restoration window:',
            action_text: 'Your account can be restored within 90 days from the date of archiving. After this period, the account will be permanently deleted and cannot be recovered.'
        },
        'RESTORED': {
            subject: 'Your account has been restored',
            title: 'Account Restored',
            description: 'Great news! Your UCLM CARES account has been successfully restored.',
            status_title: 'Account Status: Active',
            status_description: 'Your account is now active and you can log in and access all system features.',
            action_title: 'Next steps:',
            action_text: 'You can now log in to your account using your existing credentials. If you have any issues accessing your account, please contact our support team.'
        }
    }

    const config = actionConfig[action] || actionConfig['DEACTIVATED']
    const template = 'accountActionNotification.html'
    
    const variables = {
        email: process.env.AUTH_MAILER,
        title: config.title,
        description: config.description,
        status_title: config.status_title,
        status_description: config.status_description,
        reason: reason || 'No specific reason provided',
        action_title: config.action_title,
        action_text: config.action_text
    }
    
    await sendMail(email, config.subject, config.description, template, variables)
}

export const getActiveUsersCount = async (req, res) => {
    try {
        const activeUsers = getActiveUsers();
        return res.json({ 
            success: true, 
            activeCount: activeUsers.length,
            activeUsers: activeUsers.map(user => ({
                userId: user.userId,
                userInfo: user.userInfo,
                lastActivity: user.lastActivity
            }))
        });
    } catch (error) {
        return res.json({ success: false, message: 'Internal Server Error' });
    }
}