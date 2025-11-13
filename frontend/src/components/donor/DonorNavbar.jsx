import React from 'react'
import { Heart, History, Grid } from 'lucide-react'
import { asset } from '../../assets/asset.jsx'
import { NavLink } from 'react-router-dom'
import { useDonorAuthStore } from '../../store/donor/useDonorAuthStore.js'
import { useDonorProfileStore } from '../../store/donor/useDonorProfileStore.js'
import DonorProfileSlider from '../modal/v2/donor/DonorProfileSlider.jsx'

const DonorNavbar = () => {
    const { authenticatedUser } = useDonorAuthStore();
    const { profile, fetchProfile } = useDonorProfileStore();
    const [isProfileSliderOpen, setIsProfileSliderOpen] = React.useState(false);
    
    // Fetch profile when component mounts
    React.useEffect(() => {
        if (authenticatedUser && !profile) {
            fetchProfile();
        }
    }, [authenticatedUser, profile, fetchProfile]);
    
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <NavLink to={`/donor/dashboard`} className="w-10 h-10 flex items-center justify-center">
                            <img src={asset.transparentLogo} alt=""/>
                        </NavLink>
                        <div>
                            <div className="text-sm font-semibold text-gray-600">UCLM CARES</div>
                            <div className="text-xs text-gray-600">Donation Campaigns</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/donor/dashboard' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded flex items-center gap-2
                            ${isActive ? 'border-b-3 rounded-b-none border-purple-600 text-purple-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-purple-600 hover:text-purple-600 transition duration-600'}`
                        }}>
                            <Grid className="w-3 h-3" />
                            Browse Campaigns
                        </NavLink>
                    </div>


                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/donor/my-donations' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded flex items-center gap-2
                            ${isActive ? 'border-b-3 rounded-b-none border-purple-600 text-purple-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-purple-600 hover:text-purple-600 transition duration-600'}`
                        }}>
                            <Heart className="w-4 h-4" />
                            My Donations
                        </NavLink>
                    </div>

                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/donor/history' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded flex items-center gap-2
                            ${isActive ? 'border-b-3 rounded-b-none border-purple-600 text-purple-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-purple-600 hover:text-purple-600 transition duration-600'}`
                        }}>
                            <History className="w-4 h-4" />
                            Donation History
                        </NavLink>
                    </div>
                     <button 
                         onClick={() => setIsProfileSliderOpen(true)}
                         className="flex cursor-pointer items-center space-x-3 border-l border-gray-300 pl-4 pr-6 transition-colors">
                         <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                             {profile?.fullname?.charAt(0)?.toUpperCase() || authenticatedUser?.email?.charAt(0)?.toUpperCase() || ''}
                         </div>
                         <div className="text-sm text-start">
                             <div className="font-semibold">{profile?.fullname || authenticatedUser?.email?.slice(0, 10).toUpperCase() + '...' || 'Donor'}</div>
                             <div className="text-xs text-gray-500">Donor</div>
                         </div>
                     </button>
                </div>
            </div>
            
            <DonorProfileSlider 
                open={isProfileSliderOpen}
                setOpen={setIsProfileSliderOpen}
                userData={profile || authenticatedUser}
            />
        </header>
    )
}

export default DonorNavbar
