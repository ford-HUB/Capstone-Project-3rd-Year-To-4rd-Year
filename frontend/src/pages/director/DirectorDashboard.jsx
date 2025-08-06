import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidebarPanel';
import { Users, Calendar, Clock, ChevronRight, MessageSquare } from 'lucide-react';

const DirectorDashboard = () => {
    const stats = {
        totalEvents: 24,
        totalParticipants: 156,
        totalFeedback: 89,
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
                message: "New event feedback received for Community Outreach Program",
                time: "5 minutes ago",
                read: false
            },
            {
                id: 2,
                type: "message",
                message: "New feedback report available for Health Awareness Seminar",
                time: "1 hour ago",
                read: false
            },
            {
                id: 3,
                type: "event",
                message: "Monthly performance report is ready for review",
                time: "2 hours ago",
                read: true
            }
        ]
    };

    return (
        <div className="p-6 bg-gray-50 pt-20 pl-8">
            <div className="flex flex-col md:flex-row gap-4">
    
                <div className="flex-1 flex flex-col md:flex-row gap-4 ml-12 pl-4 pt-4">
                    {/* Main Content */}
                    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-2/3 max-h-[600px] overflow-y-auto">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm">Total Feedback</p>
                                        <h3 className="text-3xl font-bold mt-1">{stats.totalFeedback}</h3>
                                    </div>
                                    <MessageSquare className="w-12 h-12 text-green-200" />
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
                                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {event.date}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {event.time}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {event.participants} participants
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            event.status === 'upcoming' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Mark all as read
                                </button>
                            </div>
                            <div className="space-y-4">
                                {stats.notifications.map((notification) => (
                                    <div key={notification.id} className={`p-4 rounded-lg ${
                                        notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${
                                                notification.type === 'event' 
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-purple-100 text-purple-600'
                                            }`}>
                                                {notification.type === 'event' ? (
                                                    <Calendar className="w-5 h-5" />
                                                ) : (
                                                    <MessageSquare className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-800">{notification.message}</p>
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

export default DirectorDashboard; 