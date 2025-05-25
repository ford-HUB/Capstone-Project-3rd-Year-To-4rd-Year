import React from 'react';
import { MoreHorizontal, Calendar, SlidersHorizontal } from 'lucide-react';
import { asset } from '../../assets/asset';

const Timeline = () => {
  const ongoingEvents = [
    "Team Meeting",
    "Project Deadline",
    "Lunch with Clients",
    "Quarterly Review",
    "Product Launch",
    "Training Workshop",
    "Happy Hour",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 pt-12 pl-23 pr-23">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <img src={asset.testProfile} alt="Profile" className="w-full h-full object-cover rounded-full"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Title: Test</h2>
                <p className="text-sm text-gray-600">Date: Pwede Ugma Pwede karon</p>
                <p className="text-sm text-gray-600 mt-1">Description: Testing</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 gap-4 mb-5 pl-30 pr-30">
            {/* Large photos on top */}
            <div className="bg-gray-300 h-70 rounded"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pl-30 pr-30">
            {/* Small photos on bottom */}
            <div className="bg-gray-300 h-70 rounded"></div>
            <div className="bg-gray-300 h-70 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    
    
  );
};

export default Timeline;