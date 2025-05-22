import React from 'react'
import GuestHome from './pages/guest/GuestHome'
import Fallback from './pages/fallback'
import Timeline from './pages/guest/Timeline'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'
import LoginWrapper from './utils/LoginWrapper'
import StudentRegistration from './pages/auth/StudentRegistration'
import ProtectedGuest from './utils/ProtectedGuest'
import RequestPosition from './pages/auth/RequestPosition'
import StaffRegistration from './pages/auth/StaffRegistration'

const MainTree = [
    {
        path: '/',
        element:
            <LoginWrapper>
                <GuestHome />
            </LoginWrapper>,
        navbar: 'guest'
    },
    {
        path: '/home/guest/:id',
        element:
            <ProtectedGuest>
                <GuestHome />
            </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/timeline/guest/:id',
        element:
            <ProtectedGuest>
                <Timeline />
            </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/programs/guest/:id',
        element:
            <ProtectedGuest>
                <Programs />
            </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/upcomingEvents/guest/:id',
        element:
            <ProtectedGuest>
                <UpComingEvents />
            </ProtectedGuest>,
        navbar: 'guest'
    },
    {
        path: '/register-account',
        element: <StudentRegistration />
    },
    {
        path: '/staff-request',
        element: <RequestPosition/>
    },
    {
        path: '/staff-registration',
        element: <StaffRegistration/>
    },




    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree