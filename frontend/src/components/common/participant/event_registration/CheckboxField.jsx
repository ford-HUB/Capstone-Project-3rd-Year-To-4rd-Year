import React from 'react';

const CheckboxField = ({ name, checked, onChange, children, error }) => (
    <div>
      <div className="flex items-start">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mr-3 mt-1 text-purple-600 rounded"
        />
        <label className="text-sm text-gray-700">{children}</label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

export default CheckboxField