import React from "react";

const TextInput = ({ name, readOnly, placeholder, ...props }) => (
    <input
      type="text"
      name={name}
      {...props}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        readOnly ? 'bg-gray-50' : ''
      }`}
    />
)

export default TextInput;