import React from 'react';
import { ChevronLeft, ChevronRight,  } from 'lucide-react'

const CalendarWidget = ({ events, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
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

export default CalendarWidget