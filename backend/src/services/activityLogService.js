import models from "../models/index.js";
import { Op } from "sequelize";

const { ActivityLog, Role, Director, Staff, Coordinator, Volunteer, Beneficiary, Donor, Accounts, CampusUsers } = models;

export const createActivityLog = async ({
    user_id,
    role,
    action,
    module,
    description,
    ip_address = null,
    user_agent = null
}) => {
    try {
        const activityLog = await ActivityLog.create({
            user_id,
            role,
            action,
            module,
            description,
            ip_address,
            user_agent
        });

        return {
            success: true,
            activityLog: activityLog.toJSON()
        };
    } catch (error) {
        console.error('Create activity log failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const getActivityLogsByUser = async (user_id, role, options = {}) => {
    try {
        const {
            limit = null,
            offset = 0,
            order = 'DESC'
        } = options;

        const queryOptions = {
            where: {
                user_id,
                role
            },
            order: [['createdAt', order]],
            attributes: [
                'activity_log_id',
                'action',
                'module',
                'description',
                'ip_address',
                'user_agent',
                'createdAt',
                'updatedAt'
            ]
        };

        if (limit) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }

        const logs = await ActivityLog.findAll(queryOptions);

        return {
            success: true,
            logs: logs.map(log => log.toJSON()),
            total: logs.length
        };
    } catch (error) {
        console.error('Get activity logs by user failed:', error);
        return {
            success: false,
            error: error.message,
            logs: []
        };
    }
};

export const getActivityLogsByAccount = async (account_id, role, options = {}) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            return {
                success: false,
                error: `Account not found`,
                logs: []
            };
        }

        const { success, user_id, error } = await getUserIdFromAccount(account_id, role);

        if (!success || !user_id) {
            return {
                success: false,
                error: error || `Failed to get user_id for account_id ${account_id} with role ${role}`,
                logs: []
            };
        }

        return await getActivityLogsByUser(user_id, role, options);

    } catch (error) {
        console.error('Get activity logs by account failed:', error);
        return {
            success: false,
            error: error.message,
            logs: []
        };
    }
};

export const groupLogsForTimeline = (logs) => {
    if (!logs || logs.length === 0) return [];

    const timeline = [];
    const processedLogs = new Set();

    logs.forEach((log, index) => {
        if (processedLogs.has(index)) return;

        const mainEvent = {
            module: log.module,
            action: log.action,
            description: log.description,
            timestamp: log.createdAt,
            icon: getEventIcon(log.module, log.action),
            status: determineStatus(log.description),
            activity_log_id: log.activity_log_id,
            role: log.role || null,
            user_name: log.user_name || 'Unknown User',
            user_agent: log.user_agent || null
        };

        const subEvents = [];
        processedLogs.add(index);

        logs.forEach((subLog, subIndex) => {
            if (processedLogs.has(subIndex)) return;

            const timeDiff = Math.abs(new Date(subLog.createdAt) - new Date(log.createdAt)) / (1000 * 60);

            if (timeDiff <= 30 && (
                subLog.module === log.module ||
                isRelatedAction(log, subLog) ||
                isSubEvent(subLog)
            )) {
                subEvents.push({
                    description: subLog.description,
                    timestamp: subLog.createdAt,
                    status: determineStatus(subLog.description),
                    activity_log_id: subLog.activity_log_id
                });
                processedLogs.add(subIndex);
            }
        });

        timeline.push({
            mainEvent: mainEvent,
            subEvents: subEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        });
    });

    return timeline.sort((a, b) => new Date(b.mainEvent.timestamp) - new Date(a.mainEvent.timestamp));
};

export const isSubEvent = (logData) => {
    const subEventKeywords = [
        'verification',
        'confirmation',
        'password',
        'success',
        'failed',
        'failure',
        'rejected',
        'approved'
    ];

    const description = (logData.description || '').toLowerCase();
    return subEventKeywords.some(keyword => description.includes(keyword));
};

export const determineStatus = (description) => {
    if (!description) return 'info';

    const desc = description.toLowerCase();
    
    if (desc.includes('success') || desc.includes('successful') || desc.includes('approved')) {
        return 'success';
    }
    if (desc.includes('failed') || desc.includes('failure') || desc.includes('rejected') || desc.includes('wrong')) {
        return 'failure';
    }
    return 'info';
};

