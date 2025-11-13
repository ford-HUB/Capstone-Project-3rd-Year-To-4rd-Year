import React from 'react'
import { Plus } from 'lucide-react'
import PaymentCard from './PaymentCard'
import UpdatePaymentModal from './modals/UpdatePaymentModal'
import RemovePaymentModal from './modals/RemovePaymentModal'
import { areAllPaymentMethodsAdded } from '../../utils/paymentUtils.js'

const PaymentSection = ({
    paymentMethods,
    availableMethods,
    activeDropdown,
    showUpdatePaymentModal,
    showRemovePaymentModal,
    selectedPaymentForUpdate,
    selectedPaymentForRemove,
    onToggleDropdown,
    onStatusUpdate,
    onUpdateClick,
    onUpdateConfirm,
    onUpdateCancel,
    onRemoveClick,
    onRemoveConfirm,
    onRemoveCancel,
    onAddPayment
}) => {
    const allMethodsAdded = areAllPaymentMethodsAdded(paymentMethods, availableMethods)

    return (
        <div className='flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold text-gray-800'>Payment Methods</h2>
                {allMethodsAdded ? (
                    <div className='text-sm text-gray-500'>
                        All payment methods have been added
                    </div>
                ) : (
                    <button
                        onClick={onAddPayment}
                        className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        <Plus className='w-4 h-4 mr-2' />
                        Add More
                    </button>
                )}
            </div>

            <div className='space-y-3'>
                {paymentMethods && paymentMethods.length > 0 ? (
                    paymentMethods.map((payment, index) => (
                        <PaymentCard
                            key={payment.linked_payment_account_id || `payment-${index}`}
                            payment={payment}
                            index={index}
                            activeDropdown={activeDropdown}
                            onToggleDropdown={onToggleDropdown}
                            onStatusUpdate={onStatusUpdate}
                            onUpdateClick={onUpdateClick}
                            onRemoveClick={onRemoveClick}
                        />
                    ))
                ) : (
                    <div className='text-center py-8 text-gray-500'>
                        No payment methods configured yet.
                    </div>
                )}
            </div>

            <UpdatePaymentModal
                isOpen={showUpdatePaymentModal}
                payment={selectedPaymentForUpdate}
                onConfirm={onUpdateConfirm}
                onCancel={onUpdateCancel}
            />

            <RemovePaymentModal
                isOpen={showRemovePaymentModal}
                payment={selectedPaymentForRemove}
                onConfirm={onRemoveConfirm}
                onCancel={onRemoveCancel}
            />
        </div>
    )
}

export default PaymentSection