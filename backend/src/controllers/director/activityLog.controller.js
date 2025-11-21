import { 
    getActivityLogsByAccount, 
    groupLogsForTimeline 
} from "../../services/activityLogService.js";

export const getMyActivityLogs = async (req, res) => {
    try {
        const accountId = req.user.account_id;
        const role = 'director';

        const result = await getActivityLogsByAccount(accountId, role);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.error || 'Failed to fetch activity logs'
            });
        }

        const groupedLogs = groupLogsForTimeline(result.logs);

        return res.json({
            success: true,
            logs: groupedLogs,
            total: result.total,
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
