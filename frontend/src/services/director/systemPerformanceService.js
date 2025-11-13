import { apiInstance } from "../../api/_base.js";

export const getSystemPerformanceMetrics = async () => {
    const response = await apiInstance.get('/api/director/system-performance/metrics');
    return {
        success: response.data.success,
        data: response.data.data
    };
};

export const getPerformanceHistory = async (hours = 24) => {
    const response = await apiInstance.get(`/api/director/system-performance/history?hours=${hours}`);
    return {
        success: response.data.success,
        data: response.data.data
    };
};
