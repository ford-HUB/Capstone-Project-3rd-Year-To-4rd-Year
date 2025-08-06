import React from 'react'
import { Camera, CircleX, Eye, EyeOff, SquarePen, TriangleAlert, Undo2, UserRoundPen } from 'lucide-react';
import { useAuthStore } from '../../store/director/useAuthStore.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateEmailSchema, updatePasswordSchema } from '../../forms/DirectorSchema.js';
import { useProfileStore } from '../../store/director/useProfileStore.js';
import toast from 'react-hot-toast';

const DirectorAccountSettings = ({ open, setOpen }) => {
    const [isEmailChange, setEmailChange] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const imageInputRef = React.useRef()
    const { updateEmail, updatePassword, getCurrentProfile, currentDirectorInfo } = useProfileStore()
    const { authenticatedDirector, checkAuth } = useAuthStore()
    const [preview, setPreview] = React.useState(currentDirectorInfo?.profile_image)

    const emailForm = useForm({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: {
            email: authenticatedDirector?.email || '',
            avatar: ''
        }
    })

    React.useEffect(() => {
        if(open) {
            setPreview(currentDirectorInfo.profile_image)
        }
    }, [open, getCurrentProfile])

    const passwordForm = useForm({
        resolver: zodResolver(updatePasswordSchema),
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
            email: authenticatedDirector?.email || '',
            avatar: currentDirectorInfo.profile_image || ''
        })

        setPreview(currentDirectorInfo?.profile_image)
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

        await updateEmail(form)
        await checkAuth()
        await getCurrentProfile()
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
                        <h1 className="font-semibold text-2xl">Account Settings</h1>
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
                                    {authenticatedDirector?.email}
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
                                <button onClick={() => setShowPassword(!showPassword)}
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

                    <div className="subHeader2 border-t mt-6 border-gray-200">
                        <h2 className='text-xl mt-7 font-semibold text-gray-700'>Delete Account</h2>
                    </div>
                    <div className='mt-4 flex flex-col'>
                        <span className='inline-flex rounded-2xl p-2 text-red-600 bg-red-100'>
                            <TriangleAlert className='h-5 w-5 mx-2'/> Proceed with caution
                        </span>
                        <p className='text-[12px] m-2'>
                            Make sure you have taken backup of your account in case you ever need to get access to your data. We will completely wipe your data. There is no way to access your account after this action.
                        </p>
                        <button className='underline text-red-600 cursor-pointer'>Continue with deletion</button>
                    </div>
                </main>

            </div>
           
        </div>
    )
}

export default DirectorAccountSettings