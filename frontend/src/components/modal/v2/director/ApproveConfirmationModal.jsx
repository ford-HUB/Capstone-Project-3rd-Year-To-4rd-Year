import React from 'react';
import { X, CheckCircle, User, Calendar, MapPin } from 'lucide-react';

const ApproveConfirmationModal = ({ open, setOpen, registration, onConfirm }) => {
    if (!open || !registration) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

    const handleConfirm = () => {
        onConfirm(registration);
        setOpen(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Approve Registration</h2>
                            <p className="text-sm text-gray-600">Confirm approval of beneficiary registration</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to approve this beneficiary registration?
                        </p>
                        
                        {/* Registration Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {registration.beneficiary?.firstname} {registration.beneficiary?.lastname}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {registration.beneficiary?.Account?.email}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {registration.event?.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(registration.event?.event_started)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <p className="text-sm text-gray-600">
                                    {registration.event?.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Approve Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveConfirmationModal;
