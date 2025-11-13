import React from 'react';

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, required = false, icon: Icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
        <input
          type={type}
          name={name}
          {...props}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default InputField
  