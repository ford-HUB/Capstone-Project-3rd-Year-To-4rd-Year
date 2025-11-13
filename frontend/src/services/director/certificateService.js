import { apiInstance } from "../../api/_base.js";

export const getCertificateTemplates = async () => {
    const response = await apiInstance('/api/certificate/get-certificate-templates')
    return {
        success: response.data.success,
        fileData: response.data.fileData
    }
}

export const createCertificateTemplate = async (formData) => {
    const response = await apiInstance.post('/api/certificate/assign-certificate-template', formData)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getDeployedCertificateTemplates = async (page, limit) => {
    const response = await apiInstance.get(`/api/certificate/get-deployed-template-certificates?page=${page}&limit=${limit}`)
    return {
        success: response.data.success,
        ct_data: response.data.certificate_template_data,
        pagination: {
            totalRecords: response.data.pagination.totalRecords,
            totalPages: response.data.pagination.totalPages,
            pageSize: response.data.pagination.pageSize
        }
    }
}

export const deleteCertificateTemplate = async (ct_id) => {
    const response = await apiInstance.delete(`/api/certificate/delete-certificate-template/${ct_id}`)
    return {
        success: response.data.success,
        message: response.data.message,
        deletedTemplate: response.data.deletedTemplate
    }
}