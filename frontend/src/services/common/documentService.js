import { apiInstance } from "../../api/_base.js";

export const uploadDocument = async (formData) => {
    const response = await apiInstance.post('/api/document/upload-documents', formData)

    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getAllDocuments = async (tab = null) => {
    const url = tab ? `/api/document/documents-list?tab=${tab}` : '/api/document/documents-list';
    const response = await apiInstance.get(url)
    return {
        success: response.data.success,
        list: response.data.list
    }
}

export const deleteDocument = async (ids) => {
    const response = await apiInstance.delete(`/api/document/delete-document/${ids}`)
    return {
        success: response.data.success,
        message: response.data.message
    }
}