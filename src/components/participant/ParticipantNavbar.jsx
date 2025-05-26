import React from 'react'
import { asset } from '../../assets/asset'

const ParticipantNavbar = () => {
  return (
    <>
        <nav className='flex p-3 md:flex-nowrap justify-between shadow-md rounded-b-md'>
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


                    <div className="avatar avatar-online avatar-placeholder mx-6 dropdown dropdown-end cursor-pointer">
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
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
        </nav>
    </>
  )
}

export default ParticipantNavbar