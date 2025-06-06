import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import { User, Settings, LogOut, Bell } from 'lucide-react';
import { asset } from '../../assets/asset';
import { useState } from 'react';

const StaffLayout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuItems = [
    { icon: User, label: 'Change Profile', path: '/staff/profile' },
    { icon: Settings, label: 'Settings', path: '/staff/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Full-width UCLM CARES Navbar */}
      <div className="flex items-center justify-between h-14 px-6 bg-white shadow-sm w-full">
        <div className="flex items-center gap-3">
          <img src={asset.logo} alt="UCLM CARES" className="w-7 h-7" />
          <h1 className="text-xl font-semibold">UCLM CARES</h1>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <button className="text-gray-900 text-sm">
              Achievements
            </button>
            <button className="text-gray-900 text-sm">
              Certificates
            </button>
            <button className="text-gray-900 text-sm">
              History
            </button>
          </div>
          
          {/* Notifications and Profile Section */}
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <div className="relative">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
            </div>

            {/* Profile Section with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:ring-2 hover:ring-gray-200 transition-all"
              >
                <span className="text-sm">C</span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  {profileMenuItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.path}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <item.icon size={16} strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <StaffSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout; 