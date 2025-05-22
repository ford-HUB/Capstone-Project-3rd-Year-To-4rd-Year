import React from 'react'
import { X } from 'lucide-react'
import { asset } from '../../assets/asset'

const StaffRegistration = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
                  <div className="logo flex justify-between">
                    <div className="flex">
                      <img
                      src={asset.logo}
                      alt="logo"
                      className=" flex items-center h-12 w-12"
                    />
                    <img
                      src={asset.uclmLogo}
                      alt="logo"
                      className=" flex items-center h-12 w-12"
                    />
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

                  <form className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      <div>
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Staff ID Number *
                        </label>
                        <div className="errorCatcher"></div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                          <label
                            htmlFor="studentId"
                            className="block text-sm font-medium text-gray-700 mb-2">
                              Email *
                            </label>
                            <div className="errorCatcher"></div>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="Firstname" className='font-medium text-gray-700'>First name</label>
                          <input type="text" className='input focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500' />
                        </div>

                        <div>
                          <label htmlFor="Lastname" className='font-medium text-gray-700'>Last name</label>
                          <input type="text" className='input focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500' />
                        </div>

                        <div>
                          <label htmlFor="Initial" className='font-medium text-gray-700'>Initial</label>
                          <input type="text" className='input focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Position *
                          </label>
                          <select
                            id="department"
                            name="department"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option disabled value={''}>Select Position</option>
                            <option value="">Lead Organizer</option>
                            <option value="">Event Coordinator</option>
                            <option value="">Volunteer Manager</option>
                            <option value="">Technical Support</option>
                            <option value="">Financial Officer</option>
                            <option value="">Donor Relations Officer </option>
                            <option value="">Certificate Manager</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Gender
                          </label>
                          <fieldset className="fieldset border-base-300 rounded-box w-64 border py-2 px-2 bg-white">
                            <label className="label text-gray-500">
                              <input
                              type="radio"
                              value={'M'}
                              name="male"
                              className="radio bg-white"
                              defaultChecked/>
                              Male
                            </label>
                            <label className="label text-gray-500">
                              <input
                              type="radio"
                              value={'F'}
                              name="male"
                              className="radio bg-white" />
                              Female
                            </label>

                            <label className="label text-gray-500">
                              <input
                              type="radio"
                              value={'N'}
                              name="male"
                              className="radio bg-white" />
                              Prefer not to say
                            </label>
                          </fieldset>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
                      <div>
                        <label htmlFor="ContactUs">Contact Number</label>
                        <input type="text" className='input w-full focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500'/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="ContactUs">Password</label>
                        <input type="text" className='input focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500'/>
                      </div>

                      <div>
                        <label htmlFor="ContactUs">Confirm Password</label>
                        <input type="text" className='input focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500'/>
                      </div>
                    </div>


                    <div className="text-center">
                      <button type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Register
                      </button>
                    </div>
                  </form>
          </div>
        </div>          
                  
    </>
  )
}

export default StaffRegistration