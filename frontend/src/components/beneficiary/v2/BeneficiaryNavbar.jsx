import React from 'react'
import { Grid, ChevronDown, Search, MapPin } from 'lucide-react'
import { asset } from '../../../assets/asset.jsx'
import { NavLink } from 'react-router-dom'
import { useBeneficiaryProfileStore } from '../../../store/beneficiary/useBeneficiaryProfileStore.js'
import BeneficiaryProfileSlider from '../../modal/v2/beneficiary/BeneficiaryProfileSlider.jsx'

const BeneficiaryNavbar = () => {
    const { currentProfileInfo, getCurrentProfile } = useBeneficiaryProfileStore()
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
                    <NavLink to={`/beneficiary/dashboard`} className="w-10 h-10 flex items-center justify-center">
                        <img src={asset.transparentLogo} alt=""/>
                    </NavLink>
                    <div>
                        <div className="text-sm font-semibold text-gray-600">UCLM CARES</div>
                        <div className="text-xs text-gray-600">Location-Based Assistance</div>
                    </div>
                    </div>
                    
                    {/* <div className="flex items-center space-x-1 text-sm border-r pr-4 border-gray-300">
                        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100">
                            <MapPin className="w-4 h-4" />
                            <span className='text-gray-600'>Near You</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div> */}
                    
                    {/* <div className="flex items-center max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                            type="text"
                            placeholder="Search for events and assistance near you"
                            className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button className="border py-2 rounded-r-md border-l-0 border-gray-300 flex items-center space-x-2 text-sm">
                            <span className='px-2 text-gray-600'>Search</span>
                        </button>
                    </div> */}
                </div>
                
                <div className="flex items-center space-x-4">

                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/beneficiary/dashboard' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-green-600 text-green-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-green-600 hover:text-green-600 transition duration-600'}`
                        }}>
                            Events Near You
                        </NavLink>
                    </div>
                    <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/beneficiary/my-registrations' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-green-600 text-green-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-green-600 hover:text-green-600 transition duration-600'}`
                        }}>
                            My Registrations
                        </NavLink>
                    </div>

                    {/* <div className='border-l border-gray-300 pl-4'>
                        <NavLink to='/beneficiary/attendance-scanner' end className={({ isActive }) => {
                            return `px-4 py-2 text-md font-medium rounded
                            ${isActive ? 'border-b-3 rounded-b-none border-green-600 text-green-600' : 'text-gray-600 hover:border-b-3 hover:rounded-b-none hover:border-green-600 hover:text-green-600 transition duration-600'}`
                        }}>
                            Attendance Scanner
                        </NavLink>
                    </div> */}
                    <button onClick={() => setShowProfileSlider(!showProfileSlider)}
                    className="flex cursor-pointer items-center space-x-3 border-l border-gray-300 pl-4 pr-6 ">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                            {currentProfileInfo?.firstname?.charAt(0)?.toUpperCase() || 'B'}
                        </div>
                        <div className="text-sm text-start">
                            <div className="font-semibold">{`${currentProfileInfo?.firstname?.toUpperCase() || 'BENEFICIARY'}`}</div>
                            <div className="text-xs text-gray-500">Beneficiary</div>
                        </div>
                    </button>
                </div>
            </div>
        </header>
        <BeneficiaryProfileSlider
        userData={currentProfileInfo}
        open={showProfileSlider}
        setOpen={() => setShowProfileSlider(false)}
        />
    </>
  )
}

export default BeneficiaryNavbar
