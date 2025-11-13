import React from 'react'
import GuestHome from './pages/guest/GuestHome'
import NotFound from './pages/NotFound.jsx'
import DonationSuccess from './pages/donor/DonationSuccess'
import DonationCancelled from './pages/donor/DonationCancelled'
import Accomplishments from './pages/guest/Accomplishments'
import Programs from './pages/guest/Programs'
import UpComingEvents from './pages/guest/UpComingEvents'
import LoginWrapper from './utils/LoginWrapper'
import StudentRegistration from './pages/auth/StudentRegistration'
import UpdateRegistrationUI from './pages/auth/UpdateRegistrationUI'
import ProtectedGuest from './utils/ProtectedGuest'
import CoordinatorHome from './pages/coordinator/CoordinatorHome'
import ParticipateEvents from './pages/coordinator/ParticipateEvents'
import ManagementDashboard from './pages/management/ManagementDashboard.jsx'
import ManageUsers from './pages/director/ManageUsers'
import SystemPerformance from './pages/director/SystemPerformance'
import BeneficiaryRequest from './pages/director/BeneficiaryRequest'
import BeneficiaryList from './pages/director/BeneficiaryList'
import ManagementLayout from './layouts/ManagementLayout.jsx'   
import StudentVerifyAccountPage from './components/modal/VerifyCode'
import RequestToken from './utils/RequestToken'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DirectorLogin from './pages/director/DirectorLogin'
import DirectorLayout from './layouts/DirectorLayout.jsx'
import ProtectedDirector from './utils/ProtectedDirector'
import DirectorDashboard from './pages/director/DirectorDashboard'
import CheckInterestWrapper from './utils/CheckInterestWrapper'
import ProtectedStudent from './utils/ProtectedStudent'
import ProtectedBeneficiary from './utils/ProtectedBeneficiary'
import ProtectedDonor from './utils/ProtectedDonor'
import ManagementLogin from './pages/management/ManagementLogin.jsx'
import Profile from './pages/director/DirectorProfile.jsx'
import PaymentStatus from './pages/director/PaymentStatus.jsx'
import GoogleMap from './pages/director/GoogleMap.jsx'
import ManageEvents from './pages/common/ManageEvents.jsx'
import Calendar from './pages/common/Calendar.jsx'
import ManagementProfile from './pages/management/ManagementProfile.jsx'
import RequestAccount from './pages/auth/RequestAccount.jsx'
import SetUpRequestAccount from './pages/auth/SetUpRequestAccount.jsx'
import ProtectedManagement from './utils/ProtectedManagement.jsx'
import VolunterProfile from './pages/common/VolunteerProfile.jsx'
import DocumentUpload from './pages/common/DocumentUpload.jsx'
import ParticipantHomePage from './pages/participant/v2/ParticpantHomePage.jsx'
import ManageFiles from './pages/common/ManageFiles.jsx'
import ParticipantLayout from './layouts/ParticpantLayout.jsx'
import ParticipantProfile from './pages/participant/v2/ParticpantProfile.jsx'
import DetailedParticipationHistory from './pages/participant/v2/DetailedParticipationHistory.jsx'
import VerificationCode from './pages/auth/v2/VerificationCode.jsx'
import RegisteredEventList from './pages/participant/v2/RegisteredEventList.jsx'
import LearningPreview from './pages/participant/v2/LearningPreview.jsx'
import AttendanceSuccessPage from './pages/participant/v2/AttendanceSuccess.jsx'
import QRChecker from './utils/QRChecker.jsx'
import AttendanceFailed from './pages/participant/v2/AttendanceFailed.jsx'
import QRScanner from './pages/participant/v2/QrScanner.jsx'
import TemplatePage from './pages/director/TemplatePage.jsx'
import DeployedCertificateTemplates from './pages/director/DeployedCertificateTemplates.jsx'
import AttendanceLog from './pages/common/AttendanceLog.jsx'
import CertificatePage from './pages/common/CertificatePage.jsx'
import CertificateViewer from './pages/common/CertificateViewer.jsx'
import EventFeedbackEvaluation from './pages/participant/v2/EventFeedbackEvaluation.jsx'
import FormBuilderPage from './pages/common/FormBuilderPage.jsx'
import Forms from './pages/common/Forms.jsx'
import CreateFormLinkPage from './pages/common/CreateFormLinkPage.jsx'
import GoogleFormListPage from './pages/common/GoogleFormListPage.jsx'
import FormResponsesPage from './pages/common/FormResponsesPage.jsx'
import PostRequirements from './pages/director/PostRequirements.jsx'
import ManageDocuments from './pages/director/ManageDocuments.jsx'
import BeneficiaryHomePage from './pages/beneficiary/v2/BeneficiaryHomePage.jsx'
import BeneficiaryProfile from './pages/beneficiary/v2/BeneficiaryProfile.jsx'
import MyRegistrations from './pages/beneficiary/v2/MyRegistrations.jsx'
import AttendanceScanner from './pages/beneficiary/v2/AttendanceScanner.jsx'
import BeneficiaryLayout from './layouts/BeneficiaryLayout.jsx'
import DonorLayout from './layouts/DonorLayout.jsx'
import DonorHomePage from './pages/donor/DonorHomePage.jsx'
import DonationPage from './pages/donor/DonationPage.jsx'
import GoodsDonationPage from './pages/donor/GoodsDonationPage.jsx'
import RequestApprovalDocument from './pages/common/RequestApprovalDocument.jsx'
import MyDocumentRequests from './pages/common/MyDocumentRequests.jsx'
import VolunteerGuide from './pages/participant/v2/VolunteerGuide.jsx'
import MyDonations from './pages/donor/MyDonations.jsx'
import DonationHistory from './pages/donor/DonationHistory.jsx'
import PaymentMethods from './pages/donor/PaymentMethods.jsx'
import ReceiptsInvoices from './pages/donor/ReceiptsInvoices.jsx'
import DonorLoginPage from './pages/auth/DonorLoginPage.jsx'
import DonorRegistration from './pages/auth/DonorRegistration.jsx'
import OAuthSuccess from './pages/donor/OAuthSuccess.jsx'
import EventDonations from './pages/common/EventDonations.jsx'
import InternalDonationTracking from './pages/common/InternalDonationTracking.jsx'
import DirectorStatistics from './pages/common/DirectorStatistics.jsx'
import OverviewPage from './pages/common/OverviewPage.jsx'


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
        path: '/register-volunteer',
        element: <UpdateRegistrationUI/>
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
        element: <RequestToken>
            <SetUpRequestAccount/>
        </RequestToken>
    },
    {
        path: '/verification_code',
        element: <VerificationCode />
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />
    },
    {
        path: '/donation-success',
        element: <DonationSuccess />
    },
    {
        path: '/donation-cancelled',
        element: <DonationCancelled />
    },

    // Donor Auth Routes
    {
        path: '/donor/login',
        element: <DonorLoginPage />
    },
    {
        path: '/donor/signup',
        element: <DonorRegistration />
    },
    {
        path: '/donor/oauth-success',
        element: <OAuthSuccess />
    },
  
    // Participant Routes
    {
        path: '/participant/home',
        element: <ProtectedStudent roles={'student'}>
            <CheckInterestWrapper>
                <ParticipantHomePage/>
            </CheckInterestWrapper>
        </ProtectedStudent>
    },

    {
        path: '/participant/*',
        element: <ProtectedStudent roles={'student'}>
            <CheckInterestWrapper>
                <ParticipantLayout/>
            </CheckInterestWrapper>
        </ProtectedStudent>,
        children: [
            {
                path: 'dashboard',
                element: <ParticipantHomePage />
            },
            {
                path: 'volunteer-guide',
                element: <VolunteerGuide/>
            },
            {
                path: 'profile',
                element: <ParticipantProfile/>
            },
            {
                path: 'participation-history',
                element: <DetailedParticipationHistory />
            },
            {
                path: 'registered-events',
                element: <RegisteredEventList />
            },
            {
                path: 'QrCode-Scanner',
                element: <QRScanner />
            },
            {
                path: 'certificate-viewer',
                element: <CertificateViewer />
            }
        ]
    },
    {
        path: 'event-feedback-evaluation',
        element: <EventFeedbackEvaluation />
    },

    // Beneficiary Routes
    {
        path: '/beneficiary/*',
        element: <ProtectedBeneficiary roles={'beneficiary'}>
            <BeneficiaryLayout/>
        </ProtectedBeneficiary>,
        children: [
            {
                path: 'dashboard',
                element: <BeneficiaryHomePage/>
            },
            {
                path: 'profile',
                element: <BeneficiaryProfile/>
            },
            {
                path: 'my-registrations',
                element: <MyRegistrations/>
            },
            {
                path: 'attendance-scanner',
                element: <AttendanceScanner/>
            }
        ]
    },

    // Donor Routes
    {
        path: '/donor/*', 
        element: <ProtectedDonor roles={['donor']}>
            <DonorLayout/>
        </ProtectedDonor>,
        children: [
            {
                path: 'dashboard',
                element: <DonorHomePage/>
            },
            {
                path: 'donate',
                element: <DonationPage/>
            },
            {
                path: 'goods-donation',
                element: <GoodsDonationPage/>
            },
            {
                path: 'my-donations',
                element: <MyDonations />
            },
            {
                path: 'history',
                element: <DonationHistory />
            },
            {
                path: 'payment-methods',
                element: <PaymentMethods />
            },
            {
                path: 'receipts',
                element: <ReceiptsInvoices />
            },
        ]
    },

    // Director Routes
    {
        path: '/one-secret/login',
        element: <DirectorLogin/>
    },

    {
        path: '/director/*',
        element: <ProtectedDirector>
            <DirectorLayout />
        </ProtectedDirector>,
        children: [
            {
                path: 'overview',
                element: <OverviewPage />
            },
            {
                path: 'statistics',
                element: <DirectorStatistics />
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
                path: 'system-performance',
                element: <SystemPerformance />
            },
            {
                path: 'profile',
                element: <Profile/>
            },
            {
                path: 'payment-status',
                element: <PaymentStatus/>
            },
            {
                path: 'map',
                element: <GoogleMap/>
            },
            {
                path: 'event-list',
                element: <ManageEvents/>
            },
            {
                path: 'volunteer-profile',
                element: <VolunterProfile/>
            },
            {
                path: 'upload-document',
                element: <DocumentUpload />
            },
            {
                path: 'manage-files',
                element: <ManageFiles />
            },
            {
                path: 'templates-list',
                element: <TemplatePage />
            },
            {
                path: 'deployed-certificate-templates',
                element: <DeployedCertificateTemplates />
            },
            {
                path: 'QrCode-Scanner',
                element: <QRScanner />
            },
            {
                path: 'attendance-log',
                element: <AttendanceLog/>

            },
            {
                path: 'certificate',
                element: <CertificatePage />
            },
            {
                path: 'certificate-viewer',
                element: <CertificateViewer />
            },
            {
                path: 'form-builder',
                element: <FormBuilderPage />
            },
            {
                path: 'form-list',
                element: <Forms />
            },
            {
                path: 'upload-form',
                element: <CreateFormLinkPage />
            },
            {
                path: 'google-form-list',
                element: <GoogleFormListPage />
            },
            {
                path: 'form-responses',
                element: <FormResponsesPage />
            },
            {
                path: 'post-requirements',
                element: <PostRequirements />
            },
            {
                path: 'submitted-documents',
                element: <ManageDocuments />
            },
            {
                path: 'beneficiary-request',
                element: <BeneficiaryRequest />
            },
            {
                path: 'beneficiary-list',
                element: <BeneficiaryList />
            },
            {
                path: 'request-approval-document',
                element: <RequestApprovalDocument />
            },
            {
                path: 'event-donations',
                element: <EventDonations />
            },
            {
                path: 'internal-donation-tracking',
                element: <InternalDonationTracking />
            },

        ]
    },
    {
        path: '/director/login',
        element: <DirectorLogin />
    },

    {
        path: '/secret staff/login',
        element: <ManagementLogin/>

    },

    {
        path: '/management/*',
        element:
            <ProtectedManagement roles={['staff', 'coordinator', 'assistant_coordinator']}>
                <ManagementLayout/>
            </ProtectedManagement>,
        children: [
            {
                path: 'dashboard',
                element: <ManagementDashboard/>
            },
            {
                path: 'calendar',
                element: <Calendar/>
            },
            {
                path: 'profile',
                element: <ManagementProfile />
            },
            {
                path: 'map',
                element: <GoogleMap />
            },
            {
                path: 'event-list',
                element: <ManageEvents />
            },
            {
                path: 'volunteer-profile',
                element: <VolunterProfile/>
            },
            {
                path: 'upload-document',
                element: <DocumentUpload />
            },
            {
                path: 'manage-files',
                element: <ManageFiles />
            },
            {
                path: 'my-document-requests',
                element: <MyDocumentRequests />
            },
            {
                path: 'QrCode-Scanner',
                element: <QRScanner />
            },
            {
                path: 'certificate',
                element: <CertificatePage/>
            },
            {
                path: 'certificate-viewer',
                element: <CertificateViewer />
            },
            {
                path: 'attendance-log',
                element: <AttendanceLog/>

            },
            {
                path: 'form-builder',
                element: <FormBuilderPage />
            },
            {
                path: 'form-list',
                element: <Forms />
            },
            {
                path: 'upload-form',
                element: <CreateFormLinkPage />
            },
            {
                path: 'google-form-list',
                element: <GoogleFormListPage />
            },
            {
                path: 'submitted-documents',
                element: <ManageDocuments />
            },
            {
                path: 'overview',
                element: <OverviewPage />
            }
        ]
    },

    // fallback is the route is not found
    {
        path: '*',
        element: <NotFound />
    }
]

export default MainTree