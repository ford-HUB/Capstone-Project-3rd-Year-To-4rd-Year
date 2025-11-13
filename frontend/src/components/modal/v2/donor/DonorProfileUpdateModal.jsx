import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDonorProfileStore, useIsOAuthAccount } from '../../../../store/donor/useDonorProfileStore';
import { useDonorAuthStore } from '../../../../store/donor/useDonorAuthStore';
import { donorProfileUpdateSchema, donorPasswordUpdateSchema } from '../../../../forms/DonorProfileUpdateSchema.js';

const DonorProfileUpdateModal = ({ isOpen, setOpen, userData, initialTab = 'profile' }) => {
    const { profile, fetchProfile, updateProfile, changePassword, loading } = useDonorProfileStore();
    const isOAuthAccount = useIsOAuthAccount();
    const { authenticatedUser } = useDonorAuthStore();
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Profile form
    const profileForm = useForm({
        resolver: zodResolver(donorProfileUpdateSchema),
        defaultValues: {
            fullname: ''
        }
    });

    // Password form
    const passwordForm = useForm({
        resolver: zodResolver(donorPasswordUpdateSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Get form states
    const { isDirty: isProfileDirty, isValid: isProfileValid } = profileForm.formState;
    const { isDirty: isPasswordDirty, isValid: isPasswordValid, formState: passwordFormState } = passwordForm.formState;
    
    // Check if password form has any values
    const passwordValues = passwordForm.getValues();
    const hasPasswordInput = passwordValues.currentPassword || passwordValues.newPassword || passwordValues.confirmPassword;

    // Fetch profile when modal opens
    useEffect(() => {
        if (isOpen && !profile) {
            fetchProfile();
        }
    }, [isOpen, profile, fetchProfile]);

    // Reset tab when modal opens
    useEffect(() => {
        if (isOpen) {
            // If OAuth account and trying to open password tab, default to profile tab
            const tabToSet = (isOAuthAccount && initialTab === 'password') ? 'profile' : initialTab;
            setActiveTab(tabToSet);
            // Reset password form when modal opens
            passwordForm.reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isOpen, initialTab, isOAuthAccount]); // Remove passwordForm from dependencies

    // Reset password form when switching to password tab
    useEffect(() => {
        if (activeTab === 'password') {
            passwordForm.reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [activeTab]); // Remove passwordForm from dependencies to prevent interference

    // Restore profile form when switching back to profile tab
    useEffect(() => {
        if (activeTab === 'profile') {
            if (profile) {
                profileForm.reset({
                    fullname: profile.fullname || ''
                });
            } else if (userData) {
                profileForm.reset({
                    fullname: userData.fullname || ''
                });
            }
        }
    }, [activeTab]);

    // Update form data when profile is loaded or when modal opens with userData
    useEffect(() => {
        if (profile) {
            profileForm.reset({
                fullname: profile.fullname || ''
            });
        } else if (userData && isOpen) {
            // Use userData as fallback if profile is not loaded yet
            profileForm.reset({
                fullname: userData.fullname || ''
            });
        }
    }, [profile, userData, isOpen]); // Remove profileForm from dependencies

    const handleProfileSubmit = async (data) => {
        const success = await updateProfile(data);
        if (success) {
            setOpen(false);
        }
    };

    const handlePasswordSubmit = async (data) => {
        const success = await changePassword(data);
        if (success) {
            passwordForm.reset();
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Profile Settings
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                activeTab === 'profile'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Profile Information
                        </button>
                        {!isOAuthAccount && (
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    activeTab === 'password'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Change Password
                            </button>
                        )}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'profile' || isOAuthAccount ? (
                        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        {...profileForm.register('fullname')}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            profileForm.formState.errors.fullname
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {profileForm.formState.errors.fullname && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {profileForm.formState.errors.fullname.message}
                                    </p>
                                )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={authenticatedUser?.email || ''}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                        </form>
                    ) : (
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        {...passwordForm.register('currentPassword')}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            passwordForm.formState.errors.currentPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordForm.formState.errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordForm.formState.errors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        {...passwordForm.register('newPassword')}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            passwordForm.formState.errors.newPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordForm.formState.errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        {...passwordForm.register('confirmPassword')}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            passwordForm.formState.errors.confirmPassword
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                        }`}
                                        placeholder="Confirm your new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordForm.formState.errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={activeTab === 'profile' ? profileForm.handleSubmit(handleProfileSubmit) : passwordForm.handleSubmit(handlePasswordSubmit)}
                        disabled={loading || (activeTab === 'profile' ? !isProfileDirty || !isProfileValid : !hasPasswordInput)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            activeTab === 'profile' ? 'Update Profile' : 'Change Password'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonorProfileUpdateModal;
