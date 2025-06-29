import React from "react"

const Settings = ({ isOpen, onClose }) => {

  return (
    <div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.05)' }}
        onClick={onClose}
      />
      <div
        className={`shadow-xl top-21 right-2 fixed right-0 h-120 w-100 max-w-md z-50 bg-white shadow-2xl rounded-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ minWidth: 340 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b ">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div className="text-gray-700">Settings content goes here.</div>
        </div>
      </div>
    </div>
  );
};

export default Settings