import { asset } from "../../assets/asset";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ idRoute }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // This check the current active path of our url and do a specification below na
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="flex sticky top-0 z-50 justify-between items-center px-14 py-1 bg-white drop-shadow-sm rounded-e-md font-[Roboto] text-gray-600">
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
          <Link to={`/timeline/guest/${idRoute}`} className={`px-5 ${ isActive(`/timeline/guest/${idRoute}`)? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Timeline</Link>
          <Link to={`/programs/guest/${idRoute}`} className={`px-5 ${ isActive(`/programs/guest/${idRoute}`)? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Programs
          </Link>
          <Link to={`/upcomingEvents/guest/${idRoute}`} className={`px-3 ${ isActive(`/upcomingEvents/guest/${idRoute}`) ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300` }`} >Up Coming Events</Link>
        </div>

        <div className="sideContainer flex justify-end items-center text-md/6 text-white">
          <button onClick={() => navigate('/')} type="submit" className="bg-blue-600 px-2.5 py-1.5 rounded-[4px] hover:bg-blue-700 transition-colors duration-400 hover:text-white">
            Get Involved
          </button>
        </div>
      </header>

      
    </>
  );
};

export default Navbar;
