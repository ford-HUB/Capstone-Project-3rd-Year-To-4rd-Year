import React from 'react'
import { Trash2 } from 'lucide-react'

const RemovePaymentModal = ({ 
    isOpen, 
    payment, 
    onConfirm, 
    onCancel 
}) => {
    if (!isOpen) return null

    const getPaymentDisplayName = (type) => {
        const names = {
            gcash: 'GCash',
            card: 'Credit Card',
            paymaya: 'PayMaya',
            bpi: 'BPI',
            ubp: 'UnionBank'
        }
        return names[type] || 'Payment Method'
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Remove Payment Method</h3>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-600 mb-3">
                        Are you sure you want to remove this payment method?
                    </p>
                    {payment && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm font-medium text-gray-900">
                                {getPaymentDisplayName(payment.payment_method_types?.[0])}
                            </p>
                            <p className="text-xs text-gray-500">
                                Status: {payment.status || 'Unknown'}
                            </p>
                        </div>
                    )}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This action cannot be undone. You will need to re-add this payment method if you want to use it again.
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Remove Payment Method
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RemovePaymentModal
