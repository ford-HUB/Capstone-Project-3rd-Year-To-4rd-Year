import React from 'react'
import ListTopParticipants from './ListTopParticipants.jsx'
import { useAuthStore } from '../../store/participant/useAuthStore.js'

const Matching = () => {


  return (
    <>
        <div className="innerContainer border border-gray-300 rounded-2xl m-4 p-2">
                <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                    🗓️ View Event Calendar
                </h1>
                    
                <p className="text-sm text-gray-600 mb-6">Check the upcoming events and never miss a chance to join exciting matches and earn certificates!</p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl w-full text-lg font-bold transition">
                    See Now
                </button>
            </div>
        {/* <div className="m-4">
            <ListTopParticipants />
        </div> */}
    </>
  )
}

export default Matching