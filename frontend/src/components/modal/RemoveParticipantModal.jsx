import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const RemoveParticipantModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    participantName, 
    eventTitle,
    loading = false 
}) => {
    const [reason, setReason] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim()) {
            onConfirm(reason.trim());
        }
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Remove Participant
                            </h2>
                            <p className="text-sm text-gray-600">
                                This action cannot be undone
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-gray-700 mb-2">
                            Are you sure you want to remove <span className="font-medium text-gray-900">{participantName}</span> from:
                        </p>
                        <p className="font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg text-sm">
                            {eventTitle}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for removal <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a reason for removing this participant..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                rows={3}
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This reason will be sent to the participant via email.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reason.trim() || loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Remove Participant
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RemoveParticipantModal;
