import { ChevronDown } from 'lucide-react';

const ExpandableMenuItem = ({ icon: Icon, label, expanded, onToggle, collapsed }) => (
  <button
    onClick={onToggle}
    aria-expanded={expanded}
    className={`flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${expanded && 'bg-gray-50 rounded-md'}`}
  >
    <Icon className="w-5 h-5" />
    {!collapsed && (
      <>
        <span className="ml-3">{label}</span>
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${expanded && 'rotate-180'}`} />
      </>
    )}
  </button>
);

export default ExpandableMenuItem;
