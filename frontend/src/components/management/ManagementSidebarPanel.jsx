import React from "react";
import { Calendar, Pickaxe, LayoutDashboard, ChevronDown, CircleUser, Database, Users, FileCogIcon, FileUser, HandCoins, StickyNote, Inbox } from "lucide-react";
import MenuItem from "../common/MenuItem";
import ExpandableMenuItem from "../common/ExpandableMenuItem";
import '../../styles/scrollbar.css'
import { asset } from "../../assets/asset";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/management/useAuthStore.js";

const ManagementSidebarPanel = ({ sidebarCollapsed }) => {
  const [dashboardExpanded, setDashboardExpanded] = React.useState(true);
  const [eventExpanded, setEventExpanded] = React.useState(false);
  const [volunteerExpanded, setVolunteerExpanded] = React.useState(false);
  const [formBuilderExpanded, setFormBuilderExpanded] = React.useState(false)
  const [drExpanded, setDrExpanded] = React.useState(false)

  const { authenticatedManagement } = useAuthStore()


  return (
    <>
      <div className={`bg-white border-r border-gray-300 shadow-lg transition-all duration-300 flex flex-col h-screen overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide ${sidebarCollapsed ? 'md:w-24' : 'block w-74 md:w-74'} hidden sm:block`}>

        <nav className="flex-1 overflow-y-auto mx-4 py-4 space-y-10 scrollbar-hide">
          <div className="flex items-center">
            <div className="rounded-lg flex items-center justify-center">
              <img src={asset.logo} alt="UCLMCARES" className={`h-12 w-12 ${sidebarCollapsed ? `h-5 w-5`: ``}`} />
            </div>
            {!sidebarCollapsed ? <span className="ml-3 text-xl font-bold text-gray-800">{ !authenticatedManagement ? 'Unauthorzed Access': authenticatedManagement.Role.name === 'staff' ? 'CARES STAFF': authenticatedManagement.Role.name === 'coordinator' ? 'CARES COORDINATOR': 'ASSIST COORDINATOR' }</span>: ''}<br/>
          </div>
          <div className="pl-1 mb-4">
            {!sidebarCollapsed && <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MENU</span>}
          </div>

          <div className="mb-2">
          <button
            onClick={() => setDashboardExpanded(!dashboardExpanded)}
            className={`flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 ${dashboardExpanded ? `bg-blue-50 rounded-md`: ``} hover:text-blue-600 transition-colors`}
          >
            <LayoutDashboard className={`w-5 h-5 ${dashboardExpanded && `text-blue-600`}`} />
            {!sidebarCollapsed && (
              <>
                <span className={`ml-3 ${dashboardExpanded ? `text-blue-600`: ``}`}>Dashboard</span>
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform ${
                    dashboardExpanded ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </>
            )}
          </button>

          <div
            className={`ml-10 pt-2 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${dashboardExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <NavLink 
              to="/management/dashboard" 
              end 
              className={({ isActive }) => {
                return `block px-3 py-2 rounded-md hover:bg-gray-50
                ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
              }}
            >
              Overview
            </NavLink>
      
          </div>
        </div>

          <div className="space-y-4">
            <MenuItem icon={CircleUser} label="User Profile" route={'/management/profile'} collapsed={sidebarCollapsed} />
            <MenuItem icon={Inbox} label="My Logs" route={'/management/my-logs'} collapsed={sidebarCollapsed} />

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={FileCogIcon} 
              label="Manage Event" 
              expanded={eventExpanded}
              onToggle={() => setEventExpanded(!eventExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${eventExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100 ' : 'max-h-0 opacity-0'}`}>

                <NavLink to="/management/event-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Event
                </NavLink>

                <NavLink to="/management/attendance-log" end className={({ isActive }) => {
                    return `block px-3 py-2 rounded-md hover:bg-gray-50
                    ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}>
                    Attendance
                </NavLink>
              </div>
            </div>

            {
                authenticatedManagement.Role.name === 'staff' &&
                <div className="mt-4">
                <ExpandableMenuItem 
                    icon={Pickaxe} 
                    label="Google Forms" 
                    expanded={formBuilderExpanded}
                    onToggle={() => setFormBuilderExpanded(!formBuilderExpanded)}
                    collapsed={sidebarCollapsed}
                    />
                        <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
                        ${formBuilderExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>

                            <NavLink to="/management/upload-form" end className={({ isActive }) => {
                            return `block px-3 py-2 rounded-md hover:bg-gray-50
                            ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                            }}
                            >
                            Upload Form
                            </NavLink>

                            <NavLink to="/management/google-form-list" end className={({ isActive }) => {
                            return `block px-3 py-2 rounded-md hover:bg-gray-50
                            ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                            }}
                            >
                                Forms
                            </NavLink>

                        </div>
                </div>
            }

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={Database} 
              label="Document Repository" 
              expanded={drExpanded}
              onToggle={() => setDrExpanded(!drExpanded)}
              collapsed={sidebarCollapsed}/>

              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${drExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                {
                    (authenticatedManagement.Role.name === 'coordinator') &&
                    <NavLink to="/management/upload-document" end className={({ isActive }) => {
                        return `block px-3 py-2 rounded-md hover:bg-gray-50
                        ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                    }}
                    >
                        Upload Documents
                    </NavLink>
      
                }

                <NavLink to="/management/manage-files" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Manage Files
                </NavLink>

                <NavLink to="/management/submitted-documents" end className={({ isActive }) => {
                    return `block px-3 py-2 rounded-md hover:bg-gray-50
                    ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                    }} >
                    Submitted Documents
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ManagementSidebarPanel; 