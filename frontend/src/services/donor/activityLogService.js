import { apiInstance } from '../../api/_base.js';

export const getMyActivityLogs = async () => {
    const response = await apiInstance.get('/api/donor/activity-log/my-logs');
    return response.data;
};

