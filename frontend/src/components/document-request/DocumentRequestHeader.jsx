import React from 'react';
import { RefreshCw } from 'lucide-react';

const DocumentRequestHeader = ({ onRefresh, loading }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Document Request Approvals
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Review and manage document approval requests from coordinators
                </p>
            </div>
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold">
                            Document Requests
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentRequestHeader;
