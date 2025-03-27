import React from 'react'
import Home from './pages/guest/Home'
import Fallback from './pages/fallback'
import Timeline from './pages/guest/Timeline'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'
import LoginWrapper from './utils/LoginWrapper'
import Registration from './pages/guest/Registration'
import ProtectedGuest from './utils/ProtectedGuest'

const MainTree = [
    {
        path: '/',
        element: <LoginWrapper>
            <Home />
        </LoginWrapper>,
        navbar: 'guest'
    },
    {
        path: '/home/guest/:id',
        element: <ProtectedGuest>
            <Home />
        </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/timeline/guest/:id',
        element: <ProtectedGuest>
            <Timeline />
        </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/programs/guest/:id',
        element: <ProtectedGuest>
            <Programs />
        </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/upcomingEvents/guest/:id',
        element: <ProtectedGuest>
            <UpComingEvents />
        </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/registrationForm',
        element: <Registration />
    },




    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree