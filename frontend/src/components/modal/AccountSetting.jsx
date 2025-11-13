import React from 'react'
import { Camera, CircleX, Eye, EyeOff, SquarePen, Undo2, UserRoundPen } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { accountSettingsConfig } from '../../config/accountSettingsConfig.js';
import toast from 'react-hot-toast';

const AccountSettings = ({ open, setOpen, role }) => {
    const config = accountSettingsConfig[role]

    if(!config) return

    const { useAuthStore, useProfileStore, emailSchema, passwordSchema } = config
    const { authenticatedDirector, authenticatedManagement, checkAuth } = useAuthStore()
    const { currentProfile, updateEmailOrAvatar, updatePassword } = useProfileStore()

    const [isEmailChange, setEmailChange] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const imageInputRef = React.useRef()
    const [preview, setPreview] = React.useState()


    const emailForm = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: authenticatedDirector?.email || authenticatedManagement?.email,
            avatar: ''
        }
    })

    React.useEffect(() => {
        if(open) {
            setPreview(currentProfile.profile_image)
        }
    }, [open, currentProfile])

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: ''
        }
    })

    const handleImageClick = () => {{
        imageInputRef.current.click()
    }}

    const handleUndoAction = () => {
        setEmailChange(false)
        emailForm.reset({
            email: authenticatedDirector?.email || authenticatedManagement?.email || '',
            avatar: currentProfile.profile_image || ''
        })

        setPreview(currentProfile.profile_image)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if(file) {
            const previewImage = URL.createObjectURL(file)
            setPreview(previewImage)
            emailForm.setValue('avatar', file)
            
        }
    }

    const onSubmitFormEmail = async (formData) => {
        const form = new FormData()
        form.append('email', formData.email)
        form.append('avatar', formData.avatar)

        console.log(formData)

        await updateEmailOrAvatar(form)
        await checkAuth()
        await currentProfile()
        setEmailChange(false)
    }

    const onSubmitFormPassword = async (formData) => {
        await updatePassword(formData)
        await checkAuth()
        passwordForm.reset({ newPassword: '' })
        setOpen(false)
    }
    
    React.useEffect(() => {
        emailForm.formState.errors.email && toast.error(emailForm.formState.errors.email.message)
        passwordForm.formState.errors.newPassword && toast.error(passwordForm.formState.errors.newPassword.message)
    }, [emailForm.formState.errors.email, passwordForm.formState.errors.newPassword])

    if(!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex flex-col sticky top-0 py-3">
                    <div className='inline-flex items-center justify-between mb-4'>
                        <h1 className="font-semibold text-2xl">Account Settings </h1>
                        <button
                            onClick={() => {
                                setOpen(false)
                                setEmailChange(false)
                            }}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            <CircleX className='relative top-0 h-10 w-10 cursor-pointer'/>
                        </button>
                    </div>
                    <span className='text-sm text-gray-500'>Update your details to keep your account up to date.</span>
                </header>

                <main className='overflow-y-auto pr-1'>
                    <form onSubmit={emailForm.handleSubmit(onSubmitFormEmail)}>
                        <div className='mt-8 inline-flex items-start'>
                        {
                            isEmailChange ?
                            <>
                                <div className='px-4'>
                                    <button onClick={handleImageClick}
                                    className='cursor-pointer'>
                                    {
                                        preview ? 
                                        <>
                                        <img
                                        className='w-24 h-24 hover:opacity-50 transition-transform duration-300 rounded-full avatar mx-3'
                                        src={preview}/>
                                        <div className='inline-flex relative right-8 top-8 items-center p-1 bg-gray-200 rounded-full cursor-pointer'>
                                            <UserRoundPen className='h-4 w-4 text-gray-800'/>
                                            </div>
                                        </>
                                        :<>
                                            <img className='w-24 h-24 hover:opacity-50 transition-transform duration-300 rounded-full avatar mx-3' src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"/>
                                        </>
                                    }
                                    </button>
                                    <input
                                    type="file"
                                    accept='image/*'
                                    name='avatar'
                                    {...emailForm.register('avatar')  }
                                    ref={imageInputRef}
                                    onChange={handleFileChange}
                                    hidden/>
                                </div>
                            </> : 
                            <div className='px-4'>
                            <img className='w-24 h-24 rounded-full avatar mx-3'
                            src={preview}/>
                            </div>
                        }
                        <div className='flex flex-col items-start'>
                            <span className='text-xl font-semibold text-gray-700'>Account Email Address</span>
                            {
                                isEmailChange ? 
                                (<>
                                    <span className='text-sm text-gray-600'>You are currently on editing mode <span className='font-semibold'>
                                    <input {...emailForm.register('email')  } autoFocus className={`px-2 mx-2 border-b border-gray-500 ${emailForm.formState.errors.email ? 'border-b border-red-600' : ''} rounded-sm focus:ring-0 focus:outline-none focus:border-b' type="text" name="email`}/>
                                    </span>
                                    </span>
                                    <div className='relative flex space-x-2.5 top-3 right-0'>
                                        <button disabled={emailForm.formState.isSubmitting}
                                        className='inline-flex h-8 btn rounded-2xl text-gray-50 bg-blue-600'>
                                            <SquarePen className='h-4 w-4'/>
                                            { emailForm.formState.isSubmitting ? 'Saving...' : 'Save' }
                                        </button>
                                        <button onClick={handleUndoAction}
                                        className='inline-flex h-8  btn rounded-2xl text-gray-50 bg-blue-600'>
                                            <Undo2 className='h-4 w-4'/>
                                            Cancel
                                        </button>
                                    </div>
                                </>)
                                : (<>
                                    <span className='text-sm text-gray-600'>Your current used email is <span className='font-semibold'>
                                    { authenticatedDirector?.email || authenticatedManagement?.email}
                                    </span>
                                    </span>
                                    <div className='relative top-3 right-0'>
                                        <button onClick={() => setEmailChange(true)}
                                        className='inline-flex btn rounded-2xl text-gray-50 bg-blue-600'>
                                            <SquarePen/>
                                            change
                                        </button>
                                    </div>
                                </>)
                            }
                        </div>
                    </div>
                    </form>

                    <div className="subHeader2 border-t mt-6 border-gray-200">
                        <h2 className='text-xl mt-7 font-semibold text-gray-700'>Your Password</h2>
                    </div>

                    <div className="flex flex-col space-x-2.5 mt-5">
                        <div className='flex flex-row space-x-5'>
                            <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="currentPassword" className='text-[12px]'>
                                Current Password
                            </label>
                            <input
                            className='input w-full'
                            type="text"
                            name="currentPassword"
                            placeholder='**********************'
                            disabled/>
                        </div>
                        <form onSubmit={passwordForm.handleSubmit(onSubmitFormPassword)}
                        className='inline-flex space-x-2'>
                            <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="newPassword" className='text-[12px]'>
                                New Password
                            </label>
                            <input
                            {...passwordForm.register('newPassword')  }
                            className={`input w-full  ${passwordForm.formState.errors.newPassword ? 'focus:outline-none focus:ring-0 focus:border-red-600': ''}`}
                            type={`${ showPassword ? 'text' : 'password' }`}
                            name="newPassword"
                            placeholder='*******'
                            />
                            </div>
                            <div className='flex items-center mt-5 space-x-5'>
                                <button type='click' onClick={() => setShowPassword(!showPassword)}
                                    className='cursor-pointer'>
                                    { showPassword ? <Eye/> : <EyeOff/> }
                                </button>
                                <button type='submit' className='btn rounded-2xl text-gray-50 bg-blue-600'>
                                    Save Password
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>

                    <div className="border-t mt-8 pt-6 border-gray-200">
                        <div className='text-center'>
                            <div className='inline-flex items-center space-x-2 text-gray-500 mb-2'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                                <span className='text-sm font-medium'>Your account is secure</span>
                            </div>
                            <p className='text-xs text-gray-400 leading-relaxed'>
                                Keep your information up to date to maintain the best experience.<br/>
                                We're committed to protecting your privacy and data security.
                            </p>
                        </div>
                    </div>

                </main>

            </div>
           
        </div>
    )
}

export default AccountSettings