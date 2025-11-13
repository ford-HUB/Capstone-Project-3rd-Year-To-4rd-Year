import { apiInstance } from "../../api/_base.js";

export const fetchVolunteers = async () => {
    const response = await apiInstance.get('/api/director-manage-volunteer/list-volunteer')
    return {
        success: response.data.success,
        volunteers: response.data.list,
        message: response.data.message
    }
}