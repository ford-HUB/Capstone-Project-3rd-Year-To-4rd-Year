import { 
    getActivityLogsByAccount, 
    groupLogsForTimeline 
} from "../../services/activityLogService.js";
import { logDirectorActivity } from "../../services/activityLogService.js";

export const getMyActivityLogs = async (req, res) => {
    try {
        const accountId = req.user.account_id;

        const role = 'director';
        const result = await getActivityLogsByAccount(accountId, role);



        const groupedLogs = groupLogsForTimeline(result.logs || []);

        // Log activity - View activity logs
        await logDirectorActivity(
            accountId,
            'access',
            'activity',
            'Viewed activity logs',
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            logs: groupedLogs,
            total: result.total || 0,
            message: 'Activity logs retrieved successfully'
        });

    } catch (error) {
        console.error('Get my activity logs failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
