import { asset } from '../../assets/asset'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import OptionModal from '../modal/OptionModal'
import BackspaceIcon from '@mui/icons-material/Backspace';

const Navbar = () => {
    const location = useLocation()
    // This check the current active path of our url and do a specification below na
    const isActive = (path) => location.pathname === path

    const [open, setOpen] = useState(false)

    return (
        <>
            <header className='flex sticky top-0 z-50 justify-between items-center px-14 py-1 bg-white drop-shadow-sm rounded-e-md font-[Roboto]'>
                <div className="logoContainer flex items-center">
                    <img src={asset.logo} alt="UCLM CARES" className='h-[46px] w-[46px] flex justify-center items-center cursor-pointer' />
                    <div className='title flex justify-center items-center px-1.5 text-[24px] font-bold'><h3>UCLM CARES</h3></div>
                </div>

                <div className="navLinks flex justify-center items-center text-sm/6">
                    <Link to={'/'} className={`px-5 ${isActive('/') ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300`}`}>Home</Link>
                    <Link to={'/Timeline'} className={`px-5 ${isActive('/Timeline') ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300`}`}>Timeline</Link>
                    <Link to={'/Programs'} className={`px-5 ${isActive('/Programs') ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300`}`}>Programs</Link>
                    <Link to={'/UpComing-Events'} className={`px-3 ${isActive('/UpComing-Events') ? `text-blue-600` : `hover:text-blue-600 transition-colors duration-300`}`}>Up Coming Events</Link>
                </div>

                <div className="sideContainer flex justify-end items-center text-md/6 text-white">
                    <button onClick={() => setOpen(true)} type="submit" className='bg-blue-600 px-2.5 py-1.5 rounded-[4px] hover:bg-blue-700 transition-colors duration-400 hover:text-white'>Get Involved</button>
                </div>
            </header >

            <OptionModal open={open}>
                <div className="content flex justify-between">
                    <div className="exit absolute right-5 top-2.5 cursor-pointer">
                        <BackspaceIcon fontSize='small' sx={{ color: 'slategray' }} onClick={() => setOpen(false)} />
                    </div>
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES"
                            className='h-24 w-24' />
                    </div>

                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className='flex justify-center items-end text-slate-500 text-[12px]'>Welcome To University Of Cebu</span>
                        <h1 className='text-[26px] font-base'>Become <br /> One</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Choose Your Position
                    </span>
                </div>

                <div className="OptionSelection flex justify-center items-center pt-8 flex-col">
                    <button className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                    >Participant</button>
                    <button className='bg-blue-600 rounded-md my-3 text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                    >Donor</button>
                </div>
            </OptionModal>
        </>
    )
}

export default Navbar