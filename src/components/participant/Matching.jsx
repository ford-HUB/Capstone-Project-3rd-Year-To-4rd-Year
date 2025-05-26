import React from 'react'
import ListTopParticipants from './ListTopParticipants'

const Matching = () => {
  return (
    <>
        <div className="innerContainer border border-gray-300 rounded-2xl m-4 p-2">
                <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                    🎮  Let's Start Participating!
                </h1>
                    
                <p className="text-sm text-gray-600 mb-6">Join the current match and earn certificates for your achievements.</p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl w-full text-lg font-bold transition">
                    Start Match
                </button>
            </div>
        <div className="m-4">
            <ListTopParticipants />
        </div>
    </>
  )
}

export default Matching