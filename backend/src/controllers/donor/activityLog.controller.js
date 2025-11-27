import { 
    getActivityLogsByAccount, 
    groupLogsForTimeline 
} from "../../services/activityLogService.js";
import { logDonorActivity } from "../../services/activityLogService.js";

export const getMyActivityLogs = async (req, res) => {
    try {
        const accountId = req.user.account_id;
        const role = req.user.Role.name.toLowerCase();

        const result = await getActivityLogsByAccount(accountId, role);

        const groupedLogs = groupLogsForTimeline(result.logs || []);

        // Log activity - View activity logs
        await logDonorActivity(
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

