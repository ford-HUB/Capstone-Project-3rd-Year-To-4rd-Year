import React from 'react'
import { Edit } from 'lucide-react'

const UpdatePaymentModal = ({ 
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
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Edit className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Update Payment Method</h3>
                </div>
                
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Are you sure you want to update this payment method?
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                                <span className="text-yellow-600 text-xs font-bold">₱</span>
                            </div>
                            <p className="text-sm text-yellow-800">
                                <span className="font-medium">Note:</span> Updating your payment method will incur a <span className="font-semibold">₱1.00 verification charge</span> to verify the new payment details.
                            </p>
                        </div>
                    </div>
                    
                    {payment && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Payment Method:</span> {getPaymentDisplayName(payment.payment_method_types?.[0])}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Current Status:</span> {payment.status || 'Pending'}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                You will be redirected to PayMongo to complete the verification process.
                            </p>
                        </div>
                    )}
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
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Continue to Update
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UpdatePaymentModal
