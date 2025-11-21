import models from "../models/index.js";
import { Op } from "sequelize";

const { ActivityLog, Director, Staff, Coordinator, Volunteer, Beneficiary, Donor } = models;

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
        let user_id = null;

        const roleIdMap = {
            'director': { model: Director, idField: 'director_id' },
            'staff': { model: Staff, idField: 'staff_id' },
            'coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'assistant_coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'volunteer': { model: Volunteer, idField: 'volunteer_id' },
            'beneficiary': { model: Beneficiary, idField: 'beneficiary_id' },
            'donor': { model: Donor, idField: 'donor_id' }
        };

        const roleConfig = roleIdMap[role.toLowerCase()];
        
        if (!roleConfig) {
            return {
                success: false,
                error: `Invalid role: ${role}`,
                logs: []
            };
        }

        const user = await roleConfig.model.findOne({
            where: { account_id },
            attributes: [roleConfig.idField]
        });

        if (!user) {
            return {
                success: false,
                error: `${role} not found`,
                logs: []
            };
        }

        user_id = user[roleConfig.idField];

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
            role: log.role || null
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
        const directorInfo = await getUserIdFromAccount(account_id, 'director');
        if (directorInfo.success) {
            await createActivityLog({
                user_id: directorInfo.user_id,
                role: 'director',
                action,
                module,
                description,
                ip_address,
                user_agent
            });
        }
    } catch (error) {
        // Silent fail - logging errors shouldn't break main functionality
        console.error('Failed to create activity log:', error.message);
    }
};


export const logActivity = async (user_id, role, action, module, description, ip_address = null, user_agent = null) => {
    try {
        await createActivityLog({
            user_id,
            role,
            action,
            module,
            description,
            ip_address,
            user_agent
        });
    } catch (error) {
        // Silent fail - logging errors shouldn't break main functionality
        console.error('Failed to create activity log:', error.message);
    }
};

export const logManagementActivity = async (account_id, role, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const userInfo = await getUserIdFromAccount(account_id, role);
        if (userInfo.success) {
            await createActivityLog({
                user_id: userInfo.user_id,
                role: role.toLowerCase(),
                action,
                module,
                description,
                ip_address,
                user_agent
            });
        }
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logParticipantActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const userInfo = await getUserIdFromAccount(account_id, 'volunteer');
        if (userInfo.success) {
            await createActivityLog({
                user_id: userInfo.user_id,
                role: 'volunteer',
                action,
                module,
                description,
                ip_address,
                user_agent
            });
        }
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logBeneficiaryActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const userInfo = await getUserIdFromAccount(account_id, 'beneficiary');
        if (userInfo.success) {
            await createActivityLog({
                user_id: userInfo.user_id,
                role: 'beneficiary',
                action,
                module,
                description,
                ip_address,
                user_agent
            });
        }
    } catch (error) {
        console.error('Failed to create activity log:', error.message);
    }
};

export const logDonorActivity = async (account_id, action, module, description, ip_address = null, user_agent = null) => {
    try {
        const userInfo = await getUserIdFromAccount(account_id, 'donor');
        if (userInfo.success) {
            await createActivityLog({
                user_id: userInfo.user_id,
                role: 'donor',
                action,
                module,
                description,
                ip_address,
                user_agent
            });
        }
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

        return {
            success: true,
            logs: logs.map(log => log.toJSON()),
            total: logs.length
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
        const roleIdMap = {
            'director': { model: Director, idField: 'director_id' },
            'staff': { model: Staff, idField: 'staff_id' },
            'coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'assistant_coordinator': { model: Coordinator, idField: 'coordinator_id' },
            'volunteer': { model: Volunteer, idField: 'volunteer_id' },
            'beneficiary': { model: Beneficiary, idField: 'beneficiary_id' },
            'donor': { model: Donor, idField: 'donor_id' }
        };

        const roleConfig = roleIdMap[role.toLowerCase()];
        
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