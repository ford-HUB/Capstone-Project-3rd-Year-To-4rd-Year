import React, { useState } from 'react'
import { asset } from '../../assets/asset'
import { useNavigate } from 'react-router-dom'
import { directorLoginSchema } from '../../forms/DirectorSchema.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/director/useAuthStore.js'
import DirectorForgotPasswordModal from '../../components/auth/DirectorForgotPasswordModal.jsx'

const DirectorLogin = () => {
    const { login } = useAuthStore()
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(directorLoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const navigate = useNavigate()

    const onSubmitForm = async (formData) => {
        console.log(formData)
        const success = await login({
            email: formData.email,
            password: formData.password
        })

        if(!success) return
        navigate('/director/overview')
    }

    React.useEffect(() => {
        errors.email && toast.error(errors.email.message)
    }, [errors.email])

    React.useEffect(() => {
        errors.password && toast.error(errors.password.message)
    }, [errors.password])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-100 h-96 bg-blue-300 rounded-full opacity-30 z-0" />
            <div className="absolute bottom-0 right-0 w-100 h-80 bg-blue-200 rounded-full opacity-20 z-0" />
            <div className="relative z-10 flex flex-col items-center w-full max-w-md -top-4">
                <img src={asset.transparentLogo} alt="Director Logo" className="h-30 w-30 rounded-full object-cover shadow-lg mb-4 bg-white p-2" />
                <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-95 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Director Login</h1>
                    <p className="text-gray-500 text-sm mb-6 text-center">Sign in to your director account</p>
                    <form onSubmit={handleSubmit(onSubmitForm)} className="w-full flex flex-col gap-4">
                        <input
                            className="input border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-200 bg-white text-gray-700"
                            type="text"
                            {...register('email')  }
                            placeholder="Given Access Email"
                        />
                        <div className="relative">
                            <input
                                className="input border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-200 bg-white text-gray-700 w-full"
                                type={showPassword ? "text" : "password"}
                                {...register('password')  }
                                placeholder="Password"
                            />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    className="accent-blue-600" 
                                />
                                Show password
                            </label>
                            <button type="button" className="text-blue-600 hover:underline" onClick={() => setShowForgotPasswordModal(true)}>Forgot password?</button>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-2 transition-colors mt-2" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Forgot Password Modal */}
            <DirectorForgotPasswordModal 
                isOpen={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
            />
        </div>
    )
}

export default DirectorLogin 