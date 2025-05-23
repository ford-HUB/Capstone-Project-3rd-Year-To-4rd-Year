import { useLocation, Routes, Route, matchPath } from "react-router-dom"
import Navbar from "./components/global/Navbar"
import ParticipantNavbar from './components/participant/ParticipantNavbar'
import MainTree from './MainTree'

const MainLayout = () => {
    const location = useLocation()

    const checkRoute = MainTree.find((route) => route.path && matchPath(route.path, location.pathname))
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
                
            default:
                return null;
        }
    }

    return (
        <>
            {
                renderNavbar()
            }

            <div>
                <Routes>
                    {
                        MainTree.map((route, index) => (
                            <Route key={index} path={route.path}
                                element={route.element} />
                        ))
                    }
                </Routes>
            </div>
        </>
    )

}

export default MainLayout