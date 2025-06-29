import React from 'react'
import { X } from 'lucide-react'
import { asset } from '../../assets/asset'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staffRegistrationSchema } from '../../forms/StaffSchema.js'
import { useDepartment } from '../../context/useDepartmentContext.jsx'
import { useAuthHooks } from '../../hooks/staff/useAuthHooks.js'
import { useNavigate, useParams } from 'react-router-dom'


const StaffRegistration = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { departmentCourses } = useDepartment()
  const { signup } = useAuthHooks()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(staffRegistrationSchema),
    defaultValues: {
      staff_id_number: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: '',
      middle_initial: '',
      position: '',
      gender: '',
      phoneNumber: '',
      department: ''
    }
  })

  const position = [
    { id: 1, name: 'Lead Organizer', value: 'Lead Organizer' },
    { id: 2, name: 'Event Coordinator', value: 'Event Coordinator' },
    { id: 3, name: 'Volunteer Manager', value: 'Volunteer Manager'},
    { id: 4, name: 'Technical Support', value: 'Technical Support'},
    { id: 5, name: 'Financial Officer', value: 'Financial Officer'},
    { id: 6, name: 'Donor Relations Officer', value: 'Donor Relations Officer' },
    { id: 7, name: 'Certificate Manager', value: 'Certificate Manager' }
  ]

  const onSubmitForm = async (formData) => {
    const success = await signup(token, formData)
    console.log(formData)
    if(!success) return
      navigate('/')

  }

  return (
    <>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
                  <div className="logo flex justify-between">
                    <div className="flex">
                      <img src={asset.logo} alt="logo" className=" flex items-center h-12 w-12"/>
                      <img src={asset.uclmLogo} alt="logo" className=" flex items-center h-12 w-12" />
                    </div>
      
                    <div>
                      <a href='/'><X/></a>
                    </div>
                  </div>
      
                  <div className="header flex justify-center items-center pb-8">
                    {" "}
                    <h2 className="text-2xl flex font-bold text-gray-800 text-center">
                      Staff Registration Form
                    </h2>
                  </div> 

                  <form className='space-y-6' onSubmit={handleSubmit(onSubmitForm)}>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div>
                        <label
                          htmlFor="staff_id_number"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Staff ID Number *
                        </label>
                        <input
                          type="text"
                          id='staff_id_number'
                          name='staff_id_number'
                          {...register('staff_id_number')  }
                          className={`w-full px-3 py-2 border ${errors.staff_id_number ? 'border-red-500' : 'border-gray-300'} rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        
                        />
                          {errors.staff_id_number && <p className="text-red-500 text-sm mt-1">{errors.staff_id_number.message}</p>}
                      </div>

                      <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <input
                              type="email"
                              id='email'
                              name='email'
                              {...register('email')  }
                              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="Firstname" className='font-medium text-gray-700'>First name *</label>
                          <input
                          type="text"
                          name='firstname'
                          id='firstname'
                          {...register('firstname')  }
                          className={`input focus:outline-none ${errors.firstname ? 'border-red-500' : 'border-gray-300'} focus:border-none focus:ring-2 focus:ring-blue-500`} />
                          {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="Lastname" className='font-medium text-gray-700'>Last name *</label>
                          <input
                          type="text"
                          name='lastname'
                          id='lastname'
                          {...register('lastname') }
                          className={`input focus:outline-none ${errors.lastname ? 'border-red-500' : 'border-gray-300'} focus:border-none focus:ring-2 focus:ring-blue-500`} />
                          {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="middlename" className='font-medium text-gray-700'>Middle Initial *</label>
                          <input
                          type="text"
                          name='middle_initial'
                          id='middle_initial'
                          {...register('middle_initial')  }
                          className={`input focus:outline-none ${errors.middle_initial ? 'border-red-500' : 'border-gray-300'} focus:border-none focus:ring-2 focus:ring-blue-500`} />
                          {errors.middle_initial && <p className="text-red-500 text-sm mt-1">{errors.middle_initial.message}</p>}

                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium text-gray-700 mb-2">
                            Position *
                          </label>

                          <select
                            id="position"
                            name="position"
                            {...register('position')  }
                            className={`w-full px-3 py-2 border  ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                            <option value={''} disabled>Select Position</option>
                            {
                              position.map((position) => <option key={position.id} value={position.value}>{position.name}</option>)
                            }
                          </select>
                          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                        </div>

                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                            Department *
                          </label>
                          
                          <select
                            id="department"
                            {...register('department')}
                            className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="" disabled>Select Department</option>
                            {Object.keys(departmentCourses).map((department) => (
                              <option key={department} value={department}>{department}</option>
                            ))}
                          </select>
                          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-2 gap-2'>
                      <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                            Gender *
                          </label>
                          <select
                            id="gender"
                            name='gender'
                            {...register('gender')  }
                            className={`w-full px-3 py-2 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                            <option value="" disabled>Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                          </select>
                          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                        </div>

                      <div>
                        <label htmlFor="phoneNumber" className='block text-sm font-medium text-gray-700 mb-2'>Contact Number *</label>
                        <input
                        type="text"
                        id='phoneNumber'
                        name='phoneNumber'
                        {...register('phoneNumber')  }
                        className={`input py-2 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500`}/>
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">

                      <div>
                        <label htmlFor="Password">Password *</label>
                        <input
                        type="password"
                        id='password'
                        name='password'
                        {...register('password')  }
                        className={`input focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-none focus:ring-2 focus:ring-blue-500`}/>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                        type="password"
                        id='confirmPassword'
                        name='confirmPassword'
                        {...register('confirmPassword')  }
                        className={`input focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-none focus:ring-2 focus:ring-blue-500`}/>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        { isSubmitting ? 'Register...': 'Register' }
                      </button>
                    </div>
                  </form>
                </div>
      </div>          
                  
    </>
  )
}

export default StaffRegistration