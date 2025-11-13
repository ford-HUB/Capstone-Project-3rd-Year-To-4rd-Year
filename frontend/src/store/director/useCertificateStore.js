import { create } from "zustand";
import { createCertificateTemplate, getCertificateTemplates, getDeployedCertificateTemplates, deleteCertificateTemplate } from "../../services/director/certificateService.js";
import toast from "react-hot-toast";

export const useCertificateStore = create((set) => ({
    fileData: [],
    error: null,
    loading: false,

    getCertificateTemplates: async () => {
        try {
            set({ loading: true })
            const response = await getCertificateTemplates()
            if(!response.success) {
                set({ fileData: [], loading: false })
                console.log('get certificate failed to fetch')
                return false
            }

            set({ fileData: response.fileData, loading: false })
            return true
        } catch (error) {
            set({ error: error })
            console.log('get certificate templates failed: ', error.message)
        }finally {
            set({ loading: false })
        }
    },

    createCertificateTemplate: async (formData) => {
        try {
            const response = await createCertificateTemplate(formData)
            if(!response.success) { 
                return toast.error(response.message) 
            }
            toast.success(response.message)
            return true
        } catch (error) {
            set({ error: error })
            console.log('create certificate template failed: ', error)
        }
    },

    getDeployedCertificateTemplates: async (page, limit) => {
        try {
            const response = await getDeployedCertificateTemplates(page, limit)
            if(!response.success) {
                return false
            }

            return {
                success: response.success,
                ct_data: response.ct_data,
                pagination: {
                    totalRecords: response.pagination.totalRecords,
                    totalPages: response.pagination.totalPages,
                    pageSize: response.pagination.pageSize
                }
            }

        } catch (error) {
            console.log('get certificate templates failed: ', error)
        }
    },

    deleteCertificateTemplate: async (ct_id) => {
        try {
            set({ loading: true })
            const response = await deleteCertificateTemplate(ct_id)
            if(!response.success) {
                toast.error(response.message)
                set({ loading: false })
                return false
            }

            toast.success(response.message)
            set({ loading: false })
            return {
                success: true,
                deletedTemplate: response.deletedTemplate
            }

        } catch (error) {
            console.log('delete certificate template failed: ', error.message)
            toast.error('Failed to delete certificate template')
            set({ loading: false })
            return false
        }
    }
}))