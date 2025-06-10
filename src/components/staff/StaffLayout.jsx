import { Outlet, Link, useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import { User, Settings, LogOut, Bell } from 'lucide-react';
import { asset } from '../../assets/asset';
import { useState } from 'react';

const StaffLayout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const profileMenuItems = [
    { icon: User, label: 'Change Profile', path: '/staff/profile' },
    { icon: Settings, label: 'Settings', path: '/staff/settings' },
    { icon: LogOut, label: 'Logout', path: '/logout' }
  ];

  return (
    <div className=''>
      <div className="flex overflow-hidden">
        <StaffSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout; 