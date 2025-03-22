import React from 'react'
import Home from './pages/guest/Home'
import Fallback from './pages/fallback'
import Timeline from './pages/guest/Timeline'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'

const MainTree = [
    {
        path: '/',
        element: <Home />,
        navbar: 'guest'
    },
    {
        path: '/Timeline',
        element: <Timeline />,
        navbar: 'guest'
    },
    {
        path: '/Programs',
        element: <Programs />,
        navbar: 'guest'
    },
    {
        path: '/UpComing-Events',
        element: <UpComingEvents />,
        navbar: 'guest'
    },




    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree