import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { asset } from '../../assets/asset'
import { useAuthStore } from '../../store/participant/useAuthStore.js'
import { useBeneficiaryAuthStore } from '../../store/beneficiary/useBeneficiaryAuthStore.js'
import { forgotPasswordSchema } from '../../forms/ForgotPasswordSchemas.js'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [emailStatus, setEmailStatus] = useState(null) // null, 'checking', 'found', 'not-found', 'restricted'
    const [emailCheckLoading, setEmailCheckLoading] = useState(false)

    // Get store functions
    const { checkEmailForPasswordReset, forgotPassword } = useAuthStore()
    const { checkEmailForPasswordReset: beneficiaryCheckEmail, forgotPassword: beneficiaryForgotPassword } = useBeneficiaryAuthStore()

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
        watch
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const emailValue = watch('email')

    // Check email status in real-time
    useEffect(() => {
        const checkEmailStatus = async () => {
            if (!emailValue || !emailValue.includes('@') || emailValue.length < 5) {
                setEmailStatus(null)
                return
            }

            setEmailCheckLoading(true)
            setEmailStatus('checking')

            try {
                // Try participant check first
                let result = await checkEmailForPasswordReset(emailValue)
                
                // If not found in participant, try beneficiary
                if (!result.success || !result.exists) {
                    result = await beneficiaryCheckEmail(emailValue)
                }

                if (result.success && result.exists) {
                    // Check if account is deactivated or restricted
                    if (result.account?.is_deactivated) {
                        setEmailStatus('restricted')
                    } else {
                        setEmailStatus('found')
                    }
                } else {
                    setEmailStatus('not-found')
                }
            } catch (error) {
                console.error('Email check error:', error)
                setEmailStatus('not-found')
            } finally {
                setEmailCheckLoading(false)
            }
        }

        const timeoutId = setTimeout(checkEmailStatus, 500) // Debounce for 500ms
        return () => clearTimeout(timeoutId)
    }, [emailValue])

    const onSubmit = async (data) => {
        // Prevent submission if email is not found or restricted
        if (emailStatus === 'not-found' || emailStatus === 'restricted') {
            toast.error('Please enter a valid email address')
            return
        }

        if (emailStatus !== 'found') {
            toast.error('Please wait for email validation to complete')
            return
        }

        setIsLoading(true)
        try {
            // Try participant forgot password first
            let result = await forgotPassword(data.email)
            
            // If participant fails, try beneficiary
            if (!result.success) {
                result = await beneficiaryForgotPassword(data.email)
            }

            if (result.success) {
                setUserEmail(data.email)
                setEmailSent(true)
                toast.success(result.message)
            } else {
                toast.error(result.message || 'Failed to send reset email')
            }
        } catch (error) {
            console.error('Forgot password error:', error)
            toast.error('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        reset()
        setEmailSent(false)
        setUserEmail('')
        setEmailStatus(null)
        setEmailCheckLoading(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <img src={asset.logo} alt="UCLM CARES" className="h-8 w-8 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            {emailSent ? 'Check Your Email' : 'Forgot Password'}
                        </h2>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {!emailSent ? (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                             <div>
                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                     Email Address
                                 </label>
                                 <div className="relative">
                                     <input
                                         {...register('email')}
                                         type="email"
                                         id="email"
                                         className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                             errors.email 
                                                 ? 'border-red-500' 
                                                 : emailStatus === 'found'
                                                 ? 'border-green-500 bg-green-50'
                                                 : emailStatus === 'not-found' || emailStatus === 'restricted'
                                                 ? 'border-red-500 bg-red-50'
                                                 : 'border-gray-300'
                                         }`}
                                         placeholder="Enter your email address"
                                     />
                                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                         {emailCheckLoading && (
                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                         )}
                                         {!emailCheckLoading && emailStatus === 'found' && (
                                             <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                             </svg>
                                         )}
                                         {!emailCheckLoading && (emailStatus === 'not-found' || emailStatus === 'restricted') && (
                                             <button
                                                 type="button"
                                                 onClick={() => {
                                                     reset({ email: '' })
                                                     setEmailStatus(null)
                                                 }}
                                                 className="text-red-400 hover:text-red-600 transition-colors"
                                             >
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                 </svg>
                                             </button>
                                         )}
                                         {!emailCheckLoading && emailValue && emailStatus !== 'found' && emailStatus !== 'not-found' && emailStatus !== 'restricted' && (
                                             <button
                                                 type="button"
                                                 onClick={() => {
                                                     reset({ email: '' })
                                                     setEmailStatus(null)
                                                 }}
                                                 className="text-gray-400 hover:text-gray-600 transition-colors"
                                             >
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                 </svg>
                                             </button>
                                         )}
                                     </div>
                                 </div>
                                 
                                 {/* Status Messages */}
                                 {emailStatus === 'found' && (
                                     <p className="text-green-600 text-sm mt-1 flex items-center">
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                         </svg>
                                         Email found! You can request a password reset.
                                     </p>
                                 )}
                                 {emailStatus === 'not-found' && (
                                     <p className="text-red-600 text-sm mt-1 flex items-center">
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                         </svg>
                                         Email not found in our system.
                                     </p>
                                 )}
                                 {emailStatus === 'restricted' && (
                                     <p className="text-red-600 text-sm mt-1 flex items-center">
                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                         </svg>
                                         This account is deactivated. Please contact support.
                                     </p>
                                 )}
                                 
                                 {errors.email && (
                                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                 )}
                             </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                 <button
                                     type="submit"
                                     disabled={isLoading || emailStatus !== 'found' || emailCheckLoading}
                                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     {isLoading ? 'Sending...' : emailCheckLoading ? 'Checking...' : 'Send Reset Link'}
                                 </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Sent!</h3>
                            <p className="text-gray-600 mb-4">
                                We've sent password reset instructions to <strong>{userEmail}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Please check your email and follow the instructions to reset your password. 
                                The link will expire in 1 hour.
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordModal
