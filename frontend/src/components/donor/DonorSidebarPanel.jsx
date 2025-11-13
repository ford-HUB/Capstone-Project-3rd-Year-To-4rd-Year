import React from "react";
import { 
  LayoutDashboard, 
  Heart, 
  History, 
  Search, 
  User, 
  Settings,
  Bell,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react";
import MenuItem from "../common/MenuItem";
import ExpandableMenuItem from "../common/ExpandableMenuItem";
import '../../styles/scrollbar.css'
import { asset } from "../../assets/asset";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/donor/useAuthStore.js";

const DonorSidebarPanel = ({ sidebarCollapsed }) => {
  const [dashboardExpanded, setDashboardExpanded] = React.useState(true);
  const [campaignsExpanded, setCampaignsExpanded] = React.useState(false);
  const [profileExpanded, setProfileExpanded] = React.useState(false);

  const { authenticatedDonor } = useAuthStore();

  return (
    <>
      <div className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col h-screen overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide ${sidebarCollapsed ? 'md:w-16' : 'block w-72 md:w-72'} hidden sm:block`}>
        {/* Logo Section */}
        <div className="flex items-center justify-center py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              UC
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">UCLM CARES</h1>
                <p className="text-xs text-gray-500">Donor Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 space-y-1 mt-4">
          {/* Dashboard */}
          <MenuItem
            icon={LayoutDashboard}
            label="Dashboard"
            path="/donor/dashboard"
            sidebarCollapsed={sidebarCollapsed}
            isActive={true}
          />

          {/* Campaigns Section */}
          <ExpandableMenuItem
            icon={Heart}
            label="Campaigns"
            sidebarCollapsed={sidebarCollapsed}
            expanded={campaignsExpanded}
            setExpanded={setCampaignsExpanded}
            items={[
              { label: "Browse Campaigns", path: "/donor/dashboard" },
              { label: "My Interested", path: "/donor/interested" },
              { label: "Search Campaigns", path: "/donor/search", icon: Search }
            ]}
          />

          {/* Impact & History */}
          <MenuItem
            icon={TrendingUp}
            label="My Impact"
            path="/donor/impact"
            sidebarCollapsed={sidebarCollapsed}
          />

          <MenuItem
            icon={History}
            label="Donation History"
            path="/donor/history"
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Achievements */}
          <MenuItem
            icon={Award}
            label="Achievements"
            path="/donor/achievements"
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Calendar */}
          <MenuItem
            icon={Calendar}
            label="Events Calendar"
            path="/donor/calendar"
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Notifications */}
          <MenuItem
            icon={Bell}
            label="Notifications"
            path="/donor/notifications"
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Profile Section */}
          <ExpandableMenuItem
            icon={User}
            label="Profile"
            sidebarCollapsed={sidebarCollapsed}
            expanded={profileExpanded}
            setExpanded={setProfileExpanded}
            items={[
              { label: "My Profile", path: "/donor/profile" },
              { label: "Settings", path: "/donor/settings", icon: Settings }
            ]}
          />
        </div>

        {/* User Info */}
        {!sidebarCollapsed && authenticatedDonor && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {authenticatedDonor?.email?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {authenticatedDonor?.email || 'Donor'}
                </p>
                <p className="text-xs text-gray-500">Donor</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col h-screen overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide ${sidebarCollapsed ? 'w-16' : 'w-72'} sm:hidden`}>
        {/* Mobile Logo */}
        <div className="flex items-center justify-center py-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            UC
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 space-y-1 mt-4">
          <MenuItem
            icon={LayoutDashboard}
            label="Dashboard"
            path="/donor/dashboard"
            sidebarCollapsed={false}
            isActive={true}
          />
          <MenuItem
            icon={Heart}
            label="Campaigns"
            path="/donor/campaigns"
            sidebarCollapsed={false}
          />
          <MenuItem
            icon={TrendingUp}
            label="My Impact"
            path="/donor/impact"
            sidebarCollapsed={false}
          />
          <MenuItem
            icon={History}
            label="History"
            path="/donor/history"
            sidebarCollapsed={false}
          />
          <MenuItem
            icon={User}
            label="Profile"
            path="/donor/profile"
            sidebarCollapsed={false}
          />
        </div>
      </div>
    </>
  );
};

export default DonorSidebarPanel;
