<<<<<<< Updated upstream
=======
import React from 'react'
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
import CoordinatorHome from './pages/coordinator/CoordinatorHome'
import ManageEvents from './pages/coordinator/ManageEvents'
import CoordinatorNotifications from './pages/coordinator/Notifications'
import CoordinatorCalendar from './pages/coordinator/Calendar'
import ParticipateEvents from './pages/coordinator/ParticipateEvents'
import DirectorHome from './pages/director/DirectorHome'
import ManageFeedback from './pages/director/ManageFeedback'
import ManageUsers from './pages/director/ManageUsers'
import ManageReports from './pages/director/ManageReports'
import Calendar from './pages/director/Calendar'
import Notifications from './pages/director/Notifications'
=======
import StaffLayout from './components/staff/StaffLayout'
import Dashboard from './pages/staff/Dashboard'
import EventsManagement from './pages/staff/EventsManagement'
import VolunteersManagement from './pages/staff/VolunteersManagement'
import ProgramsManagement from './pages/staff/ProgramsManagement'
import NotificationsManagement from './pages/staff/NotificationsManagement'
import Settings from './pages/staff/Settings'
import CertificateManagement from './pages/staff/CertificateManagement'
import CertificateEditor from './pages/staff/CertificateEditor'
>>>>>>> Stashed changes

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

    // Participant Routes
    {
        path: '/participant/home',
        element: <ParticipantHomePage/>,
        navbar: 'user'
    },

<<<<<<< Updated upstream
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
        element: <CoordinatorNotifications />,
        navbar: 'coordinator'
    },
    {
        path: '/coordinator/calendar',
        element: <CoordinatorCalendar />,
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

    // Director Routes
    {
        path: '/director/dashboard',
        element: <DirectorHome />,
        navbar: 'director'
    },
    {
        path: '/director/users',
        element: <ManageUsers />,
        navbar: 'director'
    },
    {
        path: '/director/reports',
        element: <ManageReports />,
        navbar: 'director'
    },
    {
        path: '/director/feedback',
        element: <ManageFeedback />,
        navbar: 'director'
    },
    {
        path: '/director/calendar',
        element: <Calendar />,
        navbar: 'director'
    },
    {
        path: '/director/notifications',
        element: <Notifications />,
        navbar: 'director'
    },
    {
        path: '/director/profile',
        element: <div>Director Profile Page</div>,
        navbar: 'director'
    },
    {
        path: '/director/settings',
        element: <div>Settings Page</div>,
        navbar: 'director'
=======
    // Staff Routes
    {
        path: '/staff/*',
        element: <StaffLayout />,
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
            }
        ]
>>>>>>> Stashed changes
    },

    // fallback is the route is not found
    {
        path: '*',
        element: <Fallback />
    }
]

export default MainTree