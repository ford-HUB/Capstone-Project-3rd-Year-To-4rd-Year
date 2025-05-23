import React from 'react'

const ParticipantNavbar = () => {
  return (
    <>
        <nav className='flex justify-end p-3 md:flex-nowrap'>
                <ul className='flex items-center p-3'>
                    <li className='px-3 text-l'>
                        <a href="">Achievements</a>
                    </li>
                    <li className='px-3 text-l'>
                        <a href="">Cerificate</a>
                    </li>
                    <li className='px-3 text-l'>
                        <a href="">History</a>
                    </li>
                </ul>

                <div className="avatar avatar-online avatar-placeholder flex mx-6 dropdown dropdown-end">
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
        </nav>
    </>
  )
}

export default ParticipantNavbar