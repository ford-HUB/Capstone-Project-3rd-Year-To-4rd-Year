import React from 'react';

const Dropdown = ({ trigger, children, isOpen, onToggle }) => (
  <div className="relative">
    <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded">
      {trigger}
    </button>
    {isOpen && (
      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
        {children}
      </div>
    )}
  </div>
);

export default Dropdown;
