import React from "react";
import { AlertCircle } from "lucide-react";

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  error, 
  options, 
  placeholder, 
  required = false, 
  disabled = false 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`block w-full px-3 py-3 border ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        disabled ? 'bg-gray-100 text-gray-500' : ''
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default SelectField;
