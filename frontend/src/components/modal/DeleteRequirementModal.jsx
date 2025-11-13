import React from 'react';
import { X, Trash2 } from 'lucide-react';

const DeleteRequirementModal = ({ 
    open, 
    setOpen, 
    onConfirm, 
    requirement,
    isLoading = false 
}) => {
    if (!open) return null;

    const handleConfirm = () => {
        onConfirm(requirement);
        setOpen(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-full bg-red-50 border border-red-200">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Delete this requirement?
                            </h3>
                            <div className="space-y-1">
                                {requirement?.title && (
                                    <p className="text-sm text-gray-600 truncate">
                                        <span className="font-medium text-gray-900">
                                            "{requirement.title}"
                                        </span>
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    This requirement will be permanently removed and cannot be undone.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                        >
                            No
                        </button>
                        
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '...' : 'Yes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteRequirementModal;
