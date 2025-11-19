import React, { useState, useEffect } from 'react';
import { X, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBeneficiaryProfileStore } from '../../../../store/beneficiary/useBeneficiaryProfileStore';
import { useTestimonialStore } from '../../../../store/beneficiary/useTestimonialStore';
import { generateInitials } from '../../../../utils/generateInitials.js';

const testimonialSchema = z.object({
    rating: z.number().min(1, { message: 'Rating is required.' }).max(5),
    initials: z.string().optional()
});

const TestimonialSubmissionModal = ({ 
    isOpen, 
    onClose, 
    eventData,
    onSuccess 
}) => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { beneficiaryData } = useBeneficiaryProfileStore();
    const { 
        isSubmitting, 
        submitTestimonial, 
        clearState, 
        resetSuccess 
    } = useTestimonialStore();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            rating: 0,
            initials: ''
        }
    });

    const rating = watch('rating');
    const initials = watch('initials');

    // Auto-fill initials from beneficiary data
    useEffect(() => {
        if (beneficiaryData && !initials) {
            const generatedInitials = generateInitials(beneficiaryData);
            if (generatedInitials) {
                setValue('initials', generatedInitials);
            }
        }
    }, [beneficiaryData, initials, setValue]);

    const onSubmit = async (data) => {
        try {
            // Auto-determine role based on beneficiary type
            const role = beneficiaryData?.organization_name 
                ? beneficiaryData.organization_name 
                : 'Community Beneficiary';

            const response = await submitTestimonial({
                rating: data.rating,
                role: role,
                initials: data.initials || ''
            });

            if (response.success) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Testimonial submission error:', error);
        }
    };

    const handleClose = () => {
        setSubmitSuccess(false);
        clearState();
        resetSuccess();
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            clearState();
            resetSuccess();
            setSubmitSuccess(false);
        }
    }, [isOpen, clearState, resetSuccess]);

    const handleRatingClick = (value) => {
        setValue('rating', value, { shouldValidate: true });
    };

    if (!isOpen) return null;

    const beneficiaryName = beneficiaryData?.organization_name 
        ? beneficiaryData.organization_name 
        : beneficiaryData 
            ? `${beneficiaryData.firstname} ${beneficiaryData.lastname}`
            : 'Beneficiary';

    const beneficiaryRole = beneficiaryData?.organization_name 
        ? beneficiaryData.organization_name 
        : 'Community Beneficiary';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Share Your Experience</h2>
                        <p className="text-blue-100 text-sm">
                            {eventData?.title ? `Tell us about your experience with "${eventData.title}"` : 'We value your feedback!'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {submitSuccess ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                            <p className="text-gray-600">
                                Your testimonial has been submitted successfully.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name Display (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={beneficiaryName}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be automatically filled from your profile
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleRatingClick(value)}
                                            className={`p-2 rounded-lg transition-all ${
                                                rating >= value
                                                    ? 'text-yellow-400 bg-yellow-50'
                                                    : 'text-gray-300 hover:text-yellow-300'
                                            }`}
                                        >
                                            <Star
                                                size={32}
                                                fill={rating >= value ? 'currentColor' : 'none'}
                                                className="transition-transform hover:scale-110"
                                            />
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                                )}
                                {rating > 0 && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {rating === 5 && 'Excellent!'}
                                        {rating === 4 && 'Great!'}
                                        {rating === 3 && 'Good!'}
                                        {rating === 2 && 'Fair'}
                                        {rating === 1 && 'Poor'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={beneficiaryRole}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {beneficiaryData?.organization_name 
                                        ? 'This is automatically set based on your organization name'
                                        : 'This is automatically set as "Community Beneficiary"'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Initials (Optional)
                                </label>
                                <input
                                    type="text"
                                    {...register('initials')}
                                    placeholder="e.g., JM, SM"
                                    maxLength={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Initials to display with your testimonial (auto-generated if left empty)
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Skip
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={isSubmitting || rating === 0}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Testimonial'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestimonialSubmissionModal;

