import React from 'react';

/**
 * Reusable Select Filter Component
 * Provides consistent select dropdown functionality
 */
const SelectFilter = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = "",
    disabled = false
}) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;
