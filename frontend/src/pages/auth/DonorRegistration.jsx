import React from 'react'
import OptionModal from '../../components/modal/OptionModal'
import { asset } from '../../assets/asset'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signupSchema } from '../../forms/DonorSchema.js'
import toast from 'react-hot-toast'
import { useDonorAuthStore } from '../../store/donor/useDonorAuthStore.js'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { encrypt } from '../../utils/crypto.js'

const DonorRegistration = () => {
    const [open, setOpen] = React.useState(true)
    const { signup } = useDonorAuthStore()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            termsAndCondtion: false
        }
    })

    const onSubmitForm = async (formData) => {
        const success = await signup({
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        })
        if(!success) return
        
        // Close modal and redirect to verification page with encrypted email
        setOpen(false)
        const encryptedEmail = encrypt(formData.email);
        navigate(`/verification_code?rq_access=${encodeURIComponent(encryptedEmail)}`)
    }




    React.useEffect(() => {
        errors.fullname && toast.error(errors.fullname.message)
    }, [errors.fullname])

    React.useEffect(() => {
        errors.email && toast.error(errors.email.message)
    }, [errors.email])

    React.useEffect(() => {
        errors.password && toast.error(errors.password.message)
    }, [errors.password])

    React.useEffect(() => {
        errors.confirmPassword && toast.error(errors.confirmPassword.message)
    }, [errors.confirmPassword])


    return (
        <OptionModal open={open} setOpen={open}>
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
                        <h1 className='text-[26px] font-base'>Register<br /> Account</h1>
                    </div>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my- 3 text-sm font-base text-gray-400">
                        Donor Login
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
                                className="input input-bordered w-full pl-10 focus:outline-none"
                                id='fullname'
                                type="text"
                                {...register('fullname')  }
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="relative w-[18rem]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16" fill="currentColor"
                                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 z-[100]">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>

                            <input
                                className="input input-bordered w-full pl-10 focus:outline-none"
                                id='email'
                                type="text"
                                {...register('email')  }
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
                                id='password'
                                type="password"
                                {...register('password')  }
                                placeholder="Password"
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
                                id='confirmPassword'
                                type="password"
                                {...register('confirmPassword')  }
                                placeholder="Confirm Password"
                            />
                        </div>

                        <div className="w-[18rem] text-xs text-gray-500 mt-2">
                            <label className="flex items-start space-x-2">
                                <input
                                {...register('termsAndCondtion')  }
                                required
                                type="checkbox" className="mt-1" />
                                <span>
                                    I agree to the <a href="/TermsAndCondtion" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/Privacy-Policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                                </span>
                            </label>
                        </div>

                        <div className="OptionSelection flex justify-center items-center mt-1 flex-col">
                            <button disabled={isSubmitting}
                            className='bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white' type='submit'
                            >{ isSubmitting ? 'Registering...': 'Register' }</button>
                        </div>
                    </form>
                </div>
            </OptionModal>
    )
}

export default DonorRegistration