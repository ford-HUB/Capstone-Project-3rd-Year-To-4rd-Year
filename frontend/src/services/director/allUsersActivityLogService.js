import { apiInstance } from '../../api/_base.js';

export const getAllUsersActivityLogs = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.order) queryParams.append('order', params.order);

    const url = `/api/director/all-users-activity-log/recorded${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await apiInstance.get(url);
    return response.data;
};

