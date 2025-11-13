import { Eye, Code } from "lucide-react";

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'builder', label: 'Builder', icon: null },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'json', label: 'JSON', icon: Code }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {Icon && <Icon size={16} className="mr-1" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation