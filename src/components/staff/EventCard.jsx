import { Calendar, MapPin } from "lucide-react";

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

export default EventCard