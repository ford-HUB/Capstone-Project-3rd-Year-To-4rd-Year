import React from 'react'
import { asset } from '../../assets/asset'
import { useAuth } from '../../hooks/participant/useAuth'
import Logout from '../modal/Logout'
import { useNavigate } from 'react-router-dom'

const StaffNavbar = () => {
    const { authenticatedUser, logout } = useAuth()
    const navigate = useNavigate()

    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false)

    const handleLogout = async() => {
        const success = await logout()
        if(!success) return
        setIsLogoutModalOpen(false)
        setTimeout(() => {
            navigate('/')
        }, 1000)
    }


  return (
    <>
        <nav className='flex p-3 md:flex-nowrap justify-between shadow-md rounded-b-md sticky top-0 z-[100] bg-white'>
                <div className="logo flex mx-4 items-center">
                    <img src={asset.logo} alt="uclm-cares" className='w-12' />
                    <h1 className='px-2 text-2xl font-bold'>UCLM CARES</h1>
                </div>

                <div className="flex">
                    <ul className='flex items-center p-3'>
                        <li className='px-3 text-l'>
                            <a href="">Achievements</a>
                        </li>
                        <li className='px-3 text-l'>
                            <a href="">Cerificates</a>
                        </li>
                        <li className='px-3 text-l'>
                            <a href="">History</a>
                        </li>
                    </ul>


                    <div className={`avatar ${authenticatedUser?.is_active && `avatar-online`} avatar-placeholder mx-6 dropdown dropdown-end cursor-pointer`}>
                        <div className="bg-neutral flex items-center text-neutral-content w-12 rounded-full" role='button' tabIndex={0}>
                            <span className="text-xl">C</span>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-14 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a onClick={() => setIsLogoutModalOpen(true)}>Logout</a></li>
                        </ul>
                    </div>
                </div>
        </nav>

        <Logout
        onOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        />
    </>
  )
}

export default StaffNavbar