import { create } from "zustand";
import { 
    submitBeneficiaryEventEvaluation,
    getBeneficiaryEvaluationForm
} from "../../services/beneficiary/beneficiaryEvaluationService.js";
import { 
    getFormsForReflection,
    submitFormResponse,
    submitEventFormResponses
} from "../../services/common/formService.js";

export const useBeneficiaryEvaluationStore = create((set, get) => ({
    // Form schema state
    formSchema: null,
    dynamicForms: [], // For dynamic forms like volunteer evaluation
    isLoadingForm: false,
    formError: null,

    // Submission state
    isSubmitting: false,
    error: null,
    success: false,

    // Fetch form schema - now supports both single form and dynamic forms
    fetchFormSchema: async (eventId) => {
        set({ isLoadingForm: true, formError: null, dynamicForms: [] });

        try {
            // First try to get beneficiary-specific form
            const response = await getBeneficiaryEvaluationForm(eventId);

            if (response.success) {
                set({
                    formSchema: response.form,
                    formError: null
                });
                return { success: true, formSchema: response.form };
            } else {
                // If no beneficiary-specific form, try to get dynamic forms for reflection
                console.log('No beneficiary form found, trying dynamic forms...');
                
                // Try to get dynamic forms for this event
                const dynamicResponse = await getFormsForReflection({ event_id: eventId });
                
                if (dynamicResponse.success && dynamicResponse.forms && dynamicResponse.forms.length > 0) {
                    // Filter forms for beneficiary target_role, general forms, or hint-based matching
                    const beneficiaryForms = dynamicResponse.forms.filter(form => {
                        // Check target_role
                        if (!form.target_role || form.target_role === 'beneficiary' || form.target_role === 'all') {
                            return true;
                        }
                        // Check hint-based matching with title containing "Beneficiary Event Feedback"
                        if (form.title && form.title.toLowerCase().includes('beneficiary event feedback')) {
                            return true;
                        }
                        return false;
                    });
                    
                    if (beneficiaryForms.length > 0) {
                        set({
                            dynamicForms: beneficiaryForms,
                            formSchema: null,
                            formError: null
                        });
                        return { success: true, dynamicForms: beneficiaryForms };
                    }
                }
                
                // If no dynamic forms either, show waiting message
                set({ formError: null, formSchema: null, dynamicForms: [] });
                return { success: false, message: response.message, waitingForDirector: true };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load evaluation form.';
            set({ formError: errorMessage, formSchema: null, dynamicForms: [] });
            return { success: false, message: errorMessage };
        } finally {
            set({ isLoadingForm: false });
        }
    },

    // Submit evaluation
    submitEvaluation: async (eventId, evaluationData) => {
        set({ isSubmitting: true, error: null, success: false });
        
        try {
            const response = await submitBeneficiaryEventEvaluation(eventId, evaluationData);
            
            if (response.success) {
                set({ success: true, error: null });
                return { success: true, message: response.message };
            } else {
                set({ error: response.message, success: false });
                return { success: false, message: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit evaluation. Please try again.';
            set({ error: errorMessage, success: false });
            return { success: false, message: errorMessage };
        } finally {
            set({ isSubmitting: false });
        }
    },

    // Submit single form response
    submitSingleFormResponse: async (formId, responseData) => {
        set({ isSubmitting: true, error: null, success: false });
        
        try {
            const response = await submitFormResponse(formId, responseData, 'beneficiary');
            
            if (response.success) {
                set({ success: true, error: null });
                return { success: true, message: response.message };
            } else {
                set({ error: response.message, success: false });
                return { success: false, message: response.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit form response. Please try again.';
            set({ error: errorMessage, success: false });
            return { success: false, message: errorMessage };
        } finally {
            set({ isSubmitting: false });
        }
    },

    // Submit multiple form responses (same as volunteers)
    submitMultipleFormResponses: async (formResponses) => {
        console.group("🏪 Store: submitMultipleFormResponses");
        console.log("📤 Submitting form responses:", formResponses);
        
        set({ isSubmitting: true, error: null, success: false });
        
        try {
            console.log("⏳ Calling submitEventFormResponses service...");
            const response = await submitEventFormResponses(formResponses);
            console.log("📡 Service response:", response);
            
            if (response.success) {
                console.log("✅ Form responses submitted successfully");
                set({ success: true, error: null });
                console.groupEnd();
                return { success: true, message: response.message };
            } else {
                console.error("❌ Form responses submission failed:", response);
                set({ error: response.message, success: false });
                console.groupEnd();
                return { success: false, message: response.message };
            }
        } catch (error) {
            console.error("🚨 Error in submitMultipleFormResponses:", error);
            console.error("🚨 Error details:", error.response?.data);
            const errorMessage = error.response?.data?.message || 'Failed to submit form responses. Please try again.';
            set({ error: errorMessage, success: false });
            console.groupEnd();
            return { success: false, message: errorMessage };
        } finally {
            set({ isSubmitting: false });
        }
    },

    // Clear all state
    clearState: () => {
        set({ 
            error: null, 
            success: false, 
            isSubmitting: false,
            formSchema: null,
            dynamicForms: [],
            formError: null,
            isLoadingForm: false
        });
    },

    // Clear only form state
    clearFormState: () => {
        set({
            formSchema: null,
            dynamicForms: [],
            formError: null,
            isLoadingForm: false
        });
    }
}));
