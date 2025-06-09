import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  Users,
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const StaffSidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const navigationItems = [
    { 
      icon: LayoutGrid, 
      label: 'Dashboard', 
      path: '/staff/dashboard'
    },
    { 
      icon: Users, 
      label: 'Volunteers', 
      path: '/staff/volunteers'
    },
    { 
      icon: Calendar, 
      label: 'Events', 
      path: '/staff/events'
    },
    { 
      icon: Calendar, 
      label: 'Calendar', 
      path: '/staff/calendar'
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/staff/notifications',
      hasBadge: true
    },
    { 
      icon: FileText, 
      label: 'Certificates', 
      path: '/staff/certificates'
    }
  ];

  return (
    <div className={`bg-white shadow-sm relative ${isExpanded ? 'w-64' : 'w-14'} transition-all duration-300`}>
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <ChevronRight
          size={14}
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <nav className="py-4 flex flex-col gap-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} strokeWidth={1.75} />
            {isExpanded && <span>{item.label}</span>}
            {item.hasBadge && (
              <span className={`absolute ${isExpanded ? 'right-4' : 'right-2'} top-3 w-1.5 h-1.5 bg-blue-500 rounded-full`} />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default StaffSidebar; 