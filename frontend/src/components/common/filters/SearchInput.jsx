import React from 'react';
import { Search } from 'lucide-react';

/**
 * Reusable Search Input Component
 * Provides consistent search functionality across the application
 */
const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    label = "Search",
    className = "",
    disabled = false
}) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
};

export default SearchInput;
