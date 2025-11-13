import { create } from 'zustand';
import { getMonthlyTodoDocuments, getMonthlyTodoDocumentsForRole } from '../../services/common/monthlyTodoService.js';
import toast from 'react-hot-toast';

const useMonthlyTodoStore = create((set, get) => ({
    // State
    monthlyTodoDocuments: [],
    monthlyTodoRequirements: [],
    loading: false,
    error: null,
    lastFetched: null,

    // Fetch monthlyTodo documents
    fetchMonthlyTodoDocuments: async (filters = {}) => {
        try {
            set({ loading: true, error: null });
            
            const response = await getMonthlyTodoDocuments(filters);
            
            if (response.success) {
                set({ 
                    monthlyTodoDocuments: response.data, 
                    monthlyTodoRequirements: response.requirements || [],
                    loading: false, 
                    error: null,
                    lastFetched: new Date()
                });
                return true;
            } else {
                set({ 
                    loading: false, 
                    error: response.message,
                    monthlyTodoDocuments: [],
                    monthlyTodoRequirements: []
                });
                toast.error(response.message || 'Failed to fetch monthlyTodo documents');
                return false;
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error.message,
                monthlyTodoDocuments: []
            });
            toast.error('Failed to fetch monthlyTodo documents');
            return false;
        }
    },

    // Fetch monthlyTodo documents for specific role
    fetchMonthlyTodoDocumentsForRole: async (userRole, filters = {}) => {
        try {
            set({ loading: true, error: null });
            
            const response = await getMonthlyTodoDocumentsForRole(userRole, filters);
            
            if (response.success) {
                set({ 
                    monthlyTodoDocuments: response.data, 
                    monthlyTodoRequirements: response.requirements || [],
                    loading: false, 
                    error: null,
                    lastFetched: new Date()
                });
                return true;
            } else {
                set({ 
                    loading: false, 
                    error: response.message,
                    monthlyTodoDocuments: [],
                    monthlyTodoRequirements: []
                });
                toast.error(response.message || 'Failed to fetch monthlyTodo documents');
                return false;
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error.message,
                monthlyTodoDocuments: [],
                monthlyTodoRequirements: []
            });
            toast.error('Failed to fetch monthlyTodo documents');
            return false;
        }
    },

    // Clear monthlyTodo documents
    clearMonthlyTodoDocuments: () => {
        set({ 
            monthlyTodoDocuments: [], 
            monthlyTodoRequirements: [],
            loading: false, 
            error: null,
            lastFetched: null
        });
    },

    // Get filtered monthlyTodo documents (for specific month, role, etc.)
    getFilteredMonthlyTodoDocuments: (filters = {}) => {
        const { monthlyTodoDocuments } = get();
        
        if (!monthlyTodoDocuments || monthlyTodoDocuments.length === 0) {
            return [];
        }

        let filtered = [...monthlyTodoDocuments];

        // Apply filters
        if (filters.month) {
            // Filter by month logic can be added here
        }

        if (filters.role) {
            // Filter by role logic can be added here
        }

        if (filters.status) {
            filtered = filtered.filter(doc => doc.status === filters.status);
        }

        if (filters.approval_status) {
            filtered = filtered.filter(doc => doc.approval_status === filters.approval_status);
        }

        return filtered;
    },

    // Refresh monthlyTodo documents
    refreshMonthlyTodoDocuments: async (filters = {}) => {
        return await get().fetchMonthlyTodoDocuments(filters);
    }
}));

export default useMonthlyTodoStore;
