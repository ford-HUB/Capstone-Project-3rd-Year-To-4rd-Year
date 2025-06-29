import React from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, email, action }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {action === 'approved' ? 'Approve Request' : 'Decline Request'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Are you sure you want to {action === 'approved' ? 'approve' : 'decline'} the registration request for:
                        <span className="font-medium text-gray-800 px-2">{email}</span>
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(action)}
                        className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                            action === 'approved' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {action === 'approved' ? (
                            <>
                                <CheckCircle2 size={20} />
                                Approve
                            </>
                        ) : (
                            <>
                                <XCircle size={20} />
                                Decline
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal; 