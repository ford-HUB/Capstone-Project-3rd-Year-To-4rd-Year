import { NavLink } from "react-router-dom";

const MenuItem = ({ icon: Icon, label, route, badge, badgeColor = 'blue', collapsed }) => (
  <NavLink to={route} end className={({ isActive }) => {
  return `flex items-center px-4 py-3 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
    isActive ? 'text-blue-600 bg-gray-50 rounded-md' : 'text-gray-700 rounded-md'}`}}>
    <Icon className="w-5 h-5" />
    {!collapsed && (
      <>
        <span className="ml-3">{label}</span>
        {badge && (
          <span className={`ml-auto text-xs px-2 py-1 rounded ${
            badgeColor === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

export default MenuItem