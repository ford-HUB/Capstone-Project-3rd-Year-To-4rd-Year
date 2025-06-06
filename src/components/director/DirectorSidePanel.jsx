import { LayoutDashboard, Users, FileText, MessageSquare, Calendar, Bell, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { asset } from "../../assets/asset";

const DirectorSidePanel = () => {
  const contacts = [
    { id: 1, name: "UCLM", img: asset.uclmLogo, active: true },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen w-12 bg-gray-50 mr-3 flex flex-col items-center pt-23 p-11">
        <div className="space-y-4">
          <button className="p-2 rounded-xl hover:bg-gray-200" title="Dashboard">
            <Link to="/director/dashboard">
              <Home size={25} />
            </Link>
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-200" title="Manage Users">
            <Link to="/director/users">
              <Users size={25} />
            </Link>
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-200 relative" title="Notifications">
            <Link to="/director/notifications">
              <Bell size={25} />
            </Link>
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
          </button> 
          <button className="p-2 rounded-xl hover:bg-gray-200" title="Calendar">
            <Link to="/director/calendar">
              <Calendar size={25} />
            </Link>
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-200" title="Manage Reports">
            <Link to="/director/reports">
              <FileText size={25} />
            </Link>
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-200" title="Manage Feedback">
            <Link to="/director/feedback">
              <MessageSquare size={25} />
            </Link>
          </button>
          
        </div>

        <div className="my-4 w-6 border-t border-gray-300" />
        <div className="flex-1 overflow-y-auto space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="relative">
              <img
                src={contact.img}
                alt={contact.name}
                className="w-10 h-10 rounded-xl mx-auto cursor-pointer"
              />
              {contact.active && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default DirectorSidePanel; 