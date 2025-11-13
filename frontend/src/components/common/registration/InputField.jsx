import React from "react";
import { AlertCircle } from "lucide-react";

const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon: Icon, 
  required = false, 
  disabled = false,
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border ${
          error ? 'border-red-300 bg-red-50' : 
          disabled ? 'border-gray-200 bg-gray-100 text-gray-500' : 
          'border-gray-300 bg-white'
        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        {...props}
      />
    </div>
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default InputField;
