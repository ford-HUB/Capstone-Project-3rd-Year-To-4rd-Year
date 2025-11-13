import React from "react";

const TabButton = ({ icon: Icon, text, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        active
          ? 'border-green-500 text-green-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </button>
);

export default TabButton;