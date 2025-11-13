import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import dayjs from 'dayjs';

const BeneficiaryRegisteredEvents = () => {
    // This would be populated from the beneficiary event store
    const registeredEvents = [
        {
            id: 1,
            title: "Community Health Outreach",
            date: "2024-02-15T09:00:00Z",
            location: "Community Center",
            status: "registered"
        },
        {
            id: 2,
            title: "Food Distribution Program",
            date: "2024-02-20T10:00:00Z",
            location: "Local Church",
            status: "registered"
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Registered Events</h2>
            
            {registeredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No registered events</h3>
                    <p className="text-gray-600">You haven't registered for any events yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {registeredEvents.map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{event.title}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{dayjs(event.date).format('MMM D, YYYY')}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{dayjs(event.date).format('h:mm A')}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        event.status === 'registered' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BeneficiaryRegisteredEvents;
