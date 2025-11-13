import React from 'react';
import { Package, RefreshCw } from 'lucide-react';

const InternalDonationEmptyState = ({ hasActiveFilters = false }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Donations Found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {hasActiveFilters 
                        ? "No donations match your current filters. Try adjusting your search criteria or filters to see more results."
                        : "There are currently no donations to display. Donations will appear here once donors start contributing to events."
                    }
                </p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InternalDonationEmptyState;
