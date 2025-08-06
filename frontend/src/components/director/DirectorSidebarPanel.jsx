import React from "react";
import { Calendar, LayoutDashboard, ChevronDown, CircleUser, Database, Users, FileCogIcon, FileUser, HandCoins, StickyNote } from "lucide-react";
import MenuItem from "../common/MenuItem";
import ExpandableMenuItem from "../common/ExpandableMenuItem";
import '../../styles/scrollbar.css'
import { asset } from "../../assets/asset";
import { NavLink } from "react-router-dom";

const DirectorSidebarPanel = ({ sidebarCollapsed }) => {
  const [dashboardExpanded, setDashboardExpanded] = React.useState(true);
  const [eventExpanded, setEventExpanded] = React.useState(false);
  const [volunteerExpanded, setVolunteerExpanded] = React.useState(false);
  const [dFExpanded, setDFExpanded] = React.useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = React.useState(false)
  const [drExpanded, setDrExpanded] = React.useState(false)

  return (
    <>
      <div className={`bg-white border-r border-gray-300 shadow-lg transition-all duration-300 flex flex-col h-screen overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide ${sidebarCollapsed ? 'md:w-24' : 'block w-74 md:w-74'} hidden sm:block`}>

        <nav className="flex-1 overflow-y-auto mx-4 py-4 space-y-10 scrollbar-hide">
          <div className="flex items-center">
            <div className="rounded-lg flex items-center justify-center">
              <img src={asset.logo} alt="UCLMCARES" className={`h-12 w-12 ${sidebarCollapsed ? `h-5 w-5`: ``}`} />
            </div>
            {!sidebarCollapsed ? <span className="ml-3 text-xl font-bold text-gray-800">CARES ADMIN</span>: ''}<br/>
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
            <a
              href="#"
              className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
            >
              Overview
            </a>

            <a
              href="#"
              className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
            >
              Statistics
            </a>

            <a
              href="#"
              className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
            >
              System Summary
            </a>
      
          </div>
        </div>

          <div className="space-y-4">
            <MenuItem icon={Calendar} label="Calendar" route={'/director/calendar'} collapsed={sidebarCollapsed} />            
            <MenuItem icon={CircleUser} label="User Profile" route={'/director/profile'} collapsed={sidebarCollapsed} />
            <MenuItem icon={Users} label="Manage User" badge="" route={'/director/manage-users'} collapsed={sidebarCollapsed} />

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
                <NavLink to="/director/map" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Map
                </NavLink>

                <NavLink to="/director/event-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  List
                </NavLink>
                {/* <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  List
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  QR CODE Attendance Log
                </a>
       */}
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={FileUser} 
              label="Manage Volunteer" 
              expanded={volunteerExpanded}
              onToggle={() => setVolunteerExpanded(!volunteerExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${volunteerExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Volunteer Profiles
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Deployed Certificates
                </a>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={HandCoins} 
              label="Donation & Financial" 
              expanded={dFExpanded}
              onToggle={() => setDFExpanded(!dFExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${dFExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Donation Records
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Financial Reports
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Export Statments
                </a>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={Database} 
              label="Document Repo" 
              expanded={drExpanded}
              onToggle={() => setDrExpanded(!drExpanded)}
              collapsed={sidebarCollapsed}/>

              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${drExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Upload Documents
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Manage Files
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Downloadable Resources
                </a>
              </div>
            </div>

            <div>
              <ExpandableMenuItem 
              icon={StickyNote} 
              label="Feedback" 
              expanded={feedbackExpanded}
              onToggle={() => setFeedbackExpanded(!feedbackExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${feedbackExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  System Feedback
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-800 rounded-md hover:bg-gray-50"
                >
                  Event Feedback
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DirectorSidebarPanel; 