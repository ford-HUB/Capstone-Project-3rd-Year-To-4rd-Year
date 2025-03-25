import React from 'react'
import OptionModal from '../../components/modal/OptionModal'
import { asset } from '../../assets/asset'
import { v4 as uuidv4 } from 'uuid'
import Cookie from 'js-cookie'
// import Alert from '../../components/guest/Alert'


const LoginForm = () => {
    const [open, setOpen] = React.useState(true)
    const [token, setToken] = React.useState()

    // form state
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [rememberMe, setRememberMe] = React.useState(false)

    // Action Alert
    // const [Alert, setAlert] = React.useState(true)

    const setCookie = () => {
        const generateToken = uuidv4()
        Cookie.set('token', generateToken, { expires: 3 / (60 * 60 * 24) })
        setToken(generateToken)
        setOpen(false)
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


    const handleSubmit = (e) => {
        e.preventDefault()
        setUsername('')
        setPassword('')
        setRememberMe(false)
        console.log({ username, password, rememberMe })

    }

    React.useEffect(() => {
        if (token) {
            console.log(`our token ${Cookie.get('token')}`)
        } else {
            console.log(`our token is already expire`)
            setToken()
        }
    }, [])



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
                        <h1 className='text-[26px] font-base'>Login<br /> Account</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ID number or Email"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <label className="fieldset-label flex justify-end items-center mt-1.5">
                            <input type="checkbox" className="checkbox w-4 h-4"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className='text-[12px]'>Remember me</span>
                        </label>

                        <div className="OptionSelection flex justify-center items-center mt-1 flex-col">
                            <button className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white'
                                type='submit'
                            >Login</button>
                        </div>
                    </form>
                </div>
                <div className="fallVisit flex justify-start mt-1.5 ">
                    <span className='inline-flex text-[11px] text-slate-600'>Do you want to be guest?</span>
                    <button onClick={() => setCookie()} className='link text-[11px] flex item-center ml-[3px] text-blue-600'>Click here</button>
                </div>

            </OptionModal>
        </>
    )
}

export default LoginForm