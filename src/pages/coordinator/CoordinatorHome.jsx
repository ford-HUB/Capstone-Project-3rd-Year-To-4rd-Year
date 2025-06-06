import React from 'react';
import CoordinatorSidePanel from '../../components/coordinator/CoordinatorSidePanel';
import { Users, Calendar, Clock, ChevronRight, Bell, MessageSquare } from 'lucide-react';

const CoordinatorHome = () => {
    // Temporary data for statistics
    const stats = {
        totalEvents: 24,
        totalParticipants: 156,
        recentEvents: [
            {
                id: 1,
                title: "Community Outreach Program",
                date: "May 28",
                time: "9:00 AM",
                participants: 45,
                status: "upcoming"
            },
            {
                id: 2,
                title: "Health Awareness Seminar",
                date: "May 25",
                time: "2:00 PM",
                participants: 32,
                status: "completed"
            },
            {
                id: 3,
                title: "Youth Leadership Workshop",
                date: "May 20",
                time: "10:00 AM",
                participants: 28,
                status: "completed"
            }
        ],
        notifications: [
            {
                id: 1,
                type: "event",
                message: "New participant registered for Community Outreach Program",
                time: "5 minutes ago",
                read: false
            },
            {
                id: 2,
                type: "message",
                message: "New message from John Doe regarding Health Awareness Seminar",
                time: "1 hour ago",
                read: false
            },
            {
                id: 3,
                type: "event",
                message: "Youth Leadership Workshop has been completed successfully",
                time: "2 hours ago",
                read: true
            }
        ]
    };

    // Calendar data
    const calendarEvents = [
        { date: 28, event: "Community Outreach" },
        { date: 25, event: "Health Seminar" },
        { date: 20, event: "Leadership Workshop" }
    ];

    return (
        <div className="p-6 bg-gray-50 pt-20">
            <div className="flex flex-col md:flex-row gap-4">
                <CoordinatorSidePanel />
                
                <div className="flex-1 flex flex-col md:flex-row gap-4 ml-12">
                    {/* Main Content */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-2/3 max-h-[600px] overflow-y-auto">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Events</p>
                                        <h3 className="text-3xl font-bold mt-1">{stats.totalEvents}</h3>
                                    </div>
                                    <Calendar className="w-12 h-12 text-blue-200" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Total Participants</p>
                                        <h3 className="text-3xl font-bold mt-1">{stats.totalParticipants}</h3>
                                    </div>
                                    <Users className="w-12 h-12 text-purple-200" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Events Section */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Recent Events</h2>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {stats.recentEvents.map((event) => (
                                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{event.title}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{event.participants} participants</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                event.status === 'upcoming' 
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Content */}
                    <div className="w-full md:w-1/3 space-y-4">
                        {/* Mini Calendar */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">May 2024</h2>
                            <div className="grid grid-cols-7 gap-2 text-center mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-sm font-medium text-gray-500">{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(date => {
                                    const hasEvent = calendarEvents.some(event => event.date === date);
                                    return (
                                        <div
                                            key={date}
                                            className={`p-2 text-center text-sm rounded-full cursor-pointer hover:bg-gray-100 ${
                                                hasEvent ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                                            }`}
                                        >
                                            {date}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Notifications Preview */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {stats.notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-3 rounded-lg border ${
                                            notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${
                                                notification.type === 'event' ? 'bg-blue-100' : 'bg-purple-100'
                                            }`}>
                                                {notification.type === 'event' ? (
                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <MessageSquare className="w-4 h-4 text-purple-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorHome; 