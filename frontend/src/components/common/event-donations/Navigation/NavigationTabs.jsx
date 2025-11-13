import React from "react";

const NavigationTabs = ({ tabs, activeTab, onTabChange }) => (
    <div className="px-6 py-3 border-gray-200 mb-6">
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button 
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center cursor-pointer space-x-2 px-3 py-2 font-medium ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
);

export default NavigationTabs;
