import React from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * Reusable Filter Section Component
 * Follows the DRY principle by providing a consistent filter interface
 */
const FilterSection = ({
    title = "Filters",
    icon: Icon = Filter,
    children,
    onClearFilters,
    showClearButton = true,
    clearButtonText = "Clear all filters",
    className = ""
}) => {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 ${className}`}>
            <div className="flex items-center space-x-2 mb-4">
                <Icon className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            
            <div className="space-y-4">
                {children}
            </div>

            {/* Clear Filters Button */}
            {showClearButton && onClearFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
                    >
                        {clearButtonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterSection;
