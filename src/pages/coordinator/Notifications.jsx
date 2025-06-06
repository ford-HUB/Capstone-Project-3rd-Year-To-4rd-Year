import React from 'react';
import { Bell, MessageSquare, Calendar, Check, Trash2, Filter } from 'lucide-react';
import CoordinatorSidePanel from '../../components/coordinator/CoordinatorSidePanel';

const Notifications = () => {
  // Temporary data for notifications
  const notifications = [
    {
      id: 1,
      type: "event",
      title: "New Participant Registration",
      message: "John Doe has registered for Community Outreach Program",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Sarah Smith sent you a message regarding Health Awareness Seminar",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      type: "event",
      title: "Event Completed",
      message: "Youth Leadership Workshop has been completed successfully",
      time: "2 hours ago",
      read: true
    },
    {
      id: 4,
      type: "event",
      title: "Event Reminder",
      message: "Community Outreach Program starts in 2 days",
      time: "1 day ago",
      read: true
    }
  ];

  return (
    <div className="p-6 bg-gray-50 pt-20">
      <div className="flex flex-col md:flex-row gap-4">
        <CoordinatorSidePanel />
        
        {/* Main Content */}
        <div className="flex-1 ml-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 mt-1">Manage your notifications and stay updated</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      notification.type === 'event' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {notification.type === 'event' ? (
                        <Calendar className="w-6 h-6 text-blue-600" />
                      ) : (
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          <button className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-6 text-center">
              <button className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 