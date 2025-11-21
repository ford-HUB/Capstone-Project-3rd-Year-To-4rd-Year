import React from 'react';
import { X, CheckCircle, Trash2, User, Star, Building2, Loader2, AlertTriangle } from 'lucide-react';

const TestimonialActionModal = ({ open, setOpen, testimonial, onConfirm, isLoading, actionType = 'approve' }) => {
    if (!open || !testimonial) return null;

    const isApprove = actionType === 'approve';
    const isDelete = actionType === 'delete';

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            setOpen(false);
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm(testimonial.testimonial_id);
        }
    };

    const getBeneficiaryName = (beneficiary) => {
        if (!beneficiary) return 'Unknown';
        const { firstname, lastname, middle_initial } = beneficiary;
        return `${firstname} ${middle_initial ? middle_initial + '. ' : ''}${lastname}`.trim();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    const getHeaderConfig = () => {
        if (isApprove) {
            return {
                bgColor: 'bg-green-50',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                icon: CheckCircle,
                title: 'Approve Testimonial',
                description: 'Confirm approval of this testimonial',
                hoverBg: 'hover:bg-green-100'
            };
        } else {
            return {
                bgColor: 'bg-red-50',
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600',
                icon: AlertTriangle,
                title: 'Delete Testimonial',
                description: 'This action cannot be undone',
                hoverBg: 'hover:bg-red-100'
            };
        }
    };

    const getButtonConfig = () => {
        if (isApprove) {
            return {
                bgColor: 'bg-green-600',
                hoverBg: 'hover:bg-green-700',
                icon: CheckCircle,
                text: 'Approve Testimonial',
                loadingText: 'Approving...'
            };
        } else {
            return {
                bgColor: 'bg-red-600',
                hoverBg: 'hover:bg-red-700',
                icon: Trash2,
                text: 'Delete Testimonial',
                loadingText: 'Deleting...'
            };
        }
    };

    const headerConfig = getHeaderConfig();
    const buttonConfig = getButtonConfig();
    const IconComponent = headerConfig.icon;
    const ButtonIcon = buttonConfig.icon;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${headerConfig.bgColor} rounded-t-2xl`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${headerConfig.iconBg} rounded-full flex items-center justify-center`}>
                            <IconComponent className={`w-6 h-6 ${headerConfig.iconColor}`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{headerConfig.title}</h2>
                            <p className="text-sm text-gray-600">{headerConfig.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => !isLoading && setOpen(false)}
                        disabled={isLoading}
                        className={`p-2 ${headerConfig.hoverBg} rounded-full transition-colors disabled:opacity-50`}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            {isApprove 
                                ? 'Are you sure you want to approve this testimonial? It will be visible to the public.'
                                : 'Are you sure you want to delete this testimonial? This action cannot be undone.'
                            }
                        </p>
                        
                        {/* Testimonial Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {getBeneficiaryName(testimonial.Beneficiary)}
                                    </p>
                                    {testimonial.Beneficiary?.organization_name && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                            <Building2 className="w-3 h-3" />
                                            <span>{testimonial.Beneficiary.organization_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {renderStars(testimonial.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {testimonial.rating} / 5
                                </span>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                                <p className={`text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 ${isDelete ? 'line-clamp-3' : ''}`}>
                                    {testimonial.message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 ${buttonConfig.bgColor} ${buttonConfig.hoverBg} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {buttonConfig.loadingText}
                                </>
                            ) : (
                                <>
                                    <ButtonIcon className="w-4 h-4" />
                                    {buttonConfig.text}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialActionModal;

