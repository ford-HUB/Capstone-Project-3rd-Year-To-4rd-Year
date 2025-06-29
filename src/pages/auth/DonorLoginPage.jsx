import React from 'react'
import OptionModal from '../../components/modal/OptionModal'
import { asset } from '../../assets/asset'
import DonorRegistration from './DonorRegistration'
import { X } from 'lucide-react'

const DonorLoginPage = () => {
    const [open, setOpen] = React.useState(true)
    const [showRegistrationModal, setRegistrationModal] = React.useState(false)

    const handleShowRegistration = () => {
        setOpen(false)
        setRegistrationModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const google = () => {
        window.location.href=`http://localhost:8000/api/donor-auth/google/login`
    }

    const facebook = () => {
        window.location.href=`http://localhost:8000/api/donor-auth/facebook/login`
    }


    return (
        <>
            <OptionModal open={open}>
                <a href='/' className='absolute right-5 top-4'>
                <X className='text-gray-500 cursor-pointer' size={14}/>
                </a>
                <div className="content flex justify-between">
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES"
                            className='h-24 w-24' />
                    </div>

                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className='flex justify-center items-end text-slate-500 text-[12px]'>Welcome To University Of Cebu</span>
                        <h1 className='text-[26px] font-base'>Login<br /> Account</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center my-1">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Support Portal
                    </span>
                </div>

                <div>
                    <button onClick={google}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 mt-4 text-sm font-medium cursor-pointer text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px] " />Continue with Google
                    </button>
                </div>

                <div>
                    <button onClick={facebook}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 mt-2 text-sm font-medium cursor-pointer text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1">
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 48 48" version="1.1">
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                                    <path
                                        d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z"
                                        id="Facebook">

                                    </path>
                                </g>
                            </g>
                        </svg>
                            Continue with Facebook
                    </button>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-6">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Web Portal
                    </span>
                </div>

                <div className="formContainer flex flex-col justify-center items-center mt-6">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="relative w-[18rem]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16" fill="currentColor"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 z-[100]">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>

                            <input
                                className="input input-bordered w-full pl-10 focus:outline-none"
                                type="text"
                                placeholder="Email"
                            />
                        </div>

                        <div className="relative w-[18rem]">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 z-[100]">
                                <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
                            </svg>

                            <input
                                className="input input-bordered w-full pl-10 focus:outline-none"
                                type="password"
                                placeholder="Password"
                            />
                        </div>

                        <label className="fieldset-label flex justify-end items-center mt-1.5">
                            <input type="checkbox" className="checkbox checkbox-xs text-gray-500 mr-0.5 border-gray-100"
                            />
                            <span className='text-gray-500 text-[11px]'>Remember me</span>
                        </label>

                        <div className="OptionSelection flex justify-center items-center mt-1 flex-col">
                            <button className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white' type='submit'
                            >Login</button>
                        </div>

                        <div className="fallVisit flex justify-between mt-1.5 ">
                            <div className="leftFooter flex items-center text-[11px] text-slate-600">
                                <span className='text-[11px] text-slate-600'>Do you want to volunteer?</span>
                                <a href='/' className='text-[11px] flex item-center ml-[3px] text-blue-600 hover:link transition-all duration-300'>Click here</a>
                            </div>

                            <div className="rightFooter flex items-center">
                                <button onClick={handleShowRegistration} className='text-[11px] flex item-center text-slate-600 cursor-pointer hover:text-blue-600 transition-colors duration-300 hover:link'>Go to registration</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="forgetPassword flex justify-center items-center">
                    <button onClick={null} className='absolute bottom-[-30px] left-30 text-[12px] bg-white/50 px-2 rounded-sm text-gray-900 cursor-pointer font-[Roboto] hover:text-blue-700 transition-colors duration-300'>
                        Forget Password?
                    </button>
                </div>
            </OptionModal>

            {
                showRegistrationModal && <DonorRegistration/>
            }
        </>
    )
}

export default DonorLoginPage