import React from 'react'
import GuestHome from './pages/guest/GuestHome'
import Fallback from './pages/fallback'
import Accomplishments from './pages/guest/Accomplishments'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'
import LoginWrapper from './utils/LoginWrapper'
import StudentRegistration from './pages/auth/StudentRegistration'
import ProtectedGuest from './utils/ProtectedGuest'
import StaffRegistration from './pages/auth/StaffRegistration'
import ParticipantHomePage from './pages/participant/ParticipantHomePage'
import CoordinatorHome from './pages/coordinator/CoordinatorHome'
import CoordinatorNotifications from './pages/coordinator/Notifications'
import ParticipateEvents from './pages/coordinator/ParticipateEvents'
import ManageUsers from './pages/director/ManageUsers'
import StaffLayout from './layouts/StaffLayout.jsx'
import Dashboard from './pages/staff/Dashboard'
import VolunteersManagement from './pages/staff/VolunteersManagement'
import ProgramsManagement from './pages/staff/ProgramsManagement'
import NotificationsManagement from './pages/staff/NotificationsManagement'
import Settings from './pages/staff/Settings'
import CertificateManagement from './pages/staff/CertificateManagement'
import CertificateEditor from './pages/staff/CertificateEditor'
import StudentVerifyAccountPage from './components/modal/VerifyCode'
import StaffRequestToken from './utils/StaffRequestToken'
import DirectorLogin from './pages/director/DirectorLogin'
import DirectorLayout from './layouts/DirectorLayout.jsx'
import ProtectedDirector from './utils/ProtectedDirector'
import DirectorDashboard from './pages/director/DirectorDashboard'
import CheckInterestWrapper from './utils/CheckInterestWrapper'
import ProtectedStudent from './utils/ProtectedStudent'
import StaffLogin from './pages/staff/StaffLogin'
import { allowedRole } from './static/allowedRole.js'
import Profile from './pages/director/DirectorProfile.jsx'
import GoogleMap from './pages/director/GoogleMap.jsx'
import ManageEvents from './pages/director/ManageEvents.jsx'
import Calendar from './pages/common/Calendar.jsx'
import StaffProfile from './pages/staff/StaffProfile.jsx'
import RequestAccount from './pages/auth/RequestAccount.jsx'
import SetUpRequestAccount from './pages/auth/SetUpRequestAccount.jsx'

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
        path: '/accomplishments/guest/:id',
        element:
            <ProtectedGuest>
                <Accomplishments />
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
        path: '/verify-account',
        element: <StudentVerifyAccountPage />
    },
    {
        path: '/request-account',
        element: <RequestAccount/>
    },
    {
        path: '/requested-setup-account',
        element: <SetUpRequestAccount/>
    },
    {
        path: '/staff-registration/:token',
        element: <StaffRequestToken>
            <StaffRegistration/>
        </StaffRequestToken>
    },

    // Participant Routes
    {
        path: '/participant/home',
        element: <ProtectedStudent roles={allowedRole}>
            <CheckInterestWrapper>
                <ParticipantHomePage/>
            </CheckInterestWrapper>
        </ProtectedStudent>,
        navbar: 'user'
    },

    // Director Routes
    {
        path: '/one secret/login',
        element: <DirectorLogin/>
    },

    {
        path: '/director/*',
        element: <ProtectedDirector>
            <DirectorLayout />
        </ProtectedDirector>,
        children: [
            {
                path: 'dashboard',
                element: <DirectorDashboard />
            },
            {
                path: 'calendar',
                element: <Calendar/>
            },
            {
                path: 'manage-users',
                element: <ManageUsers />
            },
            {
                path: 'profile',
                element: <Profile/>
            },
            {
                path: 'map',
                element: <GoogleMap/>
            },
            {
                path: 'event-list',
                element: <ManageEvents/>
            }
        ]
    },
    {
        path: '/director/login',
        element: <DirectorLogin />
    },

    {
        path: '/secret staff/login',
        element: <StaffLogin/>

    },

    {
        path: '/staff/*',
        element:
            // <ProtectedStaff roles={allowedRole}>
            // </ProtectedStaff>,
            <StaffLayout/>,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard/>
            },
            {
                path: 'calendar',
                element: <Calendar/>
            },
            {
                path: 'profile',
                element: <StaffProfile />
            },
            {
                path: 'map',
                element: <GoogleMap />
            },
            {
                path: 'event-list',
                element: <ManageEvents />
            }
        ]
    },

    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree