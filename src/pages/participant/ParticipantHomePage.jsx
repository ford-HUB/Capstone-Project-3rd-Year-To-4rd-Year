import React from "react"
import SideBar from "../../components/participant/SideBar";
import { asset } from '../../assets/asset';

const ParticipantHomePage = () => {
  return (
    <>
        <div className="homeContainer bg-gray-200 min-h-screen flex">
          <div className="m-2">
            <SideBar/>
          </div> 
          
          <div className="flex-1 p-6">
            <h2 className="text-4xl font-bold text-gray-800 pb-2">Event Started</h2>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 bg-gray">
                  <div className="flex items-center gap-6 mb-4">                 
                    <div>               
                      <p className="text-l font-semibold text-gray-600">Event Title</p>
                    </div>
                    <p className="text-sm text-gray-600">Started At 9:30 Am</p>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <div className="w-70 h-50 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={asset.impactPic1}
                          alt="Event" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-2 pr-42">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-m font-medium transition-colors">
                        Participants
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-m font-medium transition-colors">
                        Organizer
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-m font-medium transition-colors">
                        Location
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-full flex items-center justify-center pr-36 pt-28">
                  <div className="w-full h-full rounded-lg flex items-center justify-center">
                    <img 
                      src={asset.megaphone}
                      alt="megaphone" 
                      className="absolute w-95 h-95 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Next Event</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={asset.fourThree}
                    alt="Next Event 1" 
                    className="w-full h-50 object-cover"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={asset.fourOne} 
                    alt="Next Event 2" 
                    className="w-full h-50 object-cover"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    src={asset.fourTwo}
                    alt="Next Event 3" 
                    className="w-full h-50 object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Up Coming Events</h2>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  Total 0 result
                </button>
              </div>
              
              <div className="text-gray-600 text-sm">
                <p>View all upcoming events and mark your calendar for important dates.</p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default ParticipantHomePage