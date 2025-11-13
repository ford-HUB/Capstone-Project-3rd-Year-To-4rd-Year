import { create } from 'zustand';
import { 
    createRequirement as createRequirementService, 
    getAllRequirements, 
    getRequirementsForRole, 
    updateRequirement as updateRequirementService, 
    deleteRequirement as deleteRequirementService 
} from '../../services/common/requirementsService.js';
import toast from 'react-hot-toast';

const useRequirementsStore = create((set) => ({
    // State
    requirements: [],
    loading: false,
    error: null,

    // Fetch requirements for a specific role
    fetchRequirementsForRole: async (role) => {
        try {
            set({ loading: true, error: null });
            const response = await getRequirementsForRole(role);
            if (!response.success) {
                set({ loading: false, error: response.message });
                return false;
            }
            set({ requirements: response.data, loading: false, error: null });
            return true;
        } catch (error) {
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Fetch all requirements (for directors)
    fetchAllRequirements: async () => {
        try {
            set({ loading: true });
            const response = await getAllRequirements();
            if (!response.success) {
                set({ loading: false, error: response.message });
                return false;
            }
            set({ requirements: response.data, loading: false, error: null });
            return true;
        } catch (error) {
            console.log('fetch all requirements failed:', error.message);
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Create a new requirement
    createRequirement: async (requirementData) => {
        try {
            const response = await createRequirementService(requirementData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            toast.success(response.message);
            
            // Add new requirement to local state immediately for instant UI update
            if (response.data) {
                set(state => ({
                    requirements: [response.data, ...state.requirements]
                }));
            } else {
                // Fallback: refresh requirements list if response.data is not available
                await get().fetchAllRequirements();
            }
            
            return true;
        } catch (error) {
            console.log('create requirement failed:', error.message);
            return false;
        }
    },

    // Update a requirement
    updateRequirement: async (id, requirementData) => {
        try {
            const response = await updateRequirementService(id, requirementData);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            toast.success(response.message);
            
            // Update local state immediately for instant UI update
            set(state => ({
                requirements: state.requirements.map(req => 
                    req.requirement_id === parseInt(id) 
                        ? { ...req, ...requirementData, due_date: requirementData.dueDate, is_required: requirementData.isRequired }
                        : req
                )
            }));
            
            return true;
        } catch (error) {
            console.log('update requirement failed:', error.message);
            return false;
        }
    },

    // Delete a requirement
    deleteRequirement: async (id) => {
        try {
            const response = await deleteRequirementService(id);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            set(state => ({
                requirements: state.requirements.filter(req => req.requirement_id !== id)
            }));
            toast.success(response.message);
            return true;
        } catch (error) {
            console.log('delete requirement failed:', error.message);
            return false;
        }
    }
}));

export default useRequirementsStore;
