import React from 'react';
import { MoreHorizontal, Calendar, SlidersHorizontal } from 'lucide-react';

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
      <div className="flex-1 p-6 pl-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Title</h2>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="text-sm text-gray-600 mt-1">Description</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Large photos on top */}
            <div className="bg-gray-300 h-40 rounded"></div>
            <div className="bg-gray-300 h-40 rounded"></div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {/* Small photos on bottom */}
            <div className="bg-gray-300 h-20 rounded"></div>
            <div className="bg-gray-300 h-20 rounded"></div>
            <div className="bg-gray-300 h-20 rounded"></div>
            <div className="bg-gray-300 h-20 rounded"></div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 p-6">
        <div className="space-y-4">
          {/* Filters Button */}
          <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>

          {/* On Going Events */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">On Going Events</h3>
            </div>
            
            <div className="space-y-2">
              {ongoingEvents.map((event, index) => (
                <div key={index} className="text-sm text-gray-600 py-1 hover:text-gray-900 cursor-pointer">
                  {event}
                </div>
              ))}
            </div>
            
            <button className="text-blue-600 text-sm mt-3 hover:text-blue-800">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;