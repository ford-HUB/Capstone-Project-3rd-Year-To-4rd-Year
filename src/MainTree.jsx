import React, { Children } from 'react'
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
import ParticipantHomePage from './pages/participant/ParticipantHomePage'
import CoordinatorHome from './pages/coordinator/CoordinatorHome'
import ManageEvents from './pages/coordinator/ManageEvents'
import Notifications from './pages/coordinator/Notifications'
import Calendar from './pages/coordinator/Calendar'
import ParticipateEvents from './pages/coordinator/ParticipateEvents'

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



    // Participant ROutes
    {
        path: '/participant/home',
        element: <ParticipantHomePage/>,
        navbar: 'user'
    },



    // Coordinator Routes
    {
        path: '/coordinator/home',
        element: <CoordinatorHome />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/profile',
        element: <div>Coordinator Profile Page</div>,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/events',
        element: <ManageEvents />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/notifications',
        element: <Notifications />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/calendar',
        element: <Calendar />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/participate',
        element: <ParticipateEvents />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/accomplishments',
        element: <div>Accomplishments Page</div>,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/certificates',
        element: <div>Certificates Page</div>,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/history',
        element: <div>History Page</div>,
        navbar: 'coordinator'
    },



    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree