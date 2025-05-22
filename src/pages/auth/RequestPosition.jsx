import React from 'react'
import { X } from 'lucide-react'
import { asset } from '../../assets/asset'

const RequestPosition = () => {
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
                Request Approval Registration Form
              </h2>
            </div>

            <div className='content'>
                <p className="text-gray-600 mb-6">
                    To proceed with your registration, please click the button below to send a request to the administrator.
                </p>


                <form className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Your Email Address
                    </label>
                    <input
                        type="email"
                        required
                        className="input outline-none border-none mt-1 block w-full focus:border-none focus:outline-none"
                        placeholder="Staff@gmail.com"
                    />
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                    Send Request for Approval
                    </button>
                </form>
            </div>

          </div>
        </div>
    </>
  )
}

export default RequestPosition