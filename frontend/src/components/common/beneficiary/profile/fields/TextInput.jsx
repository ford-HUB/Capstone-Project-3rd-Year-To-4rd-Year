import React from "react";

const TextInput = ({ name, className = "", ...props }) => (
    <input
        name={name}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${className}`}
        {...props}
    />
);

export default TextInput;
