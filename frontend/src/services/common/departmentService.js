import { apiInstance } from '../../api/_base.js';

export const getAllDepartments = async () => {
    try {
        const response = await apiInstance.get('/api/submissions/departments');
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};
