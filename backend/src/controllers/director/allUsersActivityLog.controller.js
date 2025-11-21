import { 
    getAllUsersActivityLogs as getAllUsersActivityLogsService, 
    groupLogsForTimeline 
} from "../../services/activityLogService.js";

export const getAllUsersActivityLogs = async (req, res) => {
    try {
        const { limit, offset, order } = req.query;

        const options = {
            limit: limit ? parseInt(limit) : null,
            offset: offset ? parseInt(offset) : 0,
            order: order || 'DESC',
            roles: ['staff', 'coordinator', 'assistant_coordinator', 'volunteer', 'beneficiary', 'donor']
        };

        const result = await getAllUsersActivityLogsService(options);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error || 'Failed to fetch activity logs'
            });
        }

        const groupedLogs = groupLogsForTimeline(result.logs || []);

        return res.json({
            success: true,
            logs: groupedLogs,
            total: result.total || 0,
            message: 'All users activity logs retrieved successfully'
        });

    } catch (error) {
        console.error('Get all users activity logs failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

