import { useState } from 'react';
import {
  Users,
  Calendar,
  ClipboardList,
  Bell,
  TrendingUp,
  Clock,
  Award,
  UserCheck,
  ChevronRight,
  Activity,
  FileText,
  MapPin,
  UserPlus,
  ChevronLeft,
  X,
  Star
} from 'lucide-react';
import { asset } from '../../assets/asset';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onJoin, onClick }) => (
  <div 
    className="flex gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => onClick(event)}
  >
    <img
      src={event.image}
      alt={event.title}
      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-sm truncate">{event.title}</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          event.type === 'Environmental' ? 'bg-green-100 text-green-800' :
          event.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
          event.type === 'Health' ? 'bg-red-100 text-red-800' :
          event.type === 'Leadership' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.type}
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking join button
            onJoin(event.id);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${
            event.isJoined
              ? 'bg-gray-100 text-gray-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={event.isJoined}
        >
          {event.isJoined ? 'Joined' : 'Join Event'}
        </button>
      </div>
    </div>
  </div>
);

const CalendarEventCard = ({ event, onClick }) => (
  <div 
    className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
    onClick={() => onClick(event)}
  >
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        event.type === 'Environmental' ? 'bg-green-500' :
        event.type === 'Educational' ? 'bg-blue-500' :
        event.type === 'Health' ? 'bg-red-500' :
        event.type === 'Leadership' ? 'bg-purple-500' :
        'bg-gray-500'
      }`}></div>
      <span className="text-sm font-medium truncate">{event.title}</span>
    </div>
    <div className="ml-4 mt-1 text-xs text-gray-500 flex items-center justify-between">
      <span>{event.date}</span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
        {event.participants}/{event.maxParticipants}
      </span>
    </div>
  </div>
);

const CalendarWidget = ({ events, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDayEvents = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Environmental':
        return 'bg-green-500';
      case 'Educational':
        return 'bg-blue-500';
      case 'Health':
        return 'bg-red-500';
      case 'Leadership':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
        <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="font-medium">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {previousMonthDays.map((_, index) => (
          <div key={`prev-${index}`} className="h-8 text-center text-gray-400"></div>
        ))}
        {days.map(day => {
          const dayEvents = getDayEvents(day);
          const isSelected = selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === currentMonth && 
            selectedDate.getFullYear() === currentYear;
          
          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(currentYear, currentMonth, day))}
              className={`h-8 flex flex-col items-center justify-center relative rounded-lg
                ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                ${dayEvents.length > 0 ? 'font-medium' : ''}
              `}
            >
              <span className="text-sm">{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {dayEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ParticipantCard = ({ participant }) => (
  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="relative">
      <img
        src={participant.avatar}
        alt={participant.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
        <Star size={12} className="text-white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-sm truncate">{participant.name}</h4>
      <p className="text-xs text-gray-600">Active Member</p>
    </div>
    <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
      <Award size={14} />
      <span>{participant.eventsJoined} events</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats] = useState({
    totalVolunteers: 1234,
    activePrograms: 12,
    upcomingEvents: 5,
    notifications: 3,
    totalHours: 2456,
    completedTasks: 89
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'volunteer_joined',
      message: 'New volunteer registration: Maria Santos',
      timestamp: '2 minutes ago',
      color: 'blue'
    },
    {
      id: 2,
      type: 'event_updated',
      message: 'Event "Community Cleanup" location updated',
      timestamp: '1 hour ago',
      color: 'green'
    },
    {
      id: 3,
      type: 'program_completed',
      message: 'Program "Youth Mentorship" completed',
      timestamp: '3 hours ago',
      color: 'purple'
    },
    {
      id: 4,
      type: 'milestone_achieved',
      message: 'Reached 1000+ volunteer hours this month',
      timestamp: '1 day ago',
      color: 'yellow'
    }
  ]);

  const [topVolunteers] = useState([
    {
      id: 1,
      name: 'John Doe',
      hours: 156,
      department: 'Computer Studies',
      tasks: 23
    },
    {
      id: 2,
      name: 'Jane Smith',
      hours: 142,
      department: 'Engineering',
      tasks: 19
    },
    {
      id: 3,
      name: 'Mike Johnson',
      hours: 128,
      department: 'Medicine',
      tasks: 17
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'Environmental Awareness Workshop',
      date: '2025-06-05',
      location: 'Main Campus Auditorium',
      participants: 35,
      maxParticipants: 50,
      isJoined: false,
      type: 'Environmental',
      image: asset.cleanupDrive,
      description: 'Learn about environmental conservation and sustainable practices.'
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      date: '2025-06-12',
      location: 'Technology Center',
      participants: 42,
      maxParticipants: 50,
      isJoined: false,
      type: 'Educational',
      image: asset.cleanupDrive,
      description: 'Explore the latest technological innovations and their impact on society.'
    },
    {
      id: 3,
      title: 'Community Health Fair',
      date: '2025-06-15',
      location: 'University Gymnasium',
      participants: 28,
      maxParticipants: 40,
      isJoined: false,
      type: 'Health',
      image: asset.cleanupDrive,
      description: 'Free health screenings and wellness education for the community.'
    },
    {
      id: 4,
      title: 'Youth Leadership Conference',
      date: '2025-06-20',
      location: 'Student Center',
      participants: 38,
      maxParticipants: 45,
      isJoined: false,
      type: 'Leadership',
      image: asset.cleanupDrive,
      description: 'Developing future leaders through workshops and mentoring.'
    },
    {
      id: 5,
      title: 'Coastal Cleanup Drive',
      date: '2025-06-25',
      location: 'City Beach',
      participants: 55,
      maxParticipants: 75,
      isJoined: false,
      type: 'Environmental',
      image: asset.cleanupDrive,
      description: 'Join us in cleaning and preserving our coastal areas.'
    },
    {
      id: 6,
      title: 'Digital Skills Workshop',
      date: '2025-06-28',
      location: 'Computer Laboratory',
      participants: 25,
      maxParticipants: 30,
      isJoined: false,
      type: 'Educational',
      image: asset.cleanupDrive,
      description: 'Learn essential digital skills for the modern workplace.'
    }
  ]);

  const [historicalEvents] = useState([
    {
      id: 101,
      title: 'Community Cleanup Drive',
      date: '2024-03-15',
      location: 'City Park',
      participants: 45,
      maxParticipants: 50,
      type: 'Environmental',
      status: 'Completed',
      image: asset.cleanupDrive
    },
    {
      id: 102,
      title: 'Tech Workshop',
      date: '2024-03-15',
      location: 'Main Campus',
      participants: 28,
      maxParticipants: 30,
      type: 'Educational',
      status: 'Completed',
      image: asset.cleanupDrive
    },
    {
      id: 103,
      title: 'Health & Wellness Seminar',
      date: '2024-03-20',
      location: 'Community Center',
      participants: 35,
      maxParticipants: 40,
      type: 'Health',
      status: 'Completed',
      image: asset.cleanupDrive
    }
  ]);

  const [topParticipants] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      eventsJoined: 15
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
      eventsJoined: 12
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=3",
      eventsJoined: 10
    },
    {
      id: 4,
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?img=4",
      eventsJoined: 8
    },
    {
      id: 5,
      name: "Lisa Thompson",
      avatar: "https://i.pravatar.cc/150?img=5",
      eventsJoined: 7
    }
  ]);

  const handleJoinEvent = (eventId) => {
    console.log('Joining event:', eventId);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${date.getFullYear()}-${month}-${day}`;
    const events = upcomingEvents.filter(event => event.date === dateStr);
    setSelectedEvent(events[0] || null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    const [year, month, day] = event.date.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
  };

  // Filter active events
  const activeEvents = upcomingEvents.filter(event => new Date(event.date) >= new Date());

  return (
    <div className="p-6 h-screen overflow-hidden">
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Volunteers</div>
              <div className="text-2xl font-semibold">{stats.totalVolunteers}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Volunteer Hours</div>
              <div className="text-2xl font-semibold">{stats.totalHours}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
              <div className="text-2xl font-semibold">{stats.completedTasks}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Featured Events Section */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-16rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Featured Events</h2>
            <Link to="/staff/events" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4 h-[calc(100%-3rem)] overflow-y-auto pr-2">
            {activeEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                onJoin={handleJoinEvent}
                onClick={handleEventClick}
              />
            ))}
          </div>
        </div>

        {/* Calendar and Top Participants Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-16rem)] flex flex-col">
          <div className="flex-none">
            <CalendarWidget
              events={activeEvents}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Top Participants</h3>
              <Link to="/staff/participants" className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2 flex-1">
              {topParticipants.map(participant => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Footer */}
      {selectedEvent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 transform transition-transform">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{selectedEvent.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    selectedEvent.type === 'Environmental' ? 'bg-green-100 text-green-800' :
                    selectedEvent.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                    selectedEvent.type === 'Health' ? 'bg-red-100 text-red-800' :
                    selectedEvent.type === 'Leadership' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEvent.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{selectedEvent.participants}/{selectedEvent.maxParticipants} participants</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleJoinEvent(selectedEvent.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedEvent.isJoined
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={selectedEvent.isJoined}
              >
                {selectedEvent.isJoined ? 'Joined' : 'Join Event'}
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 