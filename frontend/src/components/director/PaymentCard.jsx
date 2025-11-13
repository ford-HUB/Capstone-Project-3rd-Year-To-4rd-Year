import React from 'react'
import { MoreVertical, Edit, Trash2, Power, PowerOff } from 'lucide-react'
import dayjs from 'dayjs'
import { 
    getPaymentDisplayName, 
    getPaymentIcon, 
    getPaymentStatusColor, 
    getPaymentStatusLabel,
    getPaymentId,
    getPaymentUniqueId,
    isPaymentActive,
    isPaymentInactive
} from '../../utils/paymentUtils.js'

const PaymentCard = ({ 
    payment, 
    index, 
    activeDropdown, 
    onToggleDropdown, 
    onStatusUpdate, 
    onUpdateClick, 
    onRemoveClick 
}) => {
    const paymentType = payment.payment_method_types?.[0]
    const uniqueId = getPaymentUniqueId(payment, index)

    return (
        <div key={uniqueId} className='flex items-center p-4 bg-green-50 border border-green-200 rounded-lg relative'>
            <div className='w-12 h-12 rounded-md bg-white flex items-center justify-center shadow-sm mr-3'>
                <img 
                    className='w-8 h-8 object-contain' 
                    src={getPaymentIcon(paymentType)} 
                    alt={getPaymentDisplayName(paymentType)} 
                />
            </div>
            <div className='flex-1'>
                <span className='text-sm font-medium text-green-800'>
                    {getPaymentDisplayName(paymentType)}
                </span>
                <p className='text-xs text-green-600'>
                    {getPaymentStatusLabel(payment.status)}
                </p>
                {payment.updatedAt && (
                    <p className='text-xs text-gray-500 mt-1'>
                        Updated: {dayjs(payment.updatedAt).format('MMM DD, YYYY [at] h:mm A')}
                    </p>
                )}
            </div>
            <div className='flex items-center space-x-2'>
                <div className={`w-3 h-3 rounded-full ${getPaymentStatusColor(payment.status)}`}></div>
                
                <div className='relative dropdown-container'>
                    <button
                        onClick={() => onToggleDropdown(uniqueId)}
                        className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                    >
                        <MoreVertical className='w-4 h-4 text-gray-600' />
                    </button>
                    
                    {activeDropdown === uniqueId && (
                        <div className='absolute right-0 bottom-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]'>
                            <div className='py-1'>
                                {!isPaymentActive(payment) && (
                                    <button
                                        onClick={() => onStatusUpdate(getPaymentId(payment), 'ACTIVE')}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        <Power className='w-4 h-4 mr-2 text-green-600' />
                                        Set Active
                                    </button>
                                )}
                                {!isPaymentInactive(payment) && (
                                    <button
                                        onClick={() => onStatusUpdate(getPaymentId(payment), 'INACTIVE')}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                    >
                                        <PowerOff className='w-4 h-4 mr-2 text-gray-600' />
                                        Set Inactive
                                    </button>
                                )}
                                
                                <div className='border-t border-gray-200 my-1'></div>
                                
                                <button
                                    onClick={() => onUpdateClick(payment)}
                                    className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                >
                                    <Edit className='w-4 h-4 mr-2 text-blue-600' />
                                    Update
                                </button>
                                <button
                                    onClick={() => onRemoveClick(payment)}
                                    className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                                >
                                    <Trash2 className='w-4 h-4 mr-2' />
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentCard