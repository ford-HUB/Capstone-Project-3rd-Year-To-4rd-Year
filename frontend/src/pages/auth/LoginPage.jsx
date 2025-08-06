import React from 'react'
import OptionModal from '../../components/modal/OptionModal'
import { asset } from '../../assets/asset'
import { v4 as uuidv4 } from 'uuid'
import Cookie from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import DonorRegistration from './DonorRegistration'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../forms/StudentSchemas'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/participant/useAuthStore.js'
import { roleRedirection } from '../../utils/roleRedirection.js'
import DonorLoginPage from './DonorLoginPage.jsx'

const LoginPage = () => {
    const [open, setOpen] = React.useState(true)
    const [token, setToken] = React.useState()

    const { login } = useAuthStore()

    // form state
    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }

     } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    })


    // Define Naviate Link
    const navigate = useNavigate()

    // Page To Posistion Page
    const [isNextPage, setNextPage] = React.useState(false)
    const [showDonorLogin, setShowDonorLogin] = React.useState(false)
    const [isDonor, setDonor] = React.useState(false)

    const ShowDonorLogin = () => {
        setShowDonorLogin(true)
        setNextPage(false)
    }

    const GoToDonor = () => {
        setDonor(true)
        setNextPage(false)
        return
    }

    const GoToParticipant = () => {
        navigate('/register-account')
        return
    }

    const GotoRequestStaff = () => {
        navigate('/requested-setup-account')
        return
    }

    const setCookie = () => {
        const generateToken = uuidv4()
        Cookie.set('token', generateToken, { expires: 30 / (24 * 60) })
        setToken(generateToken)
        setOpen(false)

        navigate(`/home/guest/${generateToken}`)
        console.log(token)

    }

    //checking triggered remember me checkbox
    // console.log(null)

    // Check token every second to detect expiration
    React.useEffect(() => {
        const checkTokenInterval = setInterval(() => {
            const CookieToken = Cookie.get("token");

            if (CookieToken) {
                if (CookieToken !== token) {
                    console.log(`Token updated: ${CookieToken}`);
                    setToken(CookieToken);
                }
            } else {
                if (token !== null) {
                    console.log("Token has expired!");
                    setToken();
                    setOpen(true)
                }
            }
        }, 1000); // re-render every 1 second to check the token status

        // Cleanup interval when component unmounts
        return () => clearInterval(checkTokenInterval);
    }, [token]);

    React.useEffect(() => {
        if (token) {
            console.log(`our token ${Cookie.get('token')}`)
        } else {
            console.log(`our token is already expire`)
            setToken()
        }
    }, [])

    React.useEffect(() => {
        errors.email && toast.error(errors.email.message)
    }, [errors.email])

    React.useEffect(() => {
        errors.password && toast.error(errors.password.message)
    }, [errors.password])


    const onSubmitForm = async(data) => {
        const checkSuccess = await login({
            email: data.email,
            password: data.password
        })
        if(!checkSuccess.success) return

        if(data.rememberMe) { localStorage.set('rememberMe', email) }
        const redirectPath = roleRedirection[checkSuccess.role] || '/'

        setTimeout(() => navigate(redirectPath), 2000)

    }

    return (
        <>

            <OptionModal open={open}>
                <div className="content flex justify-between">
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES"
                            className='h-24 w-24' />
                    </div>
                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className='flex justify-center items-end text-slate-500 text-[12px]'>Welcome To University Of Cebu</span>
                        <h1 className='text-black text-[26px] font-base'>Login<br /> Account</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Web Portal
                    </span>
                </div>

                <div className="formContainer flex flex-col justify-center items-center mt-6">
                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2">
                        <div className="relative w-[18rem]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16" fill="currentColor"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 z-[100]">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>

                            <input
                                className={`input input-bordered w-full pl-10 focus:outline-none bg-white text-gray-500`}
                                type="text"
                                {...register('email')  }
                                placeholder="ID number or Email"
                                autoComplete='current-email'
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
                                className={`input input-bordered w-full pl-10 focus:outline-none bg-white text-gray-500`}
                                type="password"
                                {...register('password')  }
                                placeholder="Password"
                                autoComplete='current-password'
                            />
                        </div>

                        <label className="fieldset-label flex justify-end items-center mt-1.5">
                            <input type="checkbox" className="checkbox checkbox-xs text-gray-500 mr-0.5 border-gray-100"
                            {...register('rememberMe')}
                            />
                            <span className='text-gray-500 text-[11px]'>Remember me</span>
                        </label>

                        <div className="OptionSelection flex justify-center items-center mt-1 flex-col"> 
                            <button className={`bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white`}
                            disabled={isSubmitting}
                            type='submit'>
                                { isSubmitting ? `LoggingIn...`: `Login` }
                            </button>
                        </div>
                    </form>
                </div>
                <div className="fallVisit flex justify-between mt-1.5 ">
                    <div className="leftFooter flex items-center text-[11px] text-slate-600">
                        <span className='text-[11px] text-slate-600'>Do you want to be guest?</span>
                        <button onClick={() => setCookie()} className='text-[11px] flex item-center ml-[3px] text-blue-600 hover:link transition-all duration-300'>Click here</button>
                    </div>

                    <div className="rightFooter flex items-center">
                        <button onClick={() => setNextPage(true)} className='text-[11px] flex item-center text-slate-600 cursor-pointer hover:text-blue-600 transition-colors duration-300 hover:link'>Go to registration</button>
                    </div>
                </div>

                <div className="forgetPassword flex justify-start items-center">
                    <button onClick={null} className='absolute bottom-[-30px] left-10 text-[12px] bg-white/50 px-2 rounded-sm text-gray-900 cursor-pointer font-[Roboto] hover:text-blue-700 transition-colors duration-300'>
                        Forget Password?
                    </button>
                </div>

                <div className="forgetPassword flex justify-start items-center">
                    <button onClick={ShowDonorLogin} className='absolute bottom-[-30px] right-10 text-[12px] bg-white/50 px-2 rounded-sm text-gray-900 cursor-pointer font-[Roboto] hover:text-blue-700 transition-colors duration-300'>
                        Login as donor
                    </button>
                </div>

            </OptionModal>

            {/*Choice Modal*/}
            <OptionModal open={isNextPage} >
                <div className="content flex justify-between">
                    <div className="exit absolute right-5 top-2.5 cursor-pointer">
                        {/* <BackspaceIcon fontSize='small' sx={{ color: 'slategray' }} onClick={() => setOpen(false)} /> */}
                        <svg onClick={() => setNextPage(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 mt-1.5 text-gray-500">
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                        </svg>


                    </div>
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES"
                            className='h-24 w-24' />
                    </div>

                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className='flex justify-center items-end text-slate-500 text-[12px]'>Welcome To University Of Cebu</span>
                        <h1 className='text-[26px] font-base text-black'>Become <br /> One</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Registration Option
                    </span>
                </div>

                <div className="OptionSelection flex justify-center items-center pt-8 flex-col">
                    <button onClick={GoToParticipant} className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                    >Volunteer</button>
                    <button onClick={GoToDonor} className='bg-blue-600 rounded-md text-white w-full px-1.5 my-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                    >Donor</button>
                    <button onClick={GotoRequestStaff} className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                    >Request Approval Registration</button>
                </div>
            </OptionModal>

            {
                showDonorLogin && <DonorLoginPage/>
            }

            {
                isDonor && <DonorRegistration />
            }


        </>
    )
}

export default LoginPage
