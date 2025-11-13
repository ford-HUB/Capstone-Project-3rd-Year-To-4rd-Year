import { useState } from 'react';
import { Bell, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const NotificationsManagement = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Participant Registration',
      message: 'John Doe has registered for the Community Cleanup Drive.',
      type: 'info',
      timestamp: '2024-03-15T10:30:00',
      read: false
    },
    {
      id: 2,
      title: 'Event Update',
      message: 'The location for "Tree Planting Activity" has been changed.',
      type: 'warning',
      timestamp: '2024-03-15T09:15:00',
      read: true
    },
    {
      id: 3,
      title: 'Program Completed',
      message: 'Community Service Program has been successfully completed.',
      type: 'success',
      timestamp: '2024-03-14T16:45:00',
      read: false
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-4">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800">
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              !notification.read ? 'border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {notification.title}
                </h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No notifications to display</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement; 