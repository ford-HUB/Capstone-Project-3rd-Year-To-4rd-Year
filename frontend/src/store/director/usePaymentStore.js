import { create } from "zustand";
import { createPaymentLink, getPaymentMethods, updatePaymentStatus, removePaymentMethod, updatePaymentMethod } from "../../services/director/paymentService.js";
import toast from "react-hot-toast";

export const usePaymentStore = create((set, get) => ({
    paymentMethods: [],
    availableMethods: [],
    isLoading: false,
    selectedPaymentMethod: null,

    // Create payment link for verification
    createPaymentLink: async (paymentMethod, methodId) => {
        set({ isLoading: true, selectedPaymentMethod: methodId });
        try {
            const response = await createPaymentLink(paymentMethod);
            if (!response.success) {
                // Handle duplicate payment method error
                if (response.duplicateMethods && response.duplicateMethods.length > 0) {
                    toast.error(response.message);
                    return { 
                        success: false, 
                        checkout_url: null, 
                        isDuplicate: true,
                        duplicateMethods: response.duplicateMethods,
                        duplicateMethodNames: response.duplicateMethodNames
                    };
                }
                toast.error(response.message);
                return { success: false, checkout_url: null };
            }
            
            toast.success(response.message);
            return { 
                success: true, 
                checkout_url: response.checkout_url,
                existing: response.existing
            };
        } catch (error) {
            console.log('create payment link failed:', error.message);
            toast.error('Failed to create payment link. Please try again.');
            return { success: false, checkout_url: null };
        } finally {
            set({ isLoading: false, selectedPaymentMethod: null });
        }
    },

    // Get all payment methods for current director
    getPaymentMethods: async () => {
        set({ isLoading: true });
        try {
            const response = await getPaymentMethods();
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            
            set({ 
                paymentMethods: response.paymentsData,
                availableMethods: response.availableMethods || []
            });
            return true;
        } catch (error) {
            console.log('get payment methods failed:', error.message);
            toast.error('Failed to load payment methods.');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    // Update payment status
    updatePaymentStatus: async (paymentId, status) => {
        set({ isLoading: true });
        try {
            const response = await updatePaymentStatus(paymentId, status);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            
            toast.success(response.message);
            
            // Refresh payment methods to get updated data
            await get().getPaymentMethods();
            return true;
        } catch (error) {
            console.log('update payment status failed:', error.message);
            toast.error('Failed to update payment status. Please try again.');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    // Remove payment method
    removePaymentMethod: async (paymentId) => {
        set({ isLoading: true });
        try {
            const response = await removePaymentMethod(paymentId);
            if (!response.success) {
                toast.error(response.message);
                return false;
            }
            
            toast.success(response.message);
            
            // Refresh payment methods to get updated data
            await get().getPaymentMethods();
            return true;
        } catch (error) {
            console.log('remove payment method failed:', error.message);
            toast.error('Failed to remove payment method. Please try again.');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    // Update payment method (separate from create)
    updatePaymentMethod: async (paymentMethod, paymentId) => {
        set({ isLoading: true, selectedPaymentMethod: paymentId });
        try {
            const response = await updatePaymentMethod(paymentMethod, paymentId);
            if (!response.success) {
                // Handle duplicate payment method error
                if (response.duplicateMethods && response.duplicateMethods.length > 0) {
                    toast.error(response.message);
                    return { 
                        success: false, 
                        checkout_url: null, 
                        isDuplicate: true,
                        duplicateMethods: response.duplicateMethods,
                        duplicateMethodNames: response.duplicateMethodNames
                    };
                }
                toast.error(response.message);
                return { success: false, checkout_url: null };
            }
            
            toast.success(response.message);
            return { 
                success: true, 
                checkout_url: response.checkout_url,
                existing: response.existing
            };
        } catch (error) {
            console.log('update payment method failed:', error.message);
            toast.error('Failed to update payment method. Please try again.');
            return { success: false, checkout_url: null };
        } finally {
            set({ isLoading: false, selectedPaymentMethod: null });
        }
    },

    // Clear payment methods (for logout)
    clearPaymentMethods: () => {
        set({ paymentMethods: [], availableMethods: [], selectedPaymentMethod: null });
    }
}));
