import React from 'react'
import MapBase from '../../components/maps/MapBase'
import { MapPin } from 'lucide-react'

const GoogleMap = () => {
  return (
    <div className=''>
        <header className=''>
            <nav className='m-3 flex justify-between'>
                <h1 className='text-2xl'>View Event Locations</h1>
                <div className="action inline-flex space-x-3 px-4">
                    <button className='inline-flex cursor-pointer border border-gray-300 items-center btn text-gray-600'>
                        <MapPin className='h-5 w-5 text-blue-600'/> Today
                    </button>
                    <button className='inline-flex cursor-pointer border border-gray-300 items-center btn'>
                        <MapPin className='h-5 w-5 text-red-600'/> Records
                    </button>
                </div>
            </nav>
        </header>
        <div className="map m-2">
            <MapBase apiKey={`AIzaSyCEQsVw4qcO0aXTHQySvAj2VMgv9YcEzkM`}/>
        </div>
    </div>
  )
}

export default GoogleMap