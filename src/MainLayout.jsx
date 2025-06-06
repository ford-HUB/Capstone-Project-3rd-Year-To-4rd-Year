import { useLocation, Routes, Route, matchPath } from "react-router-dom"
import Navbar from "./components/global/Navbar"
import ParticipantNavbar from './components/participant/ParticipantNavbar'
import CoordinatorNavbar from './components/coordinator/CoordinatorNavbar'
import DirectorNavbar from './components/director/DirectorNavbar'
import MainTree from './MainTree'

const MainLayout = () => {
    const location = useLocation()

    const checkRoute = MainTree.find((route) => {
        if (route.path === '/staff/*') {
            return location.pathname.startsWith('/staff')
        }
        return route.path && matchPath(route.path, location.pathname)
    })

    const renderNavbar = () => {
        switch (checkRoute?.navbar) {
            case 'guest':
                // it check the path of our URL kung asa siya na location path if nay mo match
                // then e return niya ang '/location/path/id
                const guestMatchedPath = matchPath('/home/guest/:id', location.pathname) ||
                    matchPath('/timeline/guest/:id', location.pathname) ||
                    matchPath('/programs/guest/:id', location.pathname) ||
                    matchPath('/upcomingEvents/guest/:id', location.pathname)

                // optional chaining for not throwing any errors
                // insteed it throw the undefine or null
                const id = guestMatchedPath?.params?.id // pass the token id to functional compo navbar
                return <Navbar idRoute={id} />
            
            case 'user':
                return <ParticipantNavbar/>

            case 'coordinator': 
                return <CoordinatorNavbar/>

            case 'director':
                return <DirectorNavbar/>
            
            case 'staff':
                return null // Staff has its own sidebar
                
            default:
                return null;
        }
    }

    const renderRoutes = (routes) => {
        return routes.map((route, index) => {
            if (route.children) {
                return (
                    <Route key={index} path={route.path} element={route.element}>
                        {renderRoutes(route.children)}
                    </Route>
                );
            }
            return <Route key={index} path={route.path} element={route.element} />;
        });
    };

    return (
        <>
            {renderNavbar()}
            <Routes>
                {renderRoutes(MainTree)}
            </Routes>
        </>
    )
}

export default MainLayout