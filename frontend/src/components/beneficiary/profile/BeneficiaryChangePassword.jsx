import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { beneficiaryPasswordChangeSchema } from '../../../forms/BeneficiarySchemas.js';
import { changeBeneficiaryPassword } from '../../../services/beneficiary/authService.js';

const BeneficiaryChangePassword = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch
    } = useForm({
        resolver: zodResolver(beneficiaryPasswordChangeSchema),
        mode: 'onBlur',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const newPassword = watch('newPassword');

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
        
        return {
            strength,
            label: strengthLabels[strength - 1] || '',
            color: strengthColors[strength - 1] || 'text-gray-400'
        };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const onSubmit = async (data) => {
        console.log('Form data being submitted:', data);
        console.log('Form errors:', errors);
        setIsSubmitting(true);
        setSubmitSuccess(false);

        try {
            const result = await changeBeneficiaryPassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });

            if (result.success) {
                setSubmitSuccess(true);
                toast.success('Password changed successfully!');
                reset();
                // Reset success state after 3 seconds
                setTimeout(() => setSubmitSuccess(false), 3000);
            } else {
                toast.error(result.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while changing your password';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-screen">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
                <p className="text-gray-600 text-sm">
                    Update your password to keep your account secure. Make sure to use a strong password.
                </p>
            </div>

            {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-green-800">Password Changed Successfully</h3>
                            <p className="text-sm text-green-700 mt-1">
                                Your password has been updated. Please use your new password for future logins.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit, (err) => console.log('found an error: ', err))} className="space-y-6">
                {/* Current Password */}
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('currentPassword')}
                            type={showCurrentPassword ? 'text' : 'password'}
                            id="currentPassword"
                            className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter your current password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.currentPassword.message}
                        </p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                errors.newPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter your new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                        <div className="mt-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            passwordStrength.strength <= 2 ? 'bg-red-500' :
                                            passwordStrength.strength === 3 ? 'bg-yellow-500' :
                                            passwordStrength.strength === 4 ? 'bg-blue-500' : 'bg-green-500'
                                        }`}
                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        </div>
                    )}

                    {errors.newPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>

                {/* Confirm New Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Confirm your new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Password Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${newPassword?.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                            At least 8 characters long
                        </li>
                        <li className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Contains at least one lowercase letter
                        </li>
                        <li className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Contains at least one uppercase letter
                        </li>
                        <li className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            Contains at least one number
                        </li>
                    </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={isSubmitting || !isDirty}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Changing Password...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BeneficiaryChangePassword;