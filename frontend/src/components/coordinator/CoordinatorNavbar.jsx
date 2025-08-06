import React, { useState } from 'react'
import { asset } from '../../assets/asset'

const SettingsModal = ({ isOpen, onClose }) => {
  return (
    <div>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.05)' }}
        onClick={onClose}
      />
      {/* Slide-in modal */}
      <div
        className={`shadow-xl top-21 right-2 fixed right-0 h-120 w-100 max-w-md z-50 bg-white shadow-2xl rounded-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ minWidth: 340 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b ">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div className="text-gray-700">Settings content goes here.</div>
          {/* Add your settings options here */}
        </div>
      </div>
    </div>
  );
};

const CoordinatorNavbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
              <a href="/coordinator/accomplishments">Accomplishments</a>
            </li>
            <li className='px-3 text-l'>
              <a href="/coordinator/certificates">Certificates</a>
            </li>
            <li className='px-3 text-l'>
              <a href="/coordinator/history">History</a>
            </li>
          </ul>

          <div className="flex items-center gap-4 mx-6">
            <div className="avatar avatar-online avatar-placeholder dropdown dropdown-end cursor-pointer">
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
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); setIsSettingsOpen(true); }}>Settings</a>
                </li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}

export default CoordinatorNavbar 