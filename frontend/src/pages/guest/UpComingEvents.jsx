import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { getUpcomingEvents } from '../../services/guest/eventService.js';

// Helper functions
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Get category color class based on status
const getCategoryColor = (status) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-500';
    case 'Ongoing':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// Format time from datetime string
const formatTime = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startTime = start.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const endTime = end.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${startTime} - ${endTime}`;
};

// Transform API event data to calendar format
const transformEvent = (event) => {
  const startDate = new Date(event.event_started);
  const dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
  
  return {
    id: event.event_id,
    title: event.title,
    date: dateStr,
    time: formatTime(event.event_started, event.event_ended),
    location: event.location || 'TBA',
    status: event.status,
    description: event.description,
    event_started: event.event_started,
    event_ended: event.event_ended
  };
};

const UpCommingEvent = () => {
  // Today's date as the starting point
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch upcoming events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getUpcomingEvents();
        
        if (result.success) {
          const transformedEvents = result.events.map(transformEvent);
          setEvents(transformedEvents);
        } else {
          setError(result.message || 'Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Month navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calendar cells generation
  const generateCalendarCells = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const cells = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const eventsForDay = events.filter(event => event.date === date);
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isSelected = selectedDate === date;

      cells.push(
        <div 
          key={`day-${day}`} 
          className={`h-24 border border-gray-200 p-1 relative cursor-pointer overflow-hidden transition-all duration-200
            ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
            ${isSelected ? 'ring-2 ring-blue-400' : ''}
          `}
          onClick={() => {
            setSelectedDate(date);
            setSelectedEvents(eventsForDay);
          }}
        >
          <div className={`text-right ${isToday ? 'font-bold' : ''} text-sm mb-1`}>
            {day}
          </div>
          <div className="space-y-1">
            {eventsForDay.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs text-white p-1 rounded truncate ${getCategoryColor(event.status)}`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {eventsForDay.length > 2 && (
              <div className="text-xs text-gray-500">
                +{eventsForDay.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return cells;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Loading upcoming events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Today
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div>
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {dayNames.map(day => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-700 border-b">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {generateCalendarCells()}
          </div>
        </div>
      </div>

      {/* Events List for Selected Day */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">
            Events for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          
          {selectedEvents.length === 0 ? (
            <p className="text-gray-500">No events scheduled for this day.</p>
          ) : (
            <div className="space-y-4">
              {selectedEvents.map(event => (
                <div key={event.id} className="border-l-4 pl-4 py-2" style={{ 
                  borderLeftColor: event.status === 'Upcoming' ? '#3b82f6' : '#10b981' 
                }}>
                  <h4 className="font-medium text-lg">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  )}
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="text-sm font-medium mr-2">Event Status:</div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-sm">Upcoming</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-sm">Ongoing</span>
        </div>
      </div>
    </div>
  );
}

export default UpCommingEvent