import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { emailUpdateSchema } from '../../../../forms/StudentSchemas.js';
import { useProfileStore } from '../../../../store/participant/useProfileStore.js';
import { useNavigate } from 'react-router-dom';

const UpdateEmailModal = ({ isOpen, setOpen, data }) => {
    const { updateEmail } = useProfileStore()
    const navigate = useNavigate()
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(emailUpdateSchema),
        defaultValues: {
            newEmail: '',
            confirmEmail: ''
        }
    })

    const onSubmitForm = async (formData) => {
        const success = await updateEmail(formData)

        if(!success) return
        navigate('/verification_code')
        console.log(formData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Update Your Email
                    </h2>
                    <button
                        onClick={setOpen}
                        className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Switch to a new email address in a few simple steps. All
                        your account info will stay connected to your new email.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your current email
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                            {data?.email}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your new email
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            {...register('newEmail')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.newEmail
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Enter new email address"
                        />
                        {errors.newEmail && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.newEmail.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm your new email
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            {...register('confirmEmail')}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.confirmEmail
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                            placeholder="Confirm new email address"
                        />
                        {errors.confirmEmail && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmEmail.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Next steps:
                        </h3>
                        <ol className="text-sm text-gray-600 space-y-1">
                            <li>
                                1. We will send a verification email to your new
                                address.
                            </li>
                            <li>
                                2. Follow the instructions in that email to
                                complete the change.
                            </li>
                        </ol>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={setOpen}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSubmitForm)}
                            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium">
                            {
                                isSubmitting ? <span className="loading loading-spinner loading-md"></span>                                : 'Change Email'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmailModal