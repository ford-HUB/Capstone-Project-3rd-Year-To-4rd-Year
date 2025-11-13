import React from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const PasswordField = ({ 
  label, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false, 
  showPassword, 
  togglePassword 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`block w-full pl-3 pr-10 py-3 border ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
      />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        {showPassword ? 
          <EyeOff className="h-4 w-4 text-gray-400" /> : 
          <Eye className="h-4 w-4 text-gray-400" />
        }
      </button>
    </div>
    {error && (
      <div className="flex items-center space-x-1 text-red-600 text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default PasswordField;
