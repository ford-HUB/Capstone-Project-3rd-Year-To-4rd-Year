import React from 'react'
import { Calendar, Clock, Users, ChevronRight  } from 'lucide-react';

const ParticipantUpcomingEvent = () => {
    // Temporary data for upcoming events
    const upcomingEvents = [
        {
        id: 1,
        title: "Addiction Seminar",
        date: "May 28",
        time: "1:00 PM",
        participants: 22,
        type: "School",
        priority: "high"
        },
        {
        id: 2,
        title: "Tabang sa mayaman event",
        date: "May 29",
        time: "3:00 PM",
        participants: 30,
        type: "Program",
        priority: "medium"
        },
        {
        id: 3,
        title: "Community Free Foods",
        date: "May 30",
        time: "10:00 AM",
        participants: 45,
        type: "Program",
        priority: "high"
        }
    ];


  return (
    <>
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                    Total {upcomingEvents.length} results
                </span>
            </div>

            <div className="space-y-3">
            {upcomingEvents.map((event, _i) => (
                <div 
                key={event.id} 
                className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.priority === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {event.type}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{event.participants}</span>
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-color opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-200">
                        Remind Me
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                </div>
                </div>
            ))}
            </div>

            {/* View All Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                <Calendar className="w-4 h-4" />
                View Full Event Calendar
            </button>
            </div>
        </div>
    </>
  )
}

export default ParticipantUpcomingEvent