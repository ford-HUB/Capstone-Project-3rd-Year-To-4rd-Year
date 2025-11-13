import { apiInstance } from "../../api/_base.js"
import { mapPaymentMethods } from "../../constants/paymentMethods.js"

export const enableOrDisableFunds = async (id, funds) => {
    const response = await apiInstance.put(`/api/donation/enable-funds-event-donation/${id}`, funds)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const enableOrDisableGoods = async (id, goods) => {
    const response = await apiInstance.put(`/api/donation/enable-goods-event-donation/${id}`, goods)
    return {
        success: response.data.success,
        message: response.data.message
    }
}

export const getEventGoodsTypes = async (eventId) => {
    try {
        const response = await apiInstance.get(`/api/donation/event-goods-types/${eventId}`)
        return {
            success: response.data.success,
            data: response.data.data || [],
            message: response.data.message
        }
    } catch (error) {
        console.error('getEventGoodsTypes service failed:', error);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || 'Failed to fetch event goods types'
        }
    }
}

export const getEventsOpenForDonations = async () => {
    try {
        const response = await apiInstance.get('/api/donation/events-open-for-donations')
        return {
            success: response.data.success,
            data: response.data.data,
            count: response.data.count,
            message: response.data.message
        }
    } catch (error) {
        console.error('getEventsOpenForDonations service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch events open for donations'
        };
    }
}

export const testEvents = async () => {
    const response = await apiInstance.get('/api/donation/test-events')
    return {
        success: response.data.success,
        events: response.data.events,
        message: response.data.message
    }
}

export const createTestEvents = async () => {
    const response = await apiInstance.post('/api/donation/create-test-events')
    return {
        success: response.data.success,
        events: response.data.events,
        message: response.data.message
    }
}

export const processDonationPayment = async (donationData) => {
    const { amount, description, linkedPaymentAccountId, event_id, isAnonymous, mailReceipt } = donationData
    const response = await apiInstance.post(`/api/v1/payment/donate-now/${linkedPaymentAccountId}/${event_id}`, {
        amount,
        description,
        isAnonymous,
        mailReceipt
    })
    return {
        success: response.data.success,
        check_out_url: response.data.check_out_url,
        message: response.data.message
    }
}

export const handlePaymentSuccess = async (paymentData) => {
    const { checkout_session_id } = paymentData
    const response = await apiInstance.post('/api/v1/payment/payment-success', {
        checkout_session_id
    })
    return {
        success: response.data.success,
        message: response.data.message,
        payment_id: response.data.payment_id
    }
}

export const getAvailablePaymentMethods = async () => {
    const response = await apiInstance.get('/api/v1/payment/payment-methods')
    
    // Map raw payment method types to user-friendly objects using constants
    const mappedPaymentMethods = response.data.paymentMethods ? 
        mapPaymentMethods(response.data.paymentMethods) : []
    
    return {
        success: response.data.success,
        paymentMethods: mappedPaymentMethods,
        paymentAccounts: response.data.paymentAccounts,
        count: mappedPaymentMethods.length,
        message: response.data.message
    }
}

export const verifyPaymentCancellation = async (donationId) => {
    const response = await apiInstance.get(`/api/v1/payment/verify-cancellation/${donationId}`)
    return {
        success: response.data.success,
        isCancelled: response.data.isCancelled,
        paymentStatus: response.data.paymentStatus,
        message: response.data.message
    }
}

export const getEventDonationStats = async (eventId) => {
    try {
        const response = await apiInstance.get(`/api/donation/event-stats/${eventId}`)
        return {
            success: response.data.success,
            data: response.data.data,
            message: response.data.message
        }
    } catch (error) {
        console.error('getEventDonationStats service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch event donation statistics'
        };
    }
}

// Real-time donation update handler
export const setupDonationUpdates = (socket, onDonationUpdate) => {
    if (!socket) {
        console.warn('Socket not provided for donation updates');
        return;
    }

    // Listen for donation updates
    socket.on('donation_updated', (data) => {
        console.log('Received donation update:', data);
        if (onDonationUpdate) {
            onDonationUpdate(data);
        }
    });

    // Return cleanup function
    return () => {
        socket.off('donation_updated');
    };
}

// Submit goods donation
export const submitGoodsDonation = async (eventId, donationData) => {
    try {
        const response = await apiInstance.post(`/api/donation/submit-goods/${eventId}`, donationData);
        return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data
        };
    } catch (error) {
        console.error('submitGoodsDonation service failed:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to submit goods donation'
        };
    }
}