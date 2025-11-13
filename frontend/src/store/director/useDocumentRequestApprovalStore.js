import { create } from "zustand";
import toast from "react-hot-toast";
import {
    getDocumentRequestApprovals,
    getDocumentRequestApprovalById,
    createDocumentRequestApproval,
    updateDocumentRequestApprovalStatus,
    deleteDocumentRequestApproval
} from "../../services/director/documentRequestApprovalService.js";

export const useDocumentRequestApprovalStore = create((set, get) => ({
    // State
    documentRequests: [],
    selectedRequest: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        itemsPerPage: 10
    },

    // Fetch all document request approvals with filters
    fetchDocumentRequests: async (filters = {}) => {
        try {
            set({ loading: true, error: null });
            
            const response = await getDocumentRequestApprovals(filters);
            
            if (!response.success) {
                set({ 
                    loading: false, 
                    error: response.message,
                    documentRequests: []
                });
                toast.error(response.message || 'Failed to fetch document requests');
                return false;
            }

            set({ 
                documentRequests: response.data || [],
                loading: false,
                error: null
            });
            
            return true;
        } catch (error) {
            console.error('Fetch document requests failed:', error.message);
            set({ 
                loading: false, 
                error: error.message,
                documentRequests: []
            });
            toast.error('Failed to fetch document requests');
            return false;
        }
    },

    // Get single document request approval by ID
    fetchDocumentRequestById: async (dra_id) => {
        try {
            set({ loading: true, error: null });
            
            const response = await getDocumentRequestApprovalById(dra_id);
            
            if (!response.success) {
                set({ 
                    loading: false, 
                    error: response.message,
                    selectedRequest: null
                });
                toast.error(response.message || 'Failed to fetch document request');
                return false;
            }

            set({ 
                selectedRequest: response.data,
                loading: false,
                error: null
            });
            
            return true;
        } catch (error) {
            console.error('Fetch document request by ID failed:', error.message);
            set({ 
                loading: false, 
                error: error.message,
                selectedRequest: null
            });
            toast.error('Failed to fetch document request');
            return false;
        }
    },

    // Create new document request approval
    createDocumentRequest: async (requestData) => {
        try {
            set({ loading: true, error: null });
            
            const response = await createDocumentRequestApproval(requestData);
            
            if (!response.success) {
                set({ loading: false, error: response.message });
                toast.error(response.message || 'Failed to create document request');
                return false;
            }

            toast.success(response.message || 'Document request created successfully');
            
            // Refresh the list
            await get().fetchDocumentRequests();
            
            set({ loading: false, error: null });
            return true;
        } catch (error) {
            console.error('Create document request failed:', error.message);
            set({ loading: false, error: error.message });
            toast.error('Failed to create document request');
            return false;
        }
    },

    // Update document request approval status (approve/reject)
    updateRequestStatus: async (dra_id, statusData) => {
        try {
            set({ loading: true, error: null });
            
            const response = await updateDocumentRequestApprovalStatus(dra_id, statusData);
            
            if (!response.success) {
                set({ loading: false, error: response.message });
                toast.error(response.message || 'Failed to update request status');
                return false;
            }

            const statusText = statusData.status === 'approved' ? 'approved' : 'rejected';
            toast.success(`Document request ${statusText} successfully`);
            
            // Update the specific request in the list
            const { documentRequests } = get();
            const updatedRequests = documentRequests.map(request => 
                request.dra_id === dra_id 
                    ? { ...request, ...response.data }
                    : request
            );
            
            set({ 
                documentRequests: updatedRequests,
                loading: false,
                error: null
            });
            
            return true;
        } catch (error) {
            console.error('Update request status failed:', error.message);
            set({ loading: false, error: error.message });
            toast.error('Failed to update request status');
            return false;
        }
    },

    // Delete document request approval
    deleteDocumentRequest: async (dra_id) => {
        try {
            set({ loading: true, error: null });
            
            const response = await deleteDocumentRequestApproval(dra_id);
            
            if (!response.success) {
                set({ loading: false, error: response.message });
                toast.error(response.message || 'Failed to delete document request');
                return false;
            }

            toast.success(response.message || 'Document request deleted successfully');
            
            // Remove the request from the list
            const { documentRequests } = get();
            const updatedRequests = documentRequests.filter(request => request.dra_id !== dra_id);
            
            set({ 
                documentRequests: updatedRequests,
                loading: false,
                error: null
            });
            
            return true;
        } catch (error) {
            console.error('Delete document request failed:', error.message);
            set({ loading: false, error: error.message });
            toast.error('Failed to delete document request');
            return false;
        }
    },

    // Bulk actions
    bulkUpdateStatus: async (dra_ids, statusData) => {
        try {
            set({ loading: true, error: null });
            
            const promises = dra_ids.map(dra_id => 
                updateDocumentRequestApprovalStatus(dra_id, statusData)
            );
            
            const results = await Promise.all(promises);
            const failed = results.filter(result => !result.success);
            
            if (failed.length > 0) {
                toast.error(`${failed.length} requests failed to update`);
                set({ loading: false, error: 'Some requests failed to update' });
                return false;
            }

            const statusText = statusData.status === 'approved' ? 'approved' : 'rejected';
            toast.success(`${dra_ids.length} document requests ${statusText} successfully`);
            
            // Refresh the list
            await get().fetchDocumentRequests();
            
            set({ loading: false, error: null });
            return true;
        } catch (error) {
            console.error('Bulk update status failed:', error.message);
            set({ loading: false, error: error.message });
            toast.error('Failed to update multiple requests');
            return false;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Set selected request
    setSelectedRequest: (request) => set({ selectedRequest: request }),

    // Update pagination
    setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),

    // Reset store
    reset: () => set({
        documentRequests: [],
        selectedRequest: null,
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            itemsPerPage: 10
        }
    })
}));