export const getEventIcon = (module, action) => {
    const iconMap = {
        'account': {
            'delete': 'trash',
            'update': 'edit',
            'access': 'user',
            'create': 'user-plus'
        },
        'password': {
            'change': 'check',
            'reset': 'key',
            'update': 'key'
        },
        'profile': {
            'update': 'user-circle',
            'edit': 'user-circle'
        },
        'event': {
            'create': 'calendar-plus',
            'update': 'calendar-edit',
            'delete': 'calendar-x',
            'register': 'calendar-check'
        },
        'document': {
            'upload': 'file-up',
            'download': 'file-down',
            'delete': 'file-x'
        }
    };

    return iconMap[module?.toLowerCase()]?.[action?.toLowerCase()] || 'activity';
};

export const isRelatedAction = (log1, log2) => {
    const relatedPairs = [
        ['delete', 'verification'],
        ['delete', 'confirmation'],
        ['access', 'delete'],
        ['password', 'confirmation'],
        ['password', 'verification'],
        ['update', 'verification'],
        ['create', 'verification']
    ];

    const action1 = (log1.action || '').toLowerCase();
    const action2 = (log2.action || '').toLowerCase();
    const desc1 = (log1.description || '').toLowerCase();
    const desc2 = (log2.description || '').toLowerCase();

    return relatedPairs.some(pair => 
        (action1.includes(pair[0]) && (action2.includes(pair[1]) || desc2.includes(pair[1]))) ||
        (action2.includes(pair[0]) && (action1.includes(pair[1]) || desc1.includes(pair[1])))
    );
};

export const formatDateKey = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

