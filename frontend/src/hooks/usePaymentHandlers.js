import { useState } from 'react'
import { usePaymentStore } from '../../store/director/usePaymentStore.js'
import { getPaymentId, getPaymentMethodType } from '../utils/paymentUtils.js'

export const usePaymentHandlers = () => {
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false)
    const [showRemovePaymentModal, setShowRemovePaymentModal] = useState(false)
    const [selectedPaymentForUpdate, setSelectedPaymentForUpdate] = useState(null)
    const [selectedPaymentForRemove, setSelectedPaymentForRemove] = useState(null)

    const { updatePaymentStatus, removePaymentMethod, updatePaymentMethod } = usePaymentStore()

    const handlePaymentStatusUpdate = async (paymentId, status) => {
        if (!paymentId || paymentId === 'undefined') return
        const success = await updatePaymentStatus(paymentId, status)
        if (success) {
            setActiveDropdown(null)
        }
    }

    const handleUpdatePaymentClick = (payment) => {
        setSelectedPaymentForUpdate(payment)
        setShowUpdatePaymentModal(true)
        setActiveDropdown(null)
    }

    const handleUpdatePaymentConfirm = async () => {
        setShowUpdatePaymentModal(false)
        
        const paymentMethodType = getPaymentMethodType(selectedPaymentForUpdate)
        const finalPaymentId = getPaymentId(selectedPaymentForUpdate)
        
        if (paymentMethodType) {
            const result = await updatePaymentMethod([paymentMethodType], finalPaymentId || null)
            if (result && result.success) {
                setSelectedPaymentForUpdate(null)
            }
        }
        setSelectedPaymentForUpdate(null)
    }

    const handleUpdatePaymentCancel = () => {
        setShowUpdatePaymentModal(false)
        setSelectedPaymentForUpdate(null)
    }

    const handleRemovePaymentClick = (payment) => {
        setSelectedPaymentForRemove(payment)
        setShowRemovePaymentModal(true)
        setActiveDropdown(null)
    }

    const handleRemovePaymentConfirm = async () => {
        if (selectedPaymentForRemove) {
            const paymentId = getPaymentId(selectedPaymentForRemove)
            const success = await removePaymentMethod(paymentId)
            if (success) {
                setShowRemovePaymentModal(false)
                setSelectedPaymentForRemove(null)
            }
        }
    }

    const handleRemovePaymentCancel = () => {
        setShowRemovePaymentModal(false)
        setSelectedPaymentForRemove(null)
    }

    const toggleDropdown = (paymentId) => {
        if (activeDropdown === paymentId) {
            setActiveDropdown(null)
        } else {
            setActiveDropdown(paymentId)
        }
    }

    return {
        // State
        activeDropdown,
        showUpdatePaymentModal,
        showRemovePaymentModal,
        selectedPaymentForUpdate,
        selectedPaymentForRemove,
        
        // Handlers
        handlePaymentStatusUpdate,
        handleUpdatePaymentClick,
        handleUpdatePaymentConfirm,
        handleUpdatePaymentCancel,
        handleRemovePaymentClick,
        handleRemovePaymentConfirm,
        handleRemovePaymentCancel,
        toggleDropdown
    }
}
