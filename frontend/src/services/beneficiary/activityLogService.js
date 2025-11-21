import { apiInstance } from '../../api/_base.js';

export const getMyActivityLogs = async () => {
    const response = await apiInstance.get('/api/beneficiary/activity-log/my-logs');
    return response.data;
};

