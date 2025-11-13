import React from 'react';
import { RefreshCw } from 'lucide-react';

const RefreshControls = ({ 
    isLoading, 
    onRefresh, 
    autoRefresh, 
    onAutoRefreshChange,
    lastUpdated 
}) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => onAutoRefreshChange(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                    Auto Refresh
                </label>
            </div>
            <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
            </button>

            {lastUpdated && (
                <p className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleString()}
                </p>
            )}
        </div>
    );
};

export default RefreshControls;
