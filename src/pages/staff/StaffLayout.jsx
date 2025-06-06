import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import { User } from 'lucide-react';
import { asset } from '../../assets/asset';

const StaffLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="flex items-center justify-between h-14 px-6 bg-white border-b w-full">
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
          
          {/* Profile Section */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
              <span className="text-sm">C</span>
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