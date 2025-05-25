import React from 'react'

const ParticipantNavbar = () => {
  return (
    <>
        <nav className='flex justify-end items-center pt-6 pr-3 bg-gray-200'>
            <div className='flex items-center bg-blue-500 rounded-xl p-1 mr-4 pl-4 pr-0 gap-2'>
                <div className='px-4 py-2 text-white hover:bg-blue-600 rounded-xl text-sm font-medium cursor-pointer transition-colors'>
                Achievements
                </div>
                <div className='px-4 py-2 text-white hover:bg-blue-600 rounded-xl text-sm font-medium cursor-pointer transition-colors'>
                Certificate
                </div>
                <div className='px-4 py-2 text-white hover:bg-blue-600 rounded-xl text-sm font-medium cursor-pointer transition-colors'>
                History
                </div>
                <div className='px-4 py-2 text-white hover:bg-blue-600 rounded-xl text-sm font-medium cursor-pointer transition-colors'>
                User First Name
                </div>
                

                <div className="avatar avatar-online avatar-placeholder flex mx-6 dropdown dropdown-end mr-4">
                    <div className="bg-neutral flex items-center text-neutral-content w-12 rounded-full cursor-pointer" role='button' tabIndex={0}>
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