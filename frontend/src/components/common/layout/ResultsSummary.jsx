import React from 'react';

/**
 * Reusable Results Summary Component
 * Provides consistent results display across the application
 */
const ResultsSummary = ({
    currentCount,
    totalCount,
    itemName = "items",
    showStatus = false,
    statusText = "Active",
    statusColor = "bg-green-400",
    className = "mb-6 flex items-center justify-between"
}) => {
    return (
        <div className={className}>
            <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{currentCount}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalCount}</span> {itemName}
                </p>
                {showStatus && currentCount > 0 && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
                        <span>{statusText}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsSummary;
