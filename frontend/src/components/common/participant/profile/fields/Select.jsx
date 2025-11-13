import React from 'react';

const Select = ({ options, placeholder, disabled, ...props }) => (
    <select
      {...props}
      disabled={disabled}
      className={`w-full ${disabled ? 'cursor-not-allowed': ''} px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
);

export default Select;