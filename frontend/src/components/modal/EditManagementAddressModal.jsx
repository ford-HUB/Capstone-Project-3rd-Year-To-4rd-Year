import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AddressSchema } from '../../forms/managementSchema.js';
import { CircleX } from 'lucide-react';

const EditManagementAddressModal = ({ open, setOpen, mode, currentInfo, onComplete }) => {
    const isEdit = mode === 'edit'

    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            province: '',
            city: '',
            postal_code: '',
            brgy: ''
        }
    })

    React.useEffect(() => {
        if(open) {
            reset({
                province: isEdit ? currentInfo.province : '',
                city: isEdit ? currentInfo.city : '',
                postal_code: isEdit ? currentInfo.postal_code : '',
                brgy: isEdit ? currentInfo.brgy : ''
            })
        }
    }, [open, currentInfo, isEdit, reset])

    if(!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl flex flex-col">
                <header className="flex flex-col sticky top-0">
                    <div className='inline-flex items-center justify-between mb-4'>
                        <h1 className="font-semibold text-2xl">Edit Address</h1>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            <CircleX className='relative top-0 h-10 w-10 cursor-pointer'/>
                        </button>
                    </div>
                    <span className='text-sm text-gray-500'>Update your details to keep your profile up to date.</span>
                </header>

                <main>
                    <form onSubmit={handleSubmit(onComplete)}>
                        <div className="grid grid-cols-2 gap-6 mt-5">
                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="Province">
                                Province
                            </label>
                            <input
                            {...register('province')  }
                            className='input w-full'
                            type="text"
                            name="province"/>
                            { errors.province && <span className='text-sm text-red-600'>{errors.province.message}</span> }
                        </div>
                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="City">
                                City
                            </label>
                            <input
                            {...register('city')  }
                            className='input w-full'
                            type="text"
                            name="city"/>
                            { errors.city && <span className='text-sm text-red-600'>{errors.city.message}</span> }
                        </div>
                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="postal_code">
                                Postal Code
                            </label>
                            <input
                            {...register('postal_code')  }
                            className='input w-full'
                            type="text"
                            name="postal_code"/>
                            { errors.postal_code && <span className='text-sm text-red-600'>{errors.postal_code.message}</span> }
                        </div>
                        <div className='flex flex-col space-y-1.5'>
                            <label htmlFor="Barangay">
                                Barangay
                            </label>
                            <input
                            {...register('brgy')  }
                            className='input w-full'
                            type="text"
                            name="brgy"/>
                            { errors.brgy && <span className='text-sm text-red-600'>{errors.brgy.message}</span> }
                        </div>
                    </div>
                    <div className="action flex justify-end items-center mt-4 space-x-2.5">
                        <button onClick={() => setOpen(false)}
                        className='btn text-gray-700 bg-gray-100 rounded-xl'>Close</button>
                        <button disabled={isSubmitting}
                        className='btn bg-blue-700 text-white rounded-xl'>
                            { isSubmitting ? 'Saving...' : 'Save Changes' }
                        </button>
                    </div>
                    </form>
                </main>

            </div>
           
        </div>
    )
}

export default EditManagementAddressModal