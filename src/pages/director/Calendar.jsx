import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Users, MapPin, X } from 'lucide-react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';

const EventModal = ({ isOpen, onClose, events, date }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Events for {date}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {events.length === 0 ? (
            <p className="text-gray-500">No events scheduled for this day.</p>
          ) : (
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Temporary data for calendar events
  const events = [
    {
      id: 1,
      title: "Community Outreach Program",
      date: "May 28",
      time: "9:00 AM - 12:00 PM",
      location: "UCLM Campus",
      participants: 45,
      type: "Community Service",
      description: "A community service program focused on helping local residents."
    },
    {
      id: 2,
      title: "Health Awareness Seminar",
      date: "May 25",
      time: "2:00 PM - 4:00 PM",
      location: "UCLM Auditorium",
      participants: 32,
      type: "Seminar",
      description: "An informative seminar about health and wellness."
    }
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const dateStr = `${monthNames[currentDate.getMonth()]} ${day}`;
    const eventsForDay = events.filter(event => event.date === dateStr);
    setSelectedDate(dateStr);
    setSelectedEvents(eventsForDay);
    setIsModalOpen(true);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <div className="flex">
        <DirectorSidePanel />
        
        {/* Main Content */}
        <div className="flex-1 px-8 py-6 ml-16">
          <div className="flex gap-8 h-[calc(100vh-8rem)]">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-md w-[800px] flex flex-col">
              {/* Header Section */}
              <div className="flex justify-between items-center p-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Calendar</h1>
                  <p className="text-sm text-gray-600">Manage your event schedule</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 -mt-5 bg-white">
                <button 
                  onClick={handlePreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfMonth }, (_, i) => (
                    <div key={`empty-${i}`} className="h-20"></div>
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${monthNames[currentDate.getMonth()]} ${day}`;
                    const dayEvents = events.filter(event => event.date === dateStr);
                    const hasEvent = dayEvents.length > 0;
                    return (
                      <div
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`h-20 p-1 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          hasEvent ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                        } ${selectedDate === dateStr ? 'ring-2 ring-blue-400' : ''}`}
                      >
                        <div className="text-sm font-medium">{day}</div>
                        {hasEvent && (
                          <div className="mt-0.5 space-y-0.5">
                            {dayEvents.slice(0, 2).map(event => (
                              <div key={event.id} className="text-xs bg-blue-500 text-white p-0.5 rounded truncate">
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-blue-500">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Events Preview Section */}
            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {events.map(event => (
                    <div 
                      key={event.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.participants} participants</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {event.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        events={selectedEvents}
        date={selectedDate}
      />
    </div>
  );
};

export default Calendar; 