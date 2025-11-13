import React from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const DocumentRequestBulkActions = ({
    selectedRequests,
    onClearSelection,
    onBulkApprove,
    onBulkReject,
    bulkActionLoading
}) => {
    if (selectedRequests.length === 0) return null;

    return (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-blue-700">
                        {selectedRequests.length} request{selectedRequests.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={onClearSelection}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Clear selection
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={onBulkApprove}
                        disabled={bulkActionLoading}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                        {bulkActionLoading ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                            <CheckCircle className="w-3 h-3" />
                        )}
                        <span>Approve All</span>
                    </button>
                    <button 
                        onClick={onBulkReject}
                        disabled={bulkActionLoading}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                        <XCircle className="w-3 h-3" />
                        <span>Reject All</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentRequestBulkActions;
