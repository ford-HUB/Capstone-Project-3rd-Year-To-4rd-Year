import React from 'react';

const Badge = ({ variant = "default", children, className = "" }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
