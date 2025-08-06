import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDirectorInfoSchema } from '../../forms/DirectorSchema.js';
import { CircleX } from 'lucide-react';

const EditStaffInformationModal = ({ open, setOpen, mode, currentInfo = [], onComplete }) => {
    const isEdit = mode === 'edit'


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
                    <form onSubmit={null}>
                        {/* <div className="subHeader1">
                        <h2 className='text-xl mt-7 font-semibold text-gray-700'>Social Links</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-5">
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="facebook">
                                    Facebook
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="facebook"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="linkedin">
                                    LinkedIn
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="linkedin"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="insta">
                                    Instagram
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="insta"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="X">
                                    X
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="X"/>
                            </div>
                        </div> */}

                        <div className="subHeader2">
                            <h2 className='text-xl mt-7 font-semibold text-gray-700'>Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-5">
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="firstname">
                                    First name
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="firstname"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="lastname">
                                    Last name
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="lastname"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="lastname">
                                    Middle Initial
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="lastname"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="lastname">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name='gender'
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500`}>
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="email_address">
                                    Email Address
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="email_address"/>
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <label htmlFor="phone_number">
                                    Phone
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="phone_number"/>
                            </div>
                        </div>
                        <div className='mt-4 flex flex-col space-y-2.5'>
                            <div className='flex flex-col'>
                                <label htmlFor="role">
                                    Role
                                </label>
                                <input
                                className='input w-full'
                                type="text"
                                name="role"/>
                            </div>
                        </div>

                        <div className="action flex justify-end items-center my-4 space-x-2.5">
                            <button onClick={() => setOpen(false)}
                            className='btn text-gray-700 bg-gray-100 rounded-xl'>Close</button>
                            <button type='submit'
                            className='btn bg-blue-700 text-white rounded-xl'>Save Changes</button>
                        </div>
                    </form>
                </main>

            </div>
           
        </div>
    )
}

export default EditStaffInformationModal