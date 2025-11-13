import { PAYMENT_DISPLAY_NAMES, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS, getPaymentIcon as getPaymentIconFromConstants } from '../constants/paymentConstants.js'
import { asset } from '../assets/asset.jsx'

/**
 * Get display name for payment method type
 * @param {string} type - Payment method type
 * @returns {string} Display name
 */
export const getPaymentDisplayName = (type) => {
    return PAYMENT_DISPLAY_NAMES[type] || 'Payment Method'
}

/**
 * Get icon URL for payment method type
 * @param {string} type - Payment method type
 * @returns {string} Icon URL
 */
export const getPaymentIcon = (type) => {
    return getPaymentIconFromConstants(type, asset)
}

/**
 * Get status color class for payment status
 * @param {string} status - Payment status
 * @returns {string} CSS class
 */
export const getPaymentStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || PAYMENT_STATUS_COLORS.PENDING
}

/**
 * Get status label for payment status
 * @param {string} status - Payment status
 * @returns {string} Status label
 */
export const getPaymentStatusLabel = (status) => {
    return PAYMENT_STATUS_LABELS[status] || 'Unknown'
}

/**
 * Get payment ID with fallback logic
 * @param {Object} payment - Payment object
 * @returns {string|number|null} Payment ID
 */
export const getPaymentId = (payment) => {
    return payment?.linked_payment_account_id || 
           payment?.id || 
           payment?.payment_id || 
           payment?.paymentId || 
           null
}

/**
 * Get payment method type from payment object
 * @param {Object} payment - Payment object
 * @returns {string|null} Payment method type
 */
export const getPaymentMethodType = (payment) => {
    return payment?.payment_method_types?.[0] || null
}

/**
 * Generate unique ID for payment component
 * @param {Object} payment - Payment object
 * @param {number} index - Array index
 * @returns {string} Unique ID
 */
export const getPaymentUniqueId = (payment, index) => {
    const paymentType = getPaymentMethodType(payment)
    return payment.linked_payment_account_id ? 
           `payment-${payment.linked_payment_account_id}` : 
           `payment-${index}-${paymentType}`
}

/**
 * Check if payment method is active
 * @param {Object} payment - Payment object
 * @returns {boolean} Is active
 */
export const isPaymentActive = (payment) => {
    return payment?.status === 'ACTIVE'
}

/**
 * Check if payment method is inactive
 * @param {Object} payment - Payment object
 * @returns {boolean} Is inactive
 */
export const isPaymentInactive = (payment) => {
    return payment?.status === 'INACTIVE'
}

/**
 * Check if all payment methods are added
 * @param {Array} paymentMethods - Payment methods array
 * @param {Array} availableMethods - Available methods array
 * @returns {boolean} All methods added
 */
export const areAllPaymentMethodsAdded = (paymentMethods, availableMethods) => {
    return (availableMethods && availableMethods.length === 0) || 
           (paymentMethods && paymentMethods.length >= 3)
}
