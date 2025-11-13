import React from 'react';

const FilterSelect = ({
    label,
    value,
    options,
    onChange,
    icon: Icon,
    className = ""
}) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {Icon && <Icon className="w-4 h-4 inline mr-1" />}
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterSelect;
