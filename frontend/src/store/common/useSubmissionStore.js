import { create } from 'zustand';
import { 
    createSubmission as createSubmissionService, 
    getSubmissions, 
    getAllDocumentsAsSubmissions,
    getSubmissionById, 
    updateSubmission as updateSubmissionService, 
    deleteSubmission as deleteSubmissionService 
} from '../../services/common/submissionService.js';
import toast from 'react-hot-toast';

const useSubmissionStore = create((set, get) => ({
    // State
    submissions: [],
    loading: false,
    error: null,

    // Fetch submissions with filtering (includes director documents)
    fetchSubmissions: async (filters = {}) => {
        try {
            set({ loading: true });
            
            // Fetch all documents as submissions (primary data source)
            const allDocsResponse = await getAllDocumentsAsSubmissions(filters);
            console.log('All documents response:', allDocsResponse);
            if (!allDocsResponse.success) {
                set({ loading: false, error: allDocsResponse.message });
                return false;
            }
            
            // Use documents as the primary data source
            const allSubmissions = allDocsResponse.data || [];
            
            console.log('All documents as submissions:', allSubmissions.length);
            
            // Sort by creation date (newest first)
            allSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            set({ submissions: allSubmissions, loading: false, error: null });
            return true;
        } catch (error) {
            console.log('fetch submissions failed:', error.message);
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Create a new submission
    createSubmission: async (submissionData) => {
        try {
            const response = await createSubmissionService(submissionData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            toast.success(response.message);
            
            // Add new submission to local state immediately for instant UI update
            if (response.data) {
                set(state => ({
                    submissions: [response.data, ...state.submissions]
                }));
            } else {
                // Fallback: refresh submissions list if response.data is not available
                await get().fetchSubmissions();
            }
            
            return true;
        } catch (error) {
            console.log('create submission failed:', error.message);
            toast.error('Failed to create submission');
            return false;
        }
    },

    // Update a submission
    updateSubmission: async (id, submissionData) => {
        try {
            const response = await updateSubmissionService(id, submissionData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            toast.success(response.message);
            
            // Update local state immediately for instant UI update
            set(state => ({
                submissions: state.submissions.map(sub => 
                    sub.submission_id === parseInt(id) 
                        ? { ...sub, ...submissionData }
                        : sub
                )
            }));
            
            return true;
        } catch (error) {
            console.log('update submission failed:', error.message);
            toast.error('Failed to update submission');
            return false;
        }
    },

    // Delete a submission
    deleteSubmission: async (id) => {
        try {
            const response = await deleteSubmissionService(id);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            set(state => ({
                submissions: state.submissions.filter(sub => sub.submission_id !== id)
            }));
            toast.success(response.message);
            return true;
        } catch (error) {
            console.log('delete submission failed:', error.message);
            toast.error('Failed to delete submission');
            return false;
        }
    },

    // Get submission by ID
    getSubmissionById: async (id) => {
        try {
            const response = await getSubmissionById(id);
            if (!response.success) {
                return null;
            }
            return response.data;
        } catch (error) {
            console.log('get submission by id failed:', error.message);
            return null;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Reset state
    reset: () => set({ submissions: [], loading: false, error: null })
}));

export default useSubmissionStore;
