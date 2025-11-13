import React from 'react';

const DropdownItem = ({ icon: Icon, children, onClick, variant = "default" }) => {
  const variantClasses = {
    default: "text-gray-700 hover:bg-gray-50",
    danger: "text-red-700 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm ${variantClasses[variant]} first:rounded-t-lg last:rounded-b-lg`}
    >
      <Icon size={16} className="mr-3" />
      {children}
    </button>
  );
};

export default DropdownItem;
