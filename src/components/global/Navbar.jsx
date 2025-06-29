import { asset } from "../../assets/asset";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-3">
          <div className="text-gray-700">Settings content goes here.</div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ idRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // This check the current active path of our url and do a specification below na
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="flex sticky top-0 z-50 justify-between items-center px-14 py-1 bg-white drop-shadow-sm rounded-b-sm font-[Roboto] text-gray-600">
        <div className="logoContainer flex items-center">
          <img
            src={asset.logo}
            alt="UCLM CARES"
            className="h-[46px] w-[46px] flex justify-center items-center cursor-pointer"
          />
          <div className="title flex justify-center items-center px-1.5 text-[24px] font-bold">
            <h3>UCLM CARES</h3>
          </div>
        </div>

        <div className="navLinks flex justify-center items-center text-sm/6">
          <Link to={`/home/guest/${idRoute}`} className={`px-5 ${ isActive(`/home/guest/${idRoute}`) ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`}>Home</Link>
          <Link to={`/programs/guest/${idRoute}`} className={`px-5 ${ isActive(`/programs/guest/${idRoute}`)? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Programs</Link>
          <Link to={`/upcomingEvents/guest/${idRoute}`} className={`px-3 ${ isActive(`/upcomingEvents/guest/${idRoute}`) ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Up Coming Events</Link>
          <Link to={`/accomplishments/guest/${idRoute}`} className={`px-5 ${ isActive(`/accomplishments/guest/${idRoute}`)? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Accomplishments</Link>
        </div>

        <div className="sideContainer flex justify-end items-center text-md/6 text-white gap-2">
          <button onClick={() => navigate('/')} type="submit" className="bg-blue-600 px-2.5 py-1.5 rounded-[4px] hover:bg-blue-700 transition-colors duration-400 hover:text-white">
            Get Involved
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Open settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Navbar;
