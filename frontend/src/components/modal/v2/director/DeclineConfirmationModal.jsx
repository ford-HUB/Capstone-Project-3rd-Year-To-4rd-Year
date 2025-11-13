import React from 'react';
import { X, XCircle, User, Calendar, MapPin } from 'lucide-react';

const DeclineConfirmationModal = ({ open, setOpen, registration, onConfirm }) => {
    const [declineReason, setDeclineReason] = React.useState('');

    if (!open || !registration) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
            setDeclineReason('');
        }
    };

    const handleConfirm = () => {
        if (declineReason.trim()) {
            onConfirm(registration, declineReason);
            setOpen(false);
            setDeclineReason('');
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setDeclineReason('');
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
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Decline Registration</h2>
                            <p className="text-sm text-gray-600">Provide reason for declining registration</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Please provide a reason for declining this beneficiary registration:
                        </p>
                        
                        {/* Registration Details */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
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

                        {/* Reason Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Decline *
                            </label>
                            <textarea
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="Please provide a detailed reason for declining this registration..."
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows="4"
                                required
                            />
                            {!declineReason.trim() && (
                                <p className="text-xs text-red-600 mt-1">
                                    Please provide a reason for declining this registration
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!declineReason.trim()}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            Decline Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeclineConfirmationModal;
