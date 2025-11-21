import React from 'react';
import {
    LayoutDashboard,
    LogOut,
    Newspaper,
    UserRound,
    ChevronRight,
    Globe,
} from 'lucide-react';
import Logout from '../../Logout.jsx';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../../store/participant/useAuthStore.js';
import { useNavigate } from 'react-router-dom';

const ParticipantProfileSlider = ({ open, setOpen, userData }) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleLogoutConfirm = async () => {
        const success = await logout();
        if (!success) return;
        setShowLogoutModal(false);
        navigate('/');
    };
    return (
        <>
            <div
                onClick={setOpen}
                className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] z-100 transition-opacity ${
                    open
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            <aside
                className={`fixed right-0 z-100 top-0 h-screen w-[460px] max-w-[90vw] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-hidden={!open}>
                <div className="relative p-6 bg-gradient-to-b from-gray-100 to-white">
                    <div className="absolute left-5 -bottom-6 flex items-center gap-6 w-full">
                        <div className="avatar w-12 h-12 rounded-full bg-gray-300 border-4 border-white">
                            <img
                                className="ring-gray-300 ring-offset-base-100 w-24 rounded-full ring-1 ring-offset-3"
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            />
                        </div>

                        <div className="flex flex-col justify-center text-xl font-regular text-gray-900">
                            <div>
                                {userData?.CampusUser?.firstname?.toUpperCase() || ''}
                            </div>
                            <div>
                                {userData?.CampusUser?.lastname?.toUpperCase() || ''}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="cursor-pointer ml-12 px-3 py-2 text-xs bg-blue-600 text-white rounded-full">
                            <LogOut className="inline-block w-4 h-4 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="pt-16 px-5 pb-6 overflow-y-auto h-[calc(100vh-7rem)]">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-md mb-2">
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </div>
                        <button onClick={() => {
                            navigate('/participant/dashboard')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>My Interested Events</span>
                            <ChevronRight className="h-6 w-6 text-green-600" />
                        </button>
                        <div className="mt-4 border-t border-gray-200" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-md mb-2">
                            <Newspaper className="h-6 w-6" />
                            <span>Guide</span>
                        </div>
                        <button onClick={() => {
                            navigate('/participant/volunteer-guide')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>For Volunteers</span>
                            <ChevronRight className="h-6 w-6 text-green-600" />
                        </button>
                        <div className="mt-4 border-t border-gray-200" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-md mb-2">
                            <UserRound className="h-5 w-5" />
                            <span>Profile</span>
                        </div>
                        {[
                            {
                                name: 'Update Profile',
                                path: '/participant/profile',
                            },
                            {
                                name: 'Change Password',
                                path: '/participant/profile?tab=change-password',
                            },
                            {
                                name: 'Certificates',
                                path: '/participant/profile?tab=certificates',
                            },
                            {
                                name: 'Participation History',
                                path: '/participant/participation-history',
                            },
                            {
                                name: 'My Activity Logs',
                                path: '/participant/my-activity-logd'
                            }
                        ].map((item, _i) => (
                            <NavLink
                                to={item.path}
                                onClickCapture={() => setOpen(false)}
                                key={_i}
                                className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                                <span>{item.name}</span>
                                <ChevronRight className="h-6 w-6 text-green-600" />
                            </NavLink>
                        ))}
                        <div className="mt-4 border-t border-gray-200" />
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-2">
                            <Globe className="h-5 w-5" />
                            <span>Language</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded">
                            <span>English (English)</span>
                        </div>
                    </div>
                </div>
            </aside>

            <Logout
                onOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
};

export default ParticipantProfileSlider;
