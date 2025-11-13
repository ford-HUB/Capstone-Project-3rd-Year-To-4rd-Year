import React from 'react';

const Checkbox = ({ id, children, ...props }) => (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        id={id}
        {...props}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
      />
      <label htmlFor={id} className="flex-1 text-sm text-gray-700">
        {children}
      </label>
    </div>
);

export default Checkbox;