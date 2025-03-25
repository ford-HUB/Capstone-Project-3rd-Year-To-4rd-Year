import React from 'react'
import Home from './pages/guest/Home'
import Fallback from './pages/fallback'
import Timeline from './pages/guest/Timeline'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'
import LoginWrapper from './utils/LoginWrapper'
import Registration from './pages/guest/Registration'

const MainTree = [
    {
        path: '/',
        element: <LoginWrapper>
            <Home />
        </LoginWrapper>,
        navbar: 'guest'
    },
    {
        path: '/Timeline',
        element: <LoginWrapper>
            <Timeline />
        </LoginWrapper>,
        navbar: 'guest'
    },
    {
        path: '/Programs',
        element: <LoginWrapper>
            <Programs />
        </LoginWrapper>,
        navbar: 'guest'
    },
    {
        path: '/UpComing-Events',
        element: <LoginWrapper>
            <UpComingEvents />
        </LoginWrapper>,
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