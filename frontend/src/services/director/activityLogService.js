import { apiInstance } from '../../api/_base.js';

/**
 * Get activity logs for the current director
 */
export const getMyActivityLogs = async () => {
    const response = await apiInstance.get('/api/director/activity-log/my-logs');
    return response.data;
};