export const logDirectorActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const director = await Director.findOne({
            where: { account_id },
            attributes: ['director_id']
        });

        if (!director) {
            console.warn(`Director record not found for account_id ${account_id}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id: director.director_id,
            role: 'director',
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logActivity = async (account_id, role, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const { success, user_id, error } = await getUserIdFromAccount(account_id, role);

        if (!success || !user_id) {
            console.warn(`Failed to get user_id for account_id ${account_id} with role ${role}: ${error}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id,
            role: role.toLowerCase(),
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logManagementActivity = async (account_id, role, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const { success, user_id, error } = await getUserIdFromAccount(account_id, role);

        if (!success || !user_id) {
            console.warn(`Failed to get user_id for account_id ${account_id} with role ${role}: ${error}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id,
            role: role.toLowerCase(),
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logParticipantActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const campusUser = await CampusUsers.findOne({
            where: { account_id },
            attributes: ['campus_user_id']
        });

        if (!campusUser) {
            console.warn(`CampusUsers record not found for account_id ${account_id}. Activity log skipped.`);
            return;
        }

        const volunteer = await Volunteer.findOne({
            where: { campus_user_id: campusUser.campus_user_id },
            attributes: ['volunteer_id']
        });

        if (!volunteer) {
            console.warn(`Volunteer record not found for campus_user_id ${campusUser.campus_user_id}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id: volunteer.volunteer_id,
            role: 'volunteer',
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logBeneficiaryActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            attributes: ['beneficiary_id']
        });

        if (!beneficiary) {
            console.warn(`Beneficiary record not found for account_id ${account_id}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id: beneficiary.beneficiary_id,
            role: 'beneficiary',
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logDonorActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const accountExists = await Accounts.findOne({
            where: { account_id },
            attributes: ['account_id']
        });

        if (!accountExists) {
            console.error(`Account with account_id ${account_id} not found`);
            return;
        }

        const donor = await Donor.findOne({
            where: { account_id },
            attributes: ['donor_id']
        });

        if (!donor) {
            console.warn(`Donor record not found for account_id ${account_id}. Activity log skipped.`);
            return;
        }

        await createActivityLog({
            user_id: donor.donor_id,
            role: 'donor',
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const getAllUsersActivityLogs = async (options = {}) => {
    try {
        const {
            limit = null,
            offset = 0,
            order = 'DESC',
            roles = ['staff', 'coordinator', 'assistant_coordinator', 'volunteer', 'beneficiary', 'donor']
        } = options;

        const queryOptions = {
            where: {
                role: {
                    [Op.in]: roles
                }
            },
            order: [['createdAt', order]],
            attributes: [
                'activity_log_id',
                'user_id',
                'role',
                'action',
                'module',
                'description',
                'ip_address',
                'user_agent',
                'createdAt',
                'updatedAt'
            ]
        };

        if (limit) {
            queryOptions.limit = limit;
            queryOptions.offset = offset;
        }

        const logs = await ActivityLog.findAll(queryOptions);
        const logsWithNames = await Promise.all(logs.map(async (log) => {
            const logData = log.toJSON();
            let userName = 'Unknown User';

            try {
                const roleLower = logData.role.toLowerCase();
                
                if (roleLower === 'volunteer') {
                    const volunteer = await Volunteer.findOne({
                        where: { volunteer_id: logData.user_id },
                        include: [{
                            model: CampusUsers,
                            attributes: ['firstname', 'lastname', 'middle_initial']
                        }]
                    });
                    if (volunteer && volunteer.CampusUser) {
                        const { firstname, lastname, middle_initial } = volunteer.CampusUser;
                        if (firstname || lastname) {
                            userName = `${firstname || ''} ${middle_initial ? middle_initial + '. ' : ''}${lastname || ''}`.trim();
                        }
                    }
                } else if (roleLower === 'staff') {
                    const staff = await Staff.findOne({
                        where: { staff_id: logData.user_id },
                        attributes: ['firstname', 'lastname', 'middle_initial']
                    });
                    if (staff) {
                        const { firstname, lastname, middle_initial } = staff;
                        if (firstname || lastname) {
                            userName = `${firstname || ''} ${middle_initial ? middle_initial + '. ' : ''}${lastname || ''}`.trim();
                        }
                    }
                } else if (roleLower === 'coordinator' || roleLower === 'assistant_coordinator') {
                    const coordinator = await Coordinator.findOne({
                        where: { coordinator_id: logData.user_id },
                        attributes: ['firstname', 'lastname', 'middle_initial']
                    });
                    if (coordinator) {
                        const { firstname, lastname, middle_initial } = coordinator;
                        if (firstname || lastname) {
                            userName = `${firstname || ''} ${middle_initial ? middle_initial + '. ' : ''}${lastname || ''}`.trim();
                        }
                    }
                } else if (roleLower === 'beneficiary') {
                    const beneficiary = await Beneficiary.findOne({
                        where: { beneficiary_id: logData.user_id },
                        attributes: ['firstname', 'lastname', 'middle_initial']
                    });
                    if (beneficiary) {
                        const { firstname, lastname, middle_initial } = beneficiary;
                        if (firstname || lastname) {
                            userName = `${firstname || ''} ${middle_initial ? middle_initial + '. ' : ''}${lastname || ''}`.trim();
                        }
                    }
                } else if (roleLower === 'donor') {
                    const donor = await Donor.findOne({
                        where: { donor_id: logData.user_id },
                        attributes: ['fullname']
                    });
                    if (donor && donor.fullname) {
                        userName = donor.fullname;
                    }
                }
            } catch (error) {
                console.error(`Error fetching user name for log ${logData.activity_log_id}:`, error.message);
            }

            return {
                ...logData,
                user_name: userName
            };
        }));

        return {
            success: true,
            logs: logsWithNames,
            total: logsWithNames.length
        };
    } catch (error) {
        console.error('Get all users activity logs failed:', error);
        return {
            success: false,
            error: error.message,
            logs: []
        };
    }
};

export const getUserIdFromAccount = async (account_id, role) => {
    try {
        const roleLower = role.toLowerCase();

        if (roleLower === 'volunteer') {
            const campusUser = await CampusUsers.findOne({
                where: { account_id },
                attributes: ['campus_user_id']
            });

            if (!campusUser) {
                return {
                    success: false,
                    user_id: null,
                    error: `CampusUsers not found for account_id: ${account_id}`
                };
            }

            const volunteer = await Volunteer.findOne({
                where: { campus_user_id: campusUser.campus_user_id },
                attributes: ['volunteer_id']
            });

            if (!volunteer) {
                return {
                    success: false,
                    user_id: null,
                    error: `Volunteer not found for campus_user_id: ${campusUser.campus_user_id}`
                };
            }

            return {
                success: true,
                user_id: volunteer.volunteer_id,
                error: null
            };
        }

        const roleIdMap = {
            'director': { model: Director, idField: 'director_id' },
            'staff': { model: Staff, idField: 'staff_id' },
            'coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'assistant_coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'beneficiary': { model: Beneficiary, idField: 'beneficiary_id' },
            'donor': { model: Donor, idField: 'donor_id' }
        };

        const roleConfig = roleIdMap[roleLower];

        if (!roleConfig) {
            return {
                success: false,
                user_id: null,
                error: `Invalid role: ${role}`
            };
        }

        const user = await roleConfig.model.findOne({
            where: { account_id },
            attributes: [roleConfig.idField]
        });

        if (!user) {
            return {
                success: false,
                user_id: null,
                error: `${role} not found for account_id: ${account_id}`
            };
        }

        return {
            success: true,
            user_id: user[roleConfig.idField],
            error: null
        };
    } catch (error) {
        console.error('Get user ID from account failed:', error);
        return {
            success: false,
            user_id: null,
            error: error.message
        };
    }
};