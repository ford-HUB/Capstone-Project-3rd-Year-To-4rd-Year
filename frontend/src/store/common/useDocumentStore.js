import { create } from "zustand";
import { uploadDocument, getAllDocuments, deleteDocument } from "../../services/common/documentService.js";
import toast from "react-hot-toast";

export const useDocumentStore = create((set) => ({
    documentList: [],
    
    uploadDocs: async (formData) => {
        try {
            const response = await uploadDocument(formData)
            if(!response.success) {
                toast.error(response.message || 'something was wrong')
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('upload docs failed: ', error.message)
        }
    },

    getAllDocuments: async (tab = null) => {
        try {
            const response = await getAllDocuments(tab)
            if(!response.success) {
                set({ documentList: null })
                console.log('failed fetch')
                return false
            }

            set({ documentList: response.list })
            return true
        } catch (error) {
            console.log('get all documents failed: ', error.message)
        }
    },

    deleteDocument: async (ids) => {
        try {
            const response = await deleteDocument(ids)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true

        } catch (error) {
            console.log('delete document failed: ', error.message)
        }
    }
}))