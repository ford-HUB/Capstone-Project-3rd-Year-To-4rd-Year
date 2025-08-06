import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const EventItem = () => {
  const events = [
    {
      id: 1,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Ongoing",
      avatar: "🎯"
    },
    {
      id: 2,
      name: "Digital Marketing Submit",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Draft",
      avatar: "👨‍💼"
    },
    {
      id: 3,
      name: "PHP Advanced Learning",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Closed",
      avatar: "🔧"
    },
    {
      id: 4,
      name: "Corona Awareness Event",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Ongoing",
      avatar: "🦠"
    },
    {
      id: 5,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Draft",
      avatar: "🎯"
    },
    {
      id: 6,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Closed",
      avatar: "🎯"
    },
    {
      id: 7,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Ongoing",
      avatar: "🎯"
    },
    {
      id: 8,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Draft",
      avatar: "🎯"
    },
    {
      id: 9,
      name: "National Seminar",
      startDate: "Wed, Dec 17,2019",
      startTime: "( 7:30 PM )",
      endDate: "Wed, Dec 17,2019",
      endTime: "( 7:30 PM )",
      registered: 51,
      approved: "10/51",
      status: "Closed",
      avatar: "🎯"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Draft':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Closed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 rounded-t-lg border-b text-sm font-medium text-gray-600">
        <div>EVENT NAME</div>
        <div>START DATE</div>
        <div>END DATE</div>
        <div>SUM OF REGISTERED</div>
        <div>NUM OF APPROVED REGISTERED</div>
        <div>STATUS</div>
        <div>ACTION</div>
      </div>

      {/* Event List */}
      <div className="divide-y divide-gray-100">
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
            {/* Event Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm">
                {event.avatar}
              </div>
              <span className="text-sm font-medium text-gray-900">{event.name}</span>
            </div>

            {/* Start Date */}
            <div className="text-sm text-gray-600">
              <div>{event.startDate}</div>
              <div className="text-xs text-gray-500">{event.startTime}</div>
            </div>

            {/* End Date */}
            <div className="text-sm text-gray-600">
              <div>{event.endDate}</div>
              <div className="text-xs text-gray-500">{event.endTime}</div>
            </div>

            {/* Sum of Registered */}
            <div className="text-sm text-gray-900 font-medium">
              {event.registered}
            </div>

            {/* Approved Registered */}
            <div className="text-sm text-gray-900 font-medium">
              {event.approved}
            </div>

            {/* Status */}
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Phone size={16} />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-500">
          Displaying <span className="font-medium">25</span> Out of <span className="font-medium">1300</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">125 - 150</span>
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;