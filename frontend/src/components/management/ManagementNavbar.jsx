import React from 'react';
import {
    Bell,
    Search,
    Moon,
    ChevronDown,
    AlignLeft,
    CircleUser,
    Settings,
    LogOut,
    AlignRight,
    ScanText,
    Trophy
} from 'lucide-react';
import LogoutModal from '../modal/Logout.jsx';
import { useNavigate, NavLink } from 'react-router-dom';
import AccountSettings from '../modal/AccountSetting.jsx';
import { useAuthStore } from '../../store/management/useAuthStore.js';
import { useProfileStore } from '../../store/management/useProfileStore.js';
import EditManagementInformationModal from '../modal/EditManagementInformationModal.jsx';
import { GetFirstLetter } from '../../utils/GetFirstLetter.js';
import NotificationToggle from '../modal/NotificationToggle.jsx';
import { useNotifStore } from '../../store/notification/useNotifStore.js';

const ManagementNavbar = ({ collapseSidebar, mobileCollapseSidebar }) => {
    const { authenticatedManagement, logout } = useAuthStore();
    const {
        currentProfile,
        managementCurrentProfile,
        insertOrUpdateProfileInfo,
    } = useProfileStore();

    const { unreadCount, initializeNotificationCount } = useNotifStore()
    const navigate = useNavigate();
    const headerRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const [showEditManagementInfoModal, setShowManagementInfoModal] =
        React.useState(false);
    const [showNotificationToggle, setShowNotificationToggle] =
        React.useState(false);
    const [showAccountSettingsModal, setShowAccountSettingsModal] =
        React.useState(false);
    const [isToggle, setToggle] = React.useState(false);

    React.useEffect(() => {
        let ignore = false;

        const checkInfo = async () => {
            if (managementCurrentProfile?.length > 0) return;
            try {
                await currentProfile();
            } catch (error) {
                if (!ignore) {
                    console.error('Fetch error:', error);
                }
            }
        };

        checkInfo();

        return () => {
            ignore = true;
        };
    }, [managementCurrentProfile?.length, currentProfile]);

    // Initialize notification count when component mounts
    React.useEffect(() => {
        const initNotifications = async () => {
            try {
                // Pass the management role to initialize notification count
                // Management users should not see event approval notifications
                const userRole = authenticatedManagement?.Role?.name;
                await initializeNotificationCount(userRole);
            } catch (error) {
                console.error("Failed to initialize notification count:", error);
            }
        };
        
        initNotifications();
    }, [initializeNotificationCount, authenticatedManagement?.Role?.name]);

    const handleClickOutside = (event) => {
        if (
            !headerRef.current?.contains(event.target) &&
            !dropdownRef.current?.contains(event.target)
        ) {
            setToggle(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditManagementInfoComplete = async (formData) => {
        const success = await insertOrUpdateProfileInfo(formData);
        if (!success) return;
        setShowManagementInfoModal(false);
    };

    const handleLogout = async () => {
        const success = await logout();
        if (!success) return;
        setTimeout(() => {
            navigate('/');
        });
    };

    return (
        <div className="relative">
            <header
                ref={headerRef}
                className="bg-white shadow-sm border-b border-b-gray-300 px-6 py-4 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={collapseSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 hidden sm:block">
                            <AlignLeft
                                size={38}
                                className="border border-gray-300 p-2 rounded-xl hover:bg-white hover:outline-none"
                            />
                        </button>

                        <button
                            onClick={mobileCollapseSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 block sm:hidden">
                            <AlignRight
                                size={38}
                                className="border border-gray-300 p-2 rounded-xl hover:bg-white hover:outline-none"
                            />
                        </button>
                        <Search className="relative left-10 top-2.5 transform -translate-y-1/2 w-10 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search or type command..."
                            className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:w-md focus:ring-blue-500 hover:w-md transition-all ease-in-out duration-300 hover:ring-blue-500"
                        />
                        <span className="relative right-10 rounded-md border border-gray-300 cursor-pointer p-1 top-3 transform -translate-y-1/2 text-xs text-gray-400">
                            ⌘K
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 mr-3">
                        <NavLink to={'/management/QrCode-Scanner'} end className={({ isActive }) => {
                            return `p-2 rounded-lg 
                            ${isActive ? ` bg-gray-100`: `hover:bg-gray-100`}`
                        }}>
                            <ScanText className="w-6 h-6 text-gray-500" />
                        </NavLink>
                        <NavLink to={'/management/certificate'} end className={({ isActive }) => {
                            return `p-2 rounded-lg 
                            ${isActive ? ` bg-gray-100`: `hover:bg-gray-100`}`
                        }}>
                            <Trophy className="w-6 h-6 text-gray-500" />
                        </NavLink>
                        <button
                            onClick={() =>
                                setShowNotificationToggle(
                                    !showNotificationToggle
                                )
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 relative">
                            <Bell className="w-6 h-6 text-gray-500" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-semibold rounded-full px-1 ">
                                    {unreadCount}
                                </span>
                            ) }
                        </button>
                        <button
                            onClick={() => setToggle(!isToggle)}
                            className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center">
                                {managementCurrentProfile.profile_image ? (
                                    <img
                                        className="rounded-full h-11 w-11"
                                        src={
                                            managementCurrentProfile.profile_image
                                        }
                                        alt="profile"
                                    />
                                ) : (
                                    <span className="text-white text-xl font-medium">
                                        {GetFirstLetter(
                                            managementCurrentProfile?.firstname
                                        ) || ''}
                                    </span>
                                )}
                            </div>
                            <span className="font-medium">
                                {managementCurrentProfile?.firstname}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 ${
                                    isToggle ? `rotate-180` : ``
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </header>

            {isToggle && (
                <div
                    ref={dropdownRef}
                    className="absolute top-22 right-6 pl-4 py-2 space-y-3 dropdown menu w-64 rounded-box bg-base-100 shadow-sm border border-gray-200 transition ease-in-out z-50"
                    onClick={(e) => e.stopPropagation()}>
                    <span className="font-semibold text-[16px] pl-2">{`${
                        managementCurrentProfile?.firstname || ''
                    } ${managementCurrentProfile?.lastname || ''}`}</span>
                    <p className="text-[12px] text-gray-500 pl-2">{`${
                        authenticatedManagement.email || ''
                    }`}</p>

                    <div className="actionButton border-b-1 border-b-gray-300 pb-3">
                        <button
                            onClick={() => setShowManagementInfoModal(true)}
                            className="flex items-center space-x-2 rounded-md hover:bg-gray-50 py-1 pl-2 pr-28">
                            <CircleUser className="h-6 w-6 text-gray-600" />
                            <span className="mt-0.5 text-[14px]">
                                Edit Profile
                            </span>
                        </button>

                        <button
                            onClick={() => setShowAccountSettingsModal(true)}
                            className="flex items-center space-x-2 rounded-md hover:bg-gray-50 py-1 pl-2 pr-18">
                            <Settings className="h-6 w-6 text-gray-600" />
                            <span className="mt-0.5 text-[14px]">
                                Account Settings
                            </span>
                        </button>
                    </div>

                    <div className="mt-2">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center space-x-2 rounded-md hover:bg-gray-50 py-1 pl-2 pr-34">
                            <LogOut className="h-6 w-6 text-gray-600" />
                            <span className="mt-0.5 text-[14px]">Sign out</span>
                        </button>
                    </div>
                </div>
            )}

            <NotificationToggle
                isOpen={showNotificationToggle}
                setOpen={setShowNotificationToggle}
            />

            <LogoutModal
                onOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            <EditManagementInformationModal
                open={showEditManagementInfoModal}
                setOpen={setShowManagementInfoModal}
                currentInfo={managementCurrentProfile}
                mode={'edit'}
                onComplete={handleEditManagementInfoComplete}
            />

            <AccountSettings
                open={showAccountSettingsModal}
                setOpen={setShowAccountSettingsModal}
                role={authenticatedManagement.Role.name}
            />
        </div>
    );
};

export default ManagementNavbar;
