import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { asset } from '../../assets/asset'
import { useAuthStore } from '../../store/participant/useAuthStore.js'
import { useBeneficiaryAuthStore } from '../../store/beneficiary/useBeneficiaryAuthStore.js'
import { useAuthStore as useDirectorAuthStore } from '../../store/director/useAuthStore.js'
import { useDonorAuthStore } from '../../store/donor/useDonorAuthStore.js'
import { resetPasswordSchema } from '../../forms/ForgotPasswordSchemas.js'

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isValidToken, setIsValidToken] = useState(false)
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')

    // Get store functions
    const { resetPassword } = useAuthStore()
    const { resetPassword: beneficiaryResetPassword } = useBeneficiaryAuthStore()
    const { resetPassword: directorResetPassword } = useDirectorAuthStore()
    const { resetPassword: donorResetPassword } = useDonorAuthStore()

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        watch 
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    })

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        const emailParam = searchParams.get('email')
        
        if (tokenParam && emailParam) {
            setToken(tokenParam)
            setEmail(decodeURIComponent(emailParam))
            setIsValidToken(true)
        } else {
            toast.error('Invalid reset link')
            navigate('/login')
        }
    }, [searchParams, navigate])

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const resetData = {
                token: token,
                email: email,
                newPassword: data.newPassword
            }

            // Try participant reset first
            let result = await resetPassword(resetData)
            
            // If participant fails, try beneficiary
            if (!result.success) {
                result = await beneficiaryResetPassword(resetData)
            }
            
            // If beneficiary also fails, try director
            if (!result.success) {
                result = await directorResetPassword(resetData)
            }
            
            // If director also fails, try donor
            if (!result.success) {
                result = await donorResetPassword(resetData)
            }

            if (result.success) {
                toast.success(result.message)
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } else {
                toast.error(result.message || 'Failed to reset password')
            }
        } catch (error) {
            console.error('Reset password error:', error)
            toast.error('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Validating reset link...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <img src={asset.logo} alt="UCLM CARES" className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password for {email}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                {...register('newPassword')}
                                type="password"
                                id="newPassword"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter new password"
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                id="confirmPassword"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Password requirements:</strong>
                            <br />• At least 8 characters
                            <br />• One uppercase letter
                            <br />• One lowercase letter
                            <br />• One number
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage
