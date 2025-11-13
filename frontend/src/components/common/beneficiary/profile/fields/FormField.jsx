import React from "react";

const FormField = ({ label, required, children, helpText, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
);

export default FormField;
