import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDirectorInfoSchema } from '../../forms/DirectorSchema.js';
import { CircleX } from 'lucide-react';

const EditDirectorInformationModal = ({ open, setOpen, mode, currentInfo = [], onComplete }) => {
    const isEdit = mode === 'edit'

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(createDirectorInfoSchema),
        defaultValues: {
            facebook: '',
            insta: '',
            linkedin: '',
            X: '',
            firstname: '',
            lastname: '',
            email_address: '',
            phone_number: '',
            role_bio: '',
            school: ''
        }
    })


    React.useEffect(() => {
        if(open) {
            reset({
                facebook: isEdit ? currentInfo.facebook : '',
                insta: isEdit ? currentInfo.insta : '',
                linkedin: isEdit ? currentInfo.linkedin : '',
                X: isEdit ? currentInfo.X : '',
                firstname: isEdit ? currentInfo.firstname : '',
                lastname: isEdit ? currentInfo.lastname : '',
                email_address: isEdit ? currentInfo.email_address : '',
                phone_number: isEdit ? currentInfo.phone_number : '',
                role_bio: isEdit ? currentInfo.role_bio : '',
                school: isEdit ? currentInfo.school : ''
            })
        }
    }, [open, currentInfo, isEdit, reset])

    if(!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <header className="flex flex-col sticky top-0 py-3">
                    <div className='inline-flex items-center justify-between mb-4'>
                        <h1 className="font-semibold text-2xl">{ isEdit ? 'Edit Personal Information': 'Add Personal Information' }</h1>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            <CircleX className='relative top-0 h-10 w-10 cursor-pointer'/>
                        </button>
                    </div>
                    <span className='text-sm text-gray-500'>Update your details to keep your profile up to date.</span>
                </header>

                <main className='overflow-y-auto pr-1'>
                    <form onSubmit={handleSubmit(onComplete)}>
                        <div className="subHeader1">
                        <h2 className='text-xl mt-7 font-semibold text-gray-700'>Social Links</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-5">
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="facebook">
                                    Facebook
                                </label>
                                <input
                                {...register('facebook') }
                                className='input w-full'
                                type="text"
                                name="facebook"/>
                                {errors.facebook && <span className='text-sm text-red-600'>{errors.facebook.message}</span>  }
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="linkedin">
                                    LinkedIn
                                </label>
                                <input
                                {...register('linkedin')  }
                                className='input w-full'
                                type="text"
                                name="linkedin"/>
                                {errors.linkedin && <span className='text-sm text-red-600'>{errors.linkedin.message}</span>}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="insta">
                                    Instagram
                                </label>
                                <input
                                {...register('insta')  }
                                className='input w-full'
                                type="text"
                                name="insta"/>
                                {errors.insta && <span className='text-sm text-red-600'>{errors.insta.message}</span>}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="X">
                                    X
                                </label>
                                <input
                                {...register('X')  }
                                className='input w-full'
                                type="text"
                                name="X"/>
                                {errors.X && <span className='text-sm text-red-600'>{errors.X.message}</span>}
                            </div>
                        </div>

                        <div className="subHeader2">
                            <h2 className='text-xl mt-7 font-semibold text-gray-700'>Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-5">
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="firstname">
                                    First name
                                </label>
                                <input
                                {...register('firstname')  }
                                className='input w-full'
                                type="text"
                                name="firstname"/>
                                {errors.firstname && <span className='text-sm text-red-600'>{errors.firstname.message}</span>}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="lastname">
                                    Last name
                                </label>
                                <input
                                {...register('lastname')  }
                                className='input w-full'
                                type="text"
                                name="lastname"/>
                                {errors.lastname && <span className='text-sm text-red-600'>{errors.lastname.message}</span>}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="email_address">
                                    Email Address
                                </label>
                                <input
                                {...register('email_address')  }
                                className='input w-full'
                                type="text"
                                name="email_address"/>
                                {errors.email_address && <span className='text-sm text-red-600'>{errors.email_address.message}</span>}
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="phone_number">
                                    Phone
                                </label>
                                <input
                                {...register('phone_number')  }
                                className='input w-full'
                                type="text"
                                name="phone_number"/>
                                {errors.phone_number && <span className='text-sm text-red-600'>{errors.phone_number.message}</span>}
                            </div>
                        </div>
                        <div className='mt-4 flex flex-col space-y-2.5'>
                            <div className='flex flex-col'>
                                <label htmlFor="role_bio">
                                    Role
                                </label>
                                <input
                                {...register('role_bio')  }
                                className='input w-full'
                                type="text"
                                name="role_bio"/>
                                {errors.role && <span className='text-sm text-red-600'>{errors.role.message}</span>}
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor="school">
                                    School
                                </label>
                                <input
                                {...register('school')  }
                                className='input w-full'
                                type="text"
                                name="school"/>
                                {errors.school && <span className='text-sm text-red-600'>{errors.school.message}</span>}
                            </div>
                        </div>

                        <div className="action flex justify-end items-center my-4 space-x-2.5">
                            <button onClick={() => setOpen(false)}
                            className='btn text-gray-700 bg-gray-100 rounded-xl'>Close</button>
                            <button type='submit' disabled={isSubmitting}
                            className='btn bg-blue-700 text-white rounded-xl'>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</button>
                        </div>
                    </form>
                </main>

            </div>
           
        </div>
    )
}

export default EditDirectorInformationModal