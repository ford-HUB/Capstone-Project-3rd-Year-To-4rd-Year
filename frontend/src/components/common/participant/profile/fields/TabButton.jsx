import React from "react";

const TabButton = ({ icon: Icon, text, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center space-x-2 py-4 ${
        active
          ? 'border-b-2 border-green-500 text-green-600 font-medium'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </button>
);

export default TabButton