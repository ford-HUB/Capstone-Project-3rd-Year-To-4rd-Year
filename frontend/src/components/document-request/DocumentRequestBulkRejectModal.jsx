import React from 'react';
import { XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const DocumentRequestBulkRejectModal = ({
    open,
    onClose,
    onConfirm,
    selectedCount,
    rejectReason,
    setRejectReason,
    loading
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Reject All Selected Requests
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                This action will reject {selectedCount} request{selectedCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4">
                    <div className="mb-4">
                        <label htmlFor="bulk-reject-reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rejection *
                        </label>
                        <textarea
                            id="bulk-reject-reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting these requests..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                            rows={4}
                            required
                        />
                        {!rejectReason.trim() && (
                            <p className="text-xs text-red-500 mt-1">
                                Reason is required for rejection
                            </p>
                        )}
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Warning:</p>
                                <p>This action cannot be undone. All selected requests will be rejected with the same reason.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading || !rejectReason.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Rejecting...</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                <span>Reject All</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentRequestBulkRejectModal;
