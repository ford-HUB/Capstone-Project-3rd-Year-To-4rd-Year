import React from "react";
import { Calendar, LibraryBig, FileVolume, Inbox, LayoutDashboard, ChevronDown, CircleUser, Database, Users, FileCogIcon, FileUser, HandCoins, StickyNote, CreditCard, Pickaxe } from "lucide-react";
import MenuItem from "../common/MenuItem";
import ExpandableMenuItem from "../common/ExpandableMenuItem";
import '../../styles/scrollbar.css'
import { asset } from "../../assets/asset";
import { NavLink } from "react-router-dom";

const DirectorSidebarPanel = ({ sidebarCollapsed }) => {
  const [dashboardExpanded, setDashboardExpanded] = React.useState(true);
  const [eventExpanded, setEventExpanded] = React.useState(false);
  const [beneficiaryExpanded, setBeneficiaryExpanded] = React.useState(false)
  const [volunteerExpanded, setVolunteerExpanded] = React.useState(false);
  const [certificateExpanded, setCertificateExpanded] = React.useState(false)
  const [formBuilderExpanded, setFormBuilderExpanded] = React.useState(false)
  const [dFExpanded, setDFExpanded] = React.useState(false);
  const [feedbackExpanded, setFeedbackExpanded] = React.useState(false)
  const [testimonialExpanded, setTestimonialExpanded] = React.useState(false)
  const [drExpanded, setDrExpanded] = React.useState(false)
  const [activityLogExpanded, setActivityLogExpanded] = React.useState(false)

  return (
    <>
      <div className={`bg-white border-r border-gray-300 shadow-lg transition-all duration-300 flex flex-col h-screen overflow-y-auto px-2 py-4 space-y-2 scrollbar-hide ${sidebarCollapsed ? 'md:w-24' : 'block w-74 md:w-74'} hidden sm:block`}>

        <nav className="flex-1 overflow-y-auto mx-4 py-4 space-y-10 scrollbar-hide">
          <div className="flex items-center">
            <div className="rounded-lg flex items-center justify-center">
              <img src={asset.logo} alt="UCLMCARES" className={`h-12 w-12 ${sidebarCollapsed ? `h-5 w-5`: ``}`} />
            </div>
            {!sidebarCollapsed ? <span className="ml-3 text-xl font-bold text-gray-800">CARES DIRECTOR</span>: ''}<br/>
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
            <NavLink to="/director/overview" end className={({ isActive }) => {
              return `block px-3 py-2 rounded-md hover:bg-gray-50
              ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
            }}
            >
              Overview
            </NavLink>

            <NavLink to="/director/statistics" end className={({ isActive }) => {
              return `block px-3 py-2 rounded-md hover:bg-gray-50
              ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
            }}
            >
              Statistics
            </NavLink>

            <NavLink to="/director/system-performance" end className={({ isActive }) => {
              return `block px-3 py-2 rounded-md hover:bg-gray-50
              ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
            }}
            >
              System Performance
            </NavLink>
      
          </div>
        </div>

          <div className="space-y-4">
            <MenuItem icon={CircleUser} label="User Profile" route={'/director/profile'} collapsed={sidebarCollapsed} />
            <MenuItem icon={Users} label="Manage User" badge="" route={'/director/manage-users'} collapsed={sidebarCollapsed} />
            <MenuItem icon={FileVolume} label="Post Monthly Report" route={'/director/post-requirements'} collapsed={sidebarCollapsed} />
            <MenuItem icon={LibraryBig} label="Inter Donation Tracking" route={'/director/internal-donation-tracking'} collapsed={sidebarCollapsed} />

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

                <NavLink to="/director/event-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Event
                </NavLink>

                <NavLink to="/director/attendance-log" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Attendance
                </NavLink>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={FileCogIcon} 
              label="Manage Beneficiary" 
              expanded={beneficiaryExpanded}
              onToggle={() => setBeneficiaryExpanded(!beneficiaryExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${beneficiaryExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100 ' : 'max-h-0 opacity-0'}`}>

                <NavLink to="/director/beneficiary-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  List
                </NavLink>

                <NavLink to="/director/beneficiary-request" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Request
                </NavLink>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={CreditCard} 
              label="Manage Certficate" 
              expanded={certificateExpanded}
              onToggle={() => setCertificateExpanded(!certificateExpanded)}
              collapsed={sidebarCollapsed}
              />
              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${certificateExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <NavLink to="/director/templates-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Templates
                </NavLink>

                <NavLink to="/director/deployed-certificate-templates" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Deployed Certificate Templates
                </NavLink>
              </div>
            </div>

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

                <NavLink to="/director/upload-form" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Upload Form
                </NavLink>

                <NavLink to="/director/google-form-list" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    Forms
                </NavLink>

              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={Inbox} 
              label="Manage Testimonials" 
              expanded={testimonialExpanded}
              onToggle={() => setTestimonialExpanded(!testimonialExpanded)}
              collapsed={sidebarCollapsed}/>

              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${testimonialExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>

                <NavLink to="/director/testimonials/submitted" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    Pending Testimonials
                </NavLink>

                <NavLink to="/director/testimonials" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    All Testimonial Records
                </NavLink>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={Database} 
              label="Document Repository" 
              expanded={drExpanded}
              onToggle={() => setDrExpanded(!drExpanded)}
              collapsed={sidebarCollapsed}/>

              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${drExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>

                <NavLink to="/director/request-approval-document" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    Document Request Approval
                </NavLink>

                <NavLink to="/director/manage-files" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Manage Files
                </NavLink>

                <NavLink to="/director/submitted-documents" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                  Submitted Documents
                </NavLink>
              </div>
            </div>

            <div className="mt-4">
              <ExpandableMenuItem 
              icon={Inbox} 
              label="Activity Logs" 
              expanded={activityLogExpanded}
              onToggle={() => setActivityLogExpanded(!activityLogExpanded)}
              collapsed={sidebarCollapsed}/>

              <div className={`mt-2.5 ml-10 text-sm bg-white overflow-hidden transition-all duration-300 ease-in-out
              ${activityLogExpanded && !sidebarCollapsed ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>

                <NavLink to="/director/my-logs/record" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    My Logs
                </NavLink>

                <NavLink to="/director/all-users-logs/recorded" end className={({ isActive }) => {
                  return `block px-3 py-2 rounded-md hover:bg-gray-50
                  ${isActive ? 'text-blue-600 bg-gray-50 rounded-md': 'text-gray-800'}`
                }}
                >
                    All Users Logs
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default DirectorSidebarPanel; 