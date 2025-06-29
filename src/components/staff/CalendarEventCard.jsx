

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

export default CalendarEventCard