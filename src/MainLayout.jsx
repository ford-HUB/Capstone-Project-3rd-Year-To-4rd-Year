import { useLocation, Routes, Route } from "react-router-dom"
import Navbar from "./components/guest/Navbar"
import MainTree from './MainTree'

const MainLayout = () => {
    const location = useLocation()

    const checkRoute = MainTree.find((route) => route.path === location.pathname)
    const renderNavbar = () => {
        switch (checkRoute?.navbar) {
            case 'guest':
                return <Navbar /> // this will return navbar for guest visitor
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