import { create } from "zustand";
import { 
    createForm, 
    getForms, 
    getFormById, 
    updateForm, 
    deleteForm, 
    getCategories, 
    getEvents,
    getFormsForReflection,
    submitFormResponse,
    submitEventFormResponses,
    getEventsV2,
    getEventFormLinkStatus,
    submitEventGoogleFormLink as submitEventGoogleFormLinkService,
    getGoogleFormLinks as getGoogleFormLinksService,
    getGoogleFormLinkById as getGoogleFormLinkByIdService,
    updateGoogleFormLink as updateGoogleFormLinkService,
    deleteGoogleFormLink as deleteGoogleFormLinkService
} from "../../services/common/formService.js";
import toast from "react-hot-toast";

export const useFormStore = create((set, get) => ({
    forms: [],
    categories: [],
    events: [],
    currentForm: null,
    reflectionForms: [], // Forms for dynamic reflection
    formLinkStatus: null, // Status of form links for selected event
    googleFormLinks: [], // Google Form Links
    googleFormLinksPagination: {}, // Pagination info for Google Form Links
    loading: false,
    error: null,

    // Form management
    createForm: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await createForm(formData);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            // Refresh forms list
            await get().getForms();
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Create form failed:", error.message);
            toast.error("Failed to create form");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    getForms: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getForms(params);
            if (!response.success) {
                set({ forms: [], loading: false, error: response.message });
                return false;
            }
            
            set({ forms: response.forms, loading: false });
            return true;
        } catch (error) {
            console.log("Get forms failed:", error.message);
            set({ forms: [], loading: false, error: error.message });
            return false;
        }
    },

    getFormById: async (formId) => {
        set({ loading: true, error: null });
        try {
            const response = await getFormById(formId);
            if (!response.success) {
                set({ currentForm: null, loading: false, error: response.message });
                return false;
            }
            
            set({ currentForm: response.form, loading: false });
            return true;
        } catch (error) {
            console.log("Get form by ID failed:", error.message);
            set({ currentForm: null, loading: false, error: error.message });
            return false;
        }
    },

    updateForm: async (formId, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await updateForm(formId, formData);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            // Refresh forms list and current form
            await get().getForms();
            await get().getFormById(formId);
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Update form failed:", error.message);
            toast.error("Failed to update form");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    deleteForm: async (formId) => {
        set({ loading: true, error: null });
        try {
            const response = await deleteForm(formId);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            // Refresh forms list
            await get().getForms();
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Delete form failed:", error.message);
            toast.error("Failed to delete form");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    archiveForm: async (formId, isActive) => {
        set({ loading: true, error: null });
        try {
            const response = await updateForm(formId, { is_active: isActive });
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(isActive ? "Form published successfully" : "Form archived successfully");
            // Refresh forms list
            await get().getForms();
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Archive form failed:", error.message);
            toast.error("Failed to update form status");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Categories and Events
    getCategories: async () => {
        try {
            const response = await getCategories();
            if (!response.success) {
                set({ categories: [] });
                return false;
            }
            
            set({ categories: response.categories });
            return true;
        } catch (error) {
            console.log("Get categories failed:", error.message);
            set({ categories: [] });
            return false;
        }
    },

    getEvents: async () => {
        try {
            const response = await getEvents();
            if (!response.success) {
                set({ events: [] });
                return false;
            }
            
            set({ events: response.events });
            return true;
        } catch (error) {
            console.log("Get events failed:", error.message);
            set({ events: [] });
            return false;
        }
    },

    // Get forms for dynamic reflection
    getFormsForReflection: async (params = {}) => {
        try {
            const response = await getFormsForReflection(params);
            if (!response.success) {
                set({ reflectionForms: [] });
                return false;
            }
            
            set({ reflectionForms: response.forms });
            return true;
        } catch (error) {
            console.log("Get forms for reflection failed:", error.message);
            set({ reflectionForms: [] });
            return false;
        }
    },

    // Form response submission
    submitFormResponse: async (formId, responseData) => {
        set({ loading: true, error: null });
        try {
            const response = await submitFormResponse(formId, responseData);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Submit form response failed:", error.message);
            toast.error("Failed to submit form response");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Submit multiple form responses for event evaluation
    submitEventFormResponses: async (formResponses) => {
        set({ loading: true, error: null });
        try {
            const response = await submitEventFormResponses(formResponses);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Submit event form responses failed:", error.message);
            toast.error("Failed to submit form responses");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Form Link Management (v2)
    getEventsV2: async (params = {}) => {
        try {
            const response = await getEventsV2(params);
            
            if (!response.success) {
                set({ events: [] });
                return false;
            }
            
            set({ events: response.events });
            return true;
        } catch (error) {
            set({ events: [] });
            return false;
        }
    },

    submitEventGoogleFormLink: async (formData) => {
        set({ loading: true, error: null });
        try {
            const response = await submitEventGoogleFormLinkService(formData);
            
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            set({ loading: false });
            return true;
        } catch (error) {
            toast.error("Failed to create form link");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    // Get form link status for a specific event
    getEventFormLinkStatus: async (eventId) => {
        set({ loading: true, error: null });
        try {
            const response = await getEventFormLinkStatus(eventId);
            if (!response.success) {
                set({ formLinkStatus: null, loading: false, error: response.message });
                return false;
            }
            
            set({ formLinkStatus: response.status, loading: false });
            return true;
        } catch (error) {
            console.log("Get event form link status failed:", error.message);
            set({ formLinkStatus: null, loading: false, error: error.message });
            return false;
        }
    },

    // Google Form Links management
    getGoogleFormLinks: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await getGoogleFormLinksService(params);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            set({ 
                googleFormLinks: response.data.formLinks,
                googleFormLinksPagination: response.data.pagination,
                loading: false 
            });
            return true;
        } catch (error) {
            console.log("Get Google Form links failed:", error.message);
            toast.error("Failed to fetch Google Form links");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    getGoogleFormLinkById: async (formlinkId) => {
        set({ loading: true, error: null });
        try {
            const response = await getGoogleFormLinkByIdService(formlinkId);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return null;
            }
            
            set({ loading: false });
            return response.formLink;
        } catch (error) {
            console.log("Get Google Form link by ID failed:", error.message);
            toast.error("Failed to fetch form link");
            set({ loading: false, error: error.message });
            return null;
        }
    },

    updateGoogleFormLink: async (formlinkId, formData) => {
        set({ loading: true, error: null });
        try {
            const response = await updateGoogleFormLinkService(formlinkId, formData);
            if (!response.success) {
                toast.error(response.message);
                set({ loading: false, error: response.message });
                return false;
            }
            
            toast.success(response.message);
            // Refresh the Google Form Links list
            await get().getGoogleFormLinks();
            set({ loading: false });
            return true;
        } catch (error) {
            console.log("Update Google Form link failed:", error.message);
            toast.error("Failed to update form link");
            set({ loading: false, error: error.message });
            return false;
        }
    },

    deleteGoogleFormLink: async (formlinkId) => {
        const response = await deleteGoogleFormLinkService(formlinkId);
        
        if (response.success) {
            toast.success(response.message);
            // Remove the deleted item from the current list
            set(state => ({
                googleFormLinks: state.googleFormLinks.filter(link => link.formlink_id !== formlinkId),
                googleFormLinksPagination: {
                    ...state.googleFormLinksPagination,
                    totalItems: Math.max(0, state.googleFormLinksPagination.totalItems - 1)
                }
            }));
            return true;
        } else {
            toast.error(response.message);
            return false;
        }
    },

    // Utility functions
    clearCurrentForm: () => {
        set({ currentForm: null });
    },

    clearError: () => {
        set({ error: null });
    }
}));
