import React, { useState } from 'react'
import { asset } from '../../assets/asset'
import Settings from '../modal/Settings'
import Logout from '../modal/Logout'
import { useAuthHooks } from '../../hooks/director/useAuthHooks.js'
import { useNavigate } from 'react-router-dom'


const DirectorNavbar = () => {
  const { logout } = useAuthHooks()
  const navigate = useNavigate()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogout, setLogout] = React.useState(false)

  const handleLogout = async () => {
    const success = await logout()
    if(!success) return
    setTimeout(() => {
      navigate('/one secret/login')
    })
  }

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 flex p-3 md:flex-nowrap justify-between shadow-md rounded-b-md bg-white z-50'>
        <div className="logo flex mx-4 items-center">
          <img src={asset.logo} alt="uclm-cares" className='w-12' />
          <h1 className='px-2 text-2xl font-bold'>UCLM CARES</h1>
        </div>

        <div className="flex">
          <ul className='flex items-center p-3'>
            <li className='px-3 text-l'>
              <a href="/director/accomplishments">Accomplishments</a>
            </li>
            <li className='px-3 text-l'>
              <a href="/director/history">History</a>
            </li>
          </ul>

          <div className="flex items-center gap-4 mx-6">
            <div className="avatar avatar-online avatar-placeholder dropdown dropdown-end cursor-pointer">
              <div className="bg-neutral flex items-center text-neutral-content w-12 rounded-full" role='button' tabIndex={0}>
                <span className="text-xl">D</span>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-14 w-52 p-2 shadow">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a onClick={e => { e.preventDefault(); setIsSettingsOpen(true); }}>Settings</a>
                </li>
                <li onClick={() => setLogout(true)}><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <Logout onOpen={isLogout} onClose={() => setLogout(false)} onConfirm={handleLogout}/>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}

export default DirectorNavbar 