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
import ParticipantHomePage from './pages/participant/ParticipantHomePage'
import CoordinatorHome from './pages/coordinator/CoordinatorHome'
import ManageEvents from './pages/coordinator/ManageEvents'
import CoordinatorNotifications from './pages/coordinator/Notifications'
import CoordinatorCalendar from './pages/coordinator/Calendar'
import ParticipateEvents from './pages/coordinator/ParticipateEvents'
import ManageFeedback from './pages/director/ManageFeedback'
import ManageUsers from './pages/director/ManageUsers'
import ManageReports from './pages/director/ManageReports'
import Calendar from './pages/director/Calendar'
import Notifications from './pages/director/Notifications'
import StaffLayout from './components/staff/StaffLayout'
import Dashboard from './pages/staff/Dashboard'
import EventsManagement from './pages/staff/EventsManagement'
import VolunteersManagement from './pages/staff/VolunteersManagement'
import ProgramsManagement from './pages/staff/ProgramsManagement'
import NotificationsManagement from './pages/staff/NotificationsManagement'
import Settings from './pages/staff/Settings'
import CertificateManagement from './pages/staff/CertificateManagement'
import CertificateEditor from './pages/staff/CertificateEditor'
import StudentVerifyAccountPage from './components/modal/VerifyCode'
import ProtectedStudent from './utils/ProtectedStudent'
import StaffRequestToken from './utils/StaffRequestToken'
import DirectorLogin from './pages/director/DirectorLogin'
import DirectorLayout from './components/director/DirectorLayout'
import CoordinatorLayout from './components/coordinator/CoordinatorLayout'
import ProtectedDirector from './utils/ProtectedDirector'
import DirectorDashboard from './pages/director/DirectorDashboard'

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
        path: '/verify-account',
        element: <StudentVerifyAccountPage />
    },
    {
        path: '/staff-request',
        element: <RequestPosition/>
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
        element: <ProtectedStudent>
            <ParticipantHomePage/>
        </ProtectedStudent>,
        navbar: 'user'
    },

    // Coordinator Routes
    {
        path: '/coordinator/*',
        element: <CoordinatorLayout />,
        navbar: 'coordinator',
        children: [
            {
                path: 'home',
                element: <CoordinatorHome />
            },
            {
                path: 'profile',
                element: <div>Coordinator Profile Page</div>
            },
            {
                path: 'events',
                element: <ManageEvents />
            },
            {
                path: 'notifications',
                element: <CoordinatorNotifications />
            },
            {
                path: 'calendar',
                element: <CoordinatorCalendar />
            },
            {
                path: 'participate',
                element: <ParticipateEvents />
            },
            {
                path: 'accomplishments',
                element: <div>Accomplishments Page</div>
            },
            {
                path: 'certificates',
                element: <div>Certificates Page</div>
            },
            {
                path: 'history',
                element: <div>History Page</div>
            }
        ]
    },

    // Director RoutesW
    {
        path: '/one secret/login',
        element: <DirectorLogin/>
    },

    {
        path: '/director/*',
        element: <ProtectedDirector>
            <DirectorLayout />
        </ProtectedDirector>,
        navbar: 'director',
        children: [
            {
                path: 'dashboard',
                element: <DirectorDashboard />
            },
            {
                path: 'users',
                element: <ManageUsers />
            },
            {
                path: 'reports',
                element: <ManageReports />
            },
            {
                path: 'feedback',
                element: <ManageFeedback />
            },
            {
                path: 'calendar',
                element: <Calendar />
            },
            {
                path: 'notifications',
                element: <Notifications />
            },
            {
                path: 'profile',
                element: <div>Director Profile Page</div>
            },
            {
                path: 'settings',
                element: <div>Settings Page</div>
            }
        ]
    },
    {
        path: '/director/login',
        element: <DirectorLogin />
    },

    {
        path: '/staff/*',
        element: <ProtectedDirector>
            <DirectorLayout/>
        </ProtectedDirector>,
        navbar: 'staff',
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'volunteers',
                element: <VolunteersManagement />
            },
            {
                path: 'events',
                element: <EventsManagement />
            },
            {
                path: 'programs',
                element: <ProgramsManagement />
            },
            {
                path: 'notifications',
                element: <NotificationsManagement />
            },
            {
                path: 'certificates',
                element: <CertificateManagement />
            },
            {
                path: 'certificates/editor',
                element: <CertificateEditor />
            },
            {
                path: 'certificates/editor/:id',
                element: <CertificateEditor />
            },
            {
                path: 'settings',
                element: <Settings />
            },
            {
                path: 'calendar',
                element: <StaffCalendarPage />
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