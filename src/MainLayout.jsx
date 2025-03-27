import { useLocation, Routes, Route, matchPath } from "react-router-dom"
import Navbar from "./components/guest/Navbar"
import MainTree from './MainTree'

const MainLayout = () => {
    const location = useLocation()

    const checkRoute = MainTree.find((route) => route.path && matchPath(route.path, location.pathname))
    const renderNavbar = () => {
        switch (checkRoute?.navbar) {
            case 'guest':
                const match = matchPath('/home/guest/:id', location.pathname) ||
                    matchPath('/timeline/guest/:id', location.pathname) ||
                    matchPath('/programs/guest/:id', location.pathname) ||
                    matchPath('/upcomingEvents/guest/:id', location.pathname)

                const id = match?.params?.id
                return <Navbar idRoute={id} /> // this will return navbar for guest visitor
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