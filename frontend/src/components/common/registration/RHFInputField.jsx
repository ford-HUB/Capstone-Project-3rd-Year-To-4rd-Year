import React from "react";

const RHFInputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  icon: Icon, 
  required = false, 
  error, 
  register, 
  name,
  maxLength,
  min,
  max,
  pattern,
  ...props 
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        pattern={pattern}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          Icon ? 'pl-10' : ''
        } ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
        {...register(name, {
          setValueAs: (value) => {
            if (name === 'age') {
              return value === '' ? "" : Number(value);
            }
            return value;
          }
        })}
        {...props}
      />
    </div>
    
    {error && (
      <p className="text-red-500 text-sm mt-1">{error.message}</p>
    )}
  </div>
);

export default RHFInputField;