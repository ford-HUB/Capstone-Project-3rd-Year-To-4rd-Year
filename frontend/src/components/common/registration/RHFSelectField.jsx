import React from "react";

const RHFSelectField = ({ 
  label, 
  placeholder, 
  required = false, 
  error, 
  register, 
  name,
  options = [],
  disabled = false,
  ...props 
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
      {label}
      {required && !disabled && <span className="text-red-500 ml-1">*</span>}
    </label>
    
    <select
      id={name}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        disabled 
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
          : error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
      }`}
      {...register(name)}
      disabled={disabled}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

export default RHFSelectField;