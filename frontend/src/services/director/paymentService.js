import { apiInstance } from "../../api/_base.js";

export const createPaymentLink = async (paymentMethods) => {
    const response = await apiInstance.post('/api/v1/payment/director/create-payment-link', {
        paymentMethods
    });
    return {
        success: response.data.success,
        checkout_url: response.data.checkout_url,
        message: response.data.message,
        payment_methods: response.data.payment_methods,
        existing: response.data.existing,
        duplicateMethods: response.data.duplicateMethods,
        duplicateMethodNames: response.data.duplicateMethodNames
    };
};

export const getPaymentMethods = async () => {
    const response = await apiInstance.get('/api/v1/payment/director/get-all-payment-links');
    return {
        success: response.data.success,
        paymentsData: response.data.paymentsData,
        count: response.data.count,
        message: response.data.message,
        availableMethods: response.data.availableMethods,
        existingMethodTypes: response.data.existingMethodTypes
    };
};

export const updatePaymentStatus = async (paymentId, status) => {
    const response = await apiInstance.put(`/api/v1/payment/director/update-status/${paymentId}`, {
        status
    });
    return {
        success: response.data.success,
        message: response.data.message,
        payment: response.data.payment
    };
};

export const removePaymentMethod = async (paymentId) => {
    const response = await apiInstance.delete(`/api/v1/payment/director/remove/${paymentId}`);
    return {
        success: response.data.success,
        message: response.data.message,
        removedPayment: response.data.removedPayment
    };
};

export const updatePaymentMethod = async (paymentMethods, paymentId = null) => {
    const response = await apiInstance.post('/api/v1/payment/director/update-payment-method', {
        paymentMethods,
        paymentId
    });
    return {
        success: response.data.success,
        checkout_url: response.data.checkout_url,
        message: response.data.message,
        payment_methods: response.data.payment_methods,
        existing: response.data.existing,
        duplicateMethods: response.data.duplicateMethods,
        duplicateMethodNames: response.data.duplicateMethodNames
    };
};