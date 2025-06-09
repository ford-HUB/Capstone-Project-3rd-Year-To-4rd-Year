import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { asset } from '../../assets/asset';

const assetImages = [
  asset.background,
  asset.backgroundV2,
  asset.groupImage,
  asset.idSample,
  asset.schoolID,
  asset.fourOne,
  asset.fourTwo,
  asset.fourThree,
  asset.fourFour,
  asset.testProfile,
  asset.impactPic1,
  asset.impactPic2,
  asset.impactPic3,
  asset.megaphone,
  asset.bossing,
  asset.boy,
  asset.cris,
  asset.master,
  asset.cleanupDrive
];

function getRandomImage(index) {
  return assetImages[index % assetImages.length];
}

const exampleEvents = [
  {
    id: 1,
    title: 'Environmental Awareness Workshop',
    date: '2025-06-05',
    location: 'Main Campus Auditorium',
    participants: 35,
    maxParticipants: 50,
    isJoined: false,
    type: 'Environmental',
    image: getRandomImage(0),
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
    image: getRandomImage(1),
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
    image: getRandomImage(2),
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
    image: getRandomImage(3),
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
    image: getRandomImage(4),
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
    image: getRandomImage(5),
    description: 'Learn essential digital skills for the modern workplace.'
  }
];

const getEventTypeColor = (type) => {
  switch (type) {
    case 'Environmental':
      return 'bg-green-500 text-green-800 bg-green-100';
    case 'Educational':
      return 'bg-blue-500 text-blue-800 bg-blue-100';
    case 'Health':
      return 'bg-red-500 text-red-800 bg-red-100';
    case 'Leadership':
      return 'bg-purple-500 text-purple-800 bg-purple-100';
    default:
      return 'bg-gray-500 text-gray-800 bg-gray-100';
  }
};

const StaffCalendar = ({ events, onDateSelect, selectedDate, selectedEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateSelect(selected, null);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-lg font-semibold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (<div key={`empty-${i}`} className="h-16"></div>))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
          });
          const hasEvent = dayEvents.length > 0;
          const isSelected = selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-16 p-1 border rounded-lg cursor-pointer hover:bg-gray-50 ${hasEvent ? 'bg-blue-50 border-blue-200' : 'border-gray-200'} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="text-sm font-medium">{day}</div>
              {hasEvent && (
                <div className="mt-0.5 space-y-0.5 flex flex-col">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs text-white p-0.5 rounded truncate ${getEventTypeColor(event.type).split(' ')[0]} ${selectedEvent && selectedEvent.id === event.id ? 'ring-2 ring-blue-400' : ''}`}
                      onClick={e => { e.stopPropagation(); onDateSelect(new Date(event.date), event); }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-blue-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UpcomingEvents = ({ events, onEventClick, selectedEvent }) => {
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
      {upcoming.length === 0 ? (
        <p className="text-gray-500">No upcoming events.</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map(event => (
            <li
              key={event.id}
              className={`border border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${selectedEvent && selectedEvent.id === event.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => onEventClick(new Date(event.date), event)}
            >
              <img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded mr-2" />
              <div className="flex-1">
                <span className={`font-medium ${getEventTypeColor(event.type).split(' ')[1]}`}>{event.title}</span>
                <div className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} - {event.location}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function EventsForSelectedDate({ events, selectedDate, onEventClick, selectedEvent }) {
  if (!selectedDate) return null;
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Events for {selectedDate.toLocaleDateString()}</h2>
      {dayEvents.length === 0 ? (
        <p className="text-gray-500">No events scheduled for this day.</p>
      ) : (
        <ul className="space-y-3">
          {dayEvents.map(event => (
            <li
              key={event.id}
              className={`border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${selectedEvent && selectedEvent.id === event.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => onEventClick(new Date(event.date), event)}
            >
              <img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded mr-2" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${getEventTypeColor(event.type).split(' ')[1]}`}>{event.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getEventTypeColor(event.type).split(' ')[2]}`}>{event.type}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{event.description}</div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><CalendarIcon size={14} />{event.date}</div>
                  <div className="flex items-center gap-1"><MapPin size={14} />{event.location}</div>
                  <div className="flex items-center gap-1"><Users size={14} />{event.participants} participants</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EventDetailsModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-4 z-10 animate-fade-in min-h-[28rem] flex flex-col justify-center overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">Close</button>
        </div>
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <div className="mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type).split(' ')[2]}`}>{event.type}</span>
        </div>
        <div className="text-gray-700 mb-2">{event.description}</div>
        <div className="flex gap-6 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1"><CalendarIcon size={16} />{event.date}</div>
          <div className="flex items-center gap-1"><MapPin size={16} />{event.location}</div>
          <div className="flex items-center gap-1"><Users size={16} />{event.participants} participants</div>
        </div>
        <div className="text-xs text-gray-400">Max Participants: {event.maxParticipants}</div>
      </div>
    </div>
  );
}

export default function StaffCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Unified handler for selecting an event (from calendar or upcoming list)
  const handleSelectEvent = (date, event) => {
    setSelectedDate(date);
    setSelectedEvent(event);
  };

  return (
    <div className={`p-6 ${selectedEvent ? 'overflow-hidden' : ''}`}> {/* Prevent scroll when modal is open */}
      {/* Show events for the selected day at the top */}
      <EventsForSelectedDate events={exampleEvents} selectedDate={selectedDate} onEventClick={handleSelectEvent} selectedEvent={selectedEvent} />
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 ${selectedEvent ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
        <StaffCalendar events={exampleEvents} onDateSelect={handleSelectEvent} selectedDate={selectedDate} selectedEvent={selectedEvent} />
        <UpcomingEvents events={exampleEvents} onEventClick={handleSelectEvent} selectedEvent={selectedEvent} />
      </div>
      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
} 