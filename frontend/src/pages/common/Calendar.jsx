import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import CalendarEventModal from '../../components/modal/CalendarEventModal';
import { useEventStore } from '../../store/event/useEventStore.js';
import dayjs from 'dayjs';

const Calendar = () => {
  const { listEvents, getListEvents } = useEventStore();
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    if (listEvents.length > 0) return;

    const fetchEvents = async () => {
      try {
        await getListEvents();
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch events:', err);
        }
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [getListEvents, listEvents.length]);

  React.useEffect(() => {
    if (Array.isArray(listEvents)) {
      const formattedEvents = listEvents.map(event => ({
        id: event.event_id,
        title: event.title,
        type: event.Categories?.[0]?.name || 'Uncategorized',
        date: new Date(event.event_started),
        startTime: dayjs(event.event_started).format('h:mm A'),
        endTime: dayjs(event.event_ended).format('h:mm A'),
        location: event.location,
        maxParticipants: event.max_participants,
        currentParticipants: event.participants,
        description: event.description,
        event_image: event.event_image,
        organizer: event.Organizer?.name || 'Unknown',
        participants: []
      }));
      setEvents(formattedEvents);
    }
  }, [listEvents]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const dateStr = `${monthNames[currentDate.getMonth()]} ${day}`;
    const eventsForDay = events.filter(event => {
      return (
        event.date.getFullYear() === currentDate.getFullYear() &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getDate() === day
      );
    });
    setSelectedDate(dateStr);
    setSelectedEvents(eventsForDay);
    setIsModalOpen(true);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="h-auto bg-gray-50">
      <div className="flex">
        <div className="flex-1 m-4">
          <div className="flex gap-8 h-[calc(100vh-8rem)]">
            <div className="bg-white rounded-2xl shadow-md w-[800px] flex flex-col">
              <div className="flex justify-between items-center p-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Calendar</h1>
                  <p className="text-sm text-gray-600">Manage your event schedule</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-6 -mt-5 bg-white">
                <button onClick={handlePreviousMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-6">
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
                    const dayEvents = events.filter(event => (
                      event.date.getFullYear() === currentDate.getFullYear() &&
                      event.date.getMonth() === currentDate.getMonth() &&
                      event.date.getDate() === day
                    ));
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
                          <div className="mt-0.5 grid grid-cols-1 space-y-0.5">
                            {dayEvents.slice(0, 2).map(event => (
                              <div key={event.id} className="text-start text-[10px] bg-blue-600 text-white p-0.5 rounded truncate">
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-end text-[8px] text-blue-500">
                                +{dayEvents.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{event.date.toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.startTime} - {event.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{event.currentParticipants} participants</span>
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

      <CalendarEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        events={selectedEvents}
        date={selectedDate}
      />
    </div>
  );
};

export default Calendar;
