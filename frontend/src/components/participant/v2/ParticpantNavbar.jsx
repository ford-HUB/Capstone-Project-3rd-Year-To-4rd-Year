import React from 'react'
import { Grid, ChevronDown, Search } from 'lucide-react'
import { asset } from '../../../assets/asset.jsx'
import { NavLink } from 'react-router-dom'
import { useProfileStore } from '../../../store/participant/useProfileStore.js'
import { GetFirstLetter } from '../../../utils/GetFirstLetter.js'
import ParticipantProfileSlider from '../../modal/v2/participant/ParticipantProfileSlider.jsx'

const ParticpantNavbar = () => {
    const { currentProfileInfo, getCurrentProfile } = useProfileStore()
    const [showProfileSlider, setShowProfileSlider] = React.useState(false)

    React.useEffect(() => {
        let isMounted = true
        
        const fetchInfo = async () => {
            try {
                await getCurrentProfile()
                console.log(currentProfileInfo)
            } catch(error) {
                if (isMounted) {
                    console.error("Fetch error:", error);
                }
            }
        }
    
        fetchInfo()
    
        return () => {
            isMounted = false
        }
    }, [getCurrentProfile])

    return (
    <>
        <header className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                    <NavLink to={`/participant/dashboard`} className="w-10 h-10 flex items-center justify-center">
                        <img src={asset.transparentLogo} alt=""/>
                    </NavLink>
                    <div>
                        <div className="text-sm font-semibold text-gray-600">UCLM CARES</div>
                        <div className="text-xs text-gray-600">Volunteer Matching</div>
                    </div>
                    </div>
                    
                    {/* <div className="flex items-center space-x-1 text-sm border-r pr-4 border-gray-300">
                        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">
                            <Grid className="w-4 h-4" />
                            <span className='text-gray-600'>Explore</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div> */}
                    
                    {/* <div className="flex items-center max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                            type="text"
                            placeholder="Search for courses, articles and resources"
                            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="border py-2 rounded-r-md border-l-0 border-gray-300 flex items-center space-x-2 text-sm">
                            <span className='px-2 text-gray-600'>Search</span>
                        </button>
                    </div> */}
                </div>
                
                <div className="flex items-center space-x-4">

                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/participant/dashboard' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-blue-600 text-blue-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-blue-600 hover:text-blue-600 transition duration-600'}`
                        }}>
                            My Interested Events
                        </NavLink>
                    </div>
                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/participant/registered-events' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-blue-600 text-blue-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-blue-600 hover:text-blue-600 transition duration-600'}`
                        }}>
                            Registered Events
                        </NavLink>
                    </div>

                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/participant/QrCode-Scanner' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-blue-600 text-blue-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-blue-600 hover:text-blue-600 transition duration-600'}`
                        }}>
                            Scan Qr Attendance
                        </NavLink>
                    </div>
                    <button onClick={() => setShowProfileSlider(!showProfileSlider)}
                    className="flex cursor-pointer items-center space-x-3 border-l border-gray-300 pl-4 pr-6 ">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                            {GetFirstLetter(currentProfileInfo?.CampusUser?.firstname?.toUpperCase() || '')}
                        </div>
                        <div className="text-sm text-start">
                            <div className="font-semibold">{`${currentProfileInfo?.CampusUser?.firstname?.toUpperCase() || ''}`}</div>
                            <div className="text-xs text-gray-500">Volunteer</div>
                        </div>
                    </button>
                </div>
            </div>
        </header>
        <ParticipantProfileSlider
        userData={currentProfileInfo}
        open={showProfileSlider}
        setOpen={() => setShowProfileSlider(false)}
        />
    </>
  )
}

export default ParticpantNavbar