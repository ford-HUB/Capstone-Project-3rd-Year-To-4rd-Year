import React from "react";

const Select = ({ name, className = "", children, ...props }) => (
    <select
        name={name}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${className}`}
        {...props}
    >
        {children}
    </select>
);

export default Select;
