import { create } from 'zustand';
import { submitGoodsDonation, getEventGoodsTypes } from '../../services/donation/donationService.js';
import toast from 'react-hot-toast';

const useGoodsDonationStore = create((set, get) => ({
    // State
    formData: {
        // Goods information
        goodsType: '',
        goodsDescription: '',
        quantity: '',
        quantityUnit: '',
        condition: '',
        
        // Drop-off information
        dropoffLocation: 'uclm_location',
        preferredDate: '',
        preferredTime: '',
        
        // Preferences
        isAnonymous: false,
        showReceipt: true
    },
    currentStep: 1,
    errors: {},
    isProcessing: false,
    isSubmitted: false,
    submissionData: null,
    enabledGoodsTypes: [],

    // Update form data
    updateFormData: (field, value) => {
        set((state) => ({
            formData: {
                ...state.formData,
                [field]: value
            }
        }));
    },

    // Handle input change
    handleInputChange: (name, value, type, checked) => {
        set((state) => {
            const newFormData = {
                ...state.formData,
                [name]: type === 'checkbox' ? checked : value
            };
            
            // Clear condition when items that don't need condition are selected
            const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine'];
            if (name === 'goodsType' && noConditionTypes.includes(value)) {
                newFormData.condition = '';
                // Also clear condition error if exists
                if (state.errors.condition) {
                    return {
                        formData: newFormData,
                        errors: {
                            ...state.errors,
                            condition: ''
                        }
                    };
                }
            }
            
            return { formData: newFormData };
        });
    },

    // Clear error for a specific field
    clearError: (field) => {
        set((state) => ({
            errors: {
                ...state.errors,
                [field]: ''
            }
        }));
    },

    // Set errors
    setErrors: (errors) => {
        set({ errors });
    },

    // Navigate steps
    nextStep: () => {
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, 3)
        }));
    },

    prevStep: () => {
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1)
        }));
    },

    setCurrentStep: (step) => {
        set({ currentStep: step });
    },

    // Validate current step
    validateCurrentStep: () => {
        const { formData, currentStep } = get();
        const newErrors = {};

        switch (currentStep) {
            case 1:
                if (!formData.goodsType || formData.goodsType.trim() === '') {
                    newErrors.goodsType = 'Please select a goods type';
                }
                if (!formData.goodsDescription.trim()) {
                    newErrors.goodsDescription = 'Please provide a detailed description';
                } else if (formData.goodsDescription.trim().length < 10) {
                    newErrors.goodsDescription = 'Description must be at least 10 characters';
                }
                if (!formData.quantity || formData.quantity === '' || formData.quantity === null) {
                    newErrors.quantity = 'Quantity is required';
                } else {
                    const quantityNum = typeof formData.quantity === 'string' ? parseFloat(formData.quantity) : formData.quantity;
                    if (isNaN(quantityNum) || quantityNum <= 0 || !Number.isInteger(quantityNum)) {
                        newErrors.quantity = 'Quantity must be a valid positive whole number';
                    }
                }
                if (!formData.quantityUnit || formData.quantityUnit.trim() === '') {
                    newErrors.quantityUnit = 'Please select a quantity unit';
                }
                // Only require condition for non-food, non-emergency, non-medicine types
                const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine'];
                if (!noConditionTypes.includes(formData.goodsType)) {
                    if (!formData.condition) {
                        newErrors.condition = 'Please select the condition';
                    }
                }
                break;
            
            case 2:
                if (!formData.preferredDate) {
                    newErrors.preferredDate = 'Please select a preferred date';
                }
                if (!formData.preferredTime) {
                    newErrors.preferredTime = 'Please select a preferred time';
                }
                break;
        }

        set({ errors: newErrors });
        return Object.keys(newErrors).length === 0;
    },

    // Submit goods donation
    submitGoodsDonation: async (eventId) => {
        try {
            set({ isProcessing: true, error: null });
            
            const { formData } = get();
            
            // Prepare submission data - remove condition field for items that don't need condition
            const submissionData = { ...formData };
            const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine'];
            if (noConditionTypes.includes(submissionData.goodsType) && (!submissionData.condition || submissionData.condition === '')) {
                delete submissionData.condition;
            }
            
            toast.loading('Submitting your goods donation...', { id: 'goods-donation-processing' });
            
            const response = await submitGoodsDonation(eventId, submissionData);
            
            if (response.success) {
                toast.dismiss('goods-donation-processing');
                toast.success(response.message || 'Goods donation submitted successfully!');
                
                set({
                    isProcessing: false,
                    isSubmitted: true,
                    submissionData: response.data,
                    error: null
                });
                
                return true;
            } else {
                throw new Error(response.message || 'Failed to submit goods donation');
            }
            
        } catch (error) {
            toast.dismiss('goods-donation-processing');
            
            let errorMessage = 'There was an error submitting your donation. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            
            set({
                isProcessing: false,
                error: errorMessage
            });
            
            return false;
        }
    },

    // Reset form
    resetForm: () => {
        set({
            formData: {
                goodsType: '',
                goodsDescription: '',
                quantity: '',
                quantityUnit: '',
                condition: '',
                dropoffLocation: 'uclm_location',
                preferredDate: '',
                preferredTime: '',
                isAnonymous: false,
                showReceipt: true
            },
            currentStep: 1,
            errors: {},
            isProcessing: false,
            isSubmitted: false,
            submissionData: null,
            error: null
        });
    },

    // Clear all state
    clearStore: () => {
        set({
            formData: {
                goodsType: '',
                goodsDescription: '',
                quantity: '',
                quantityUnit: '',
                condition: '',
                dropoffLocation: 'uclm_location',
                preferredDate: '',
                preferredTime: '',
                isAnonymous: false,
                showReceipt: true
            },
            currentStep: 1,
            errors: {},
            isProcessing: false,
            isSubmitted: false,
            submissionData: null,
            error: null,
            enabledGoodsTypes: []
        });
    },

    // Fetch enabled goods types for an event
    fetchEventGoodsTypes: async (eventId) => {
        try {
            const response = await getEventGoodsTypes(eventId);
            if (response.success && response.data) {
                set({ enabledGoodsTypes: response.data });
                return response.data;
            } else {
                set({ enabledGoodsTypes: [] });
                return [];
            }
        } catch (error) {
            console.log('fetchEventGoodsTypes store failed:', error.message);
            set({ enabledGoodsTypes: [] });
            return [];
        }
    }
}));

export default useGoodsDonationStore;
