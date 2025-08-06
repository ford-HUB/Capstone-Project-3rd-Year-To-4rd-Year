import React from 'react';
import { Plus, Search, Filter, Calendar, Users, MapPin, Clock } from 'lucide-react';
import CoordinatorSidePanel from '../../components/coordinator/CoordinatorSidePanel';

const ManageEvents = () => {
  // Temporary data for events
  const events = [
    {
      id: 1,
      title: "Community Outreach Program",
      date: "May 28, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "UCLM Campus",
      participants: 45,
      status: "upcoming",
      type: "Community Service"
    },
    {
      id: 2,
      title: "Health Awareness Seminar",
      date: "May 25, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "UCLM Auditorium",
      participants: 32,
      status: "completed",
      type: "Seminar"
    },
    {
      id: 3,
      title: "Youth Leadership Workshop",
      date: "May 20, 2024",
      time: "10:00 AM - 3:00 PM",
      location: "UCLM Conference Room",
      participants: 28,
      status: "completed",
      type: "Workshop"
    }
  ];

  return (
    <div className="p-6 bg-gray-50 pt-24 pl-12">
      <div className="flex flex-col md:flex-row gap-4">
        <CoordinatorSidePanel />
        
        {/* Main Content */}
        <div className="flex-1 ml-12">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mt-2">
                        {event.type}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'upcoming' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                    <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                      Edit Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents; 