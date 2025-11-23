import React from 'react';
import {
    LayoutDashboard,
    LogOut,
    Heart,
    UserRound,
    ChevronRight,
    Globe,
    CreditCard,
    Package,
    History,
    Settings,
    Inbox
} from 'lucide-react';
import Logout from '../../Logout.jsx';
import { NavLink } from 'react-router-dom';
import { useDonorAuthStore } from '../../../../store/donor/useDonorAuthStore.js';
import { useIsOAuthAccount } from '../../../../store/donor/useDonorProfileStore.js';
import { useNavigate } from 'react-router-dom';
import DonorProfileUpdateModal from './DonorProfileUpdateModal.jsx';

const DonorProfileSlider = ({ open, setOpen, userData }) => {
    const navigate = useNavigate();
    const { logout } = useDonorAuthStore();
    const isOAuthAccount = useIsOAuthAccount();
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const [profileModalTab, setProfileModalTab] = React.useState('profile');
    const sliderRef = React.useRef(null);

    const handleLogoutConfirm = async () => {
        const success = await logout();
        if (!success) return;
        setShowLogoutModal(false);
        navigate('/');
    };

    // Handle click outside to close slider
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (sliderRef.current && !sliderRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen]);

    return (
        <>
            <div
                onClick={setOpen}
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-100 transition-opacity ${
                    open
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            <aside
                ref={sliderRef}
                className={`fixed right-0 z-100 top-0 h-screen w-[460px] max-w-[90vw] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-hidden={!open}>
                <div className="relative p-6 bg-gradient-to-b from-purple-100 to-white z-[999]">
                    <div className="absolute backdrop-blur-[2px] z-[999] bg-white/20 left-5 -bottom-6 flex items-center gap-6 w-full">
                        <div className="relative">
                            <div className="avatar w-12 h-12 rounded-full bg-purple-300 border-4 border-white">
                                <img
                                    className="ring-purple-300 ring-offset-base-100 w-24 rounded-full ring-1 ring-offset-3"
                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center text-xl font-regular text-gray-900">
                            <div>
                                {(userData?.fullname ? (userData.fullname.toUpperCase().slice(0, 15) + '...') : 'PROFILE')}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="cursor-pointer ml-12 px-3 py-2 text-xs bg-purple-600 text-white rounded-full">
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
                            navigate('/donor/dashboard')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>Browse Campaigns</span>
                            <ChevronRight className="h-6 w-6 text-purple-600" />
                        </button>
                        <div className="mt-4 border-t border-gray-200" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-md mb-2">
                            <Heart className="h-6 w-6" />
                            <span>Donations</span>
                        </div>
                        <button onClick={() => {
                            navigate('/donor/my-donations')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>My Donations</span>
                            <ChevronRight className="h-6 w-6 text-purple-600" />
                        </button>
                        <button onClick={() => {
                            navigate('/donor/history')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>Donation History</span>
                            <ChevronRight className="h-6 w-6 text-purple-600" />
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
                                tab: 'profile'
                            },
                            // Only show Change Password for non-OAuth accounts
                            ...(isOAuthAccount ? [] : [{
                                name: 'Change Password',
                                tab: 'password'
                            }]),
                        ].map((item, _i) => (
                            <button
                                onClick={() => {
                                    setProfileModalTab(item.tab);
                                    setShowProfileModal(true);
                                    setOpen(false);
                                }}
                                key={_i}
                                className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                                <span>{item.name}</span>
                                <ChevronRight className="h-6 w-6 text-purple-600" />
                            </button>
                        ))}
                        <div className="mt-4 border-t border-gray-200" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-md mb-2">
                            <Inbox className="h-5 w-5" />
                            <span>Activity</span>
                        </div>
                        <button onClick={() => {
                            navigate('/donor/my-activity-logs')
                            setOpen(false)
                        }}
                        className="w-full flex items-center justify-between text-sm text-gray-700 py-2 px-2 rounded hover:bg-gray-50">
                            <span>My Activity Log</span>
                            <ChevronRight className="h-6 w-6 text-purple-600" />
                        </button>
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

            {/* Profile Update Modal */}
            <DonorProfileUpdateModal
                isOpen={showProfileModal}
                setOpen={setShowProfileModal}
                userData={userData}
                initialTab={profileModalTab}
            />

        </>
    );
};

export default DonorProfileSlider;
