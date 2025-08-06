import React from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import CreateEvent from '../../components/modal/CreateEvent.jsx';
import { useEventStore } from '../../store/event/useEventStore.js';
import dayjs from 'dayjs';
import EventCard from '../../components/common/EventCard.jsx';

const ManageEvents = () => {
  const { listEvents, getListEvents, loading, error } = useEventStore();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true

    if(listEvents.length > 0) return

    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        await getListEvents();
      } catch (err) {
        if(isMounted) {
          console.error("Failed to fetch events:", err);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false
    }
  }, [getListEvents, listEvents.length]);

  React.useEffect(() => {
    if (listEvents && Array.isArray(listEvents)) {
      console.log('Processing events data...');
      const formattedEvents = listEvents.map(event => ({
        id: event.event_id,
        title: event.title,
        type: event.Categories?.[0]?.name || 'Uncategorized',
        date: dayjs(event.event_started).format('MMMM D, YYYY'),
        startTime: dayjs(event.event_started).format('h:mm A'),
        endTime: dayjs(event.event_ended).format('h:mm A'),
        location: event.location,
        maxParticipants: event.max_participants,
        currentParticipants: event.participants,
        description: event.description,
        event_image: event.event_image,
        organizer: event.Organizer?.name || 'Unknown',
        participants: [],
        funds: event.funds_donation,
        goods: event.goods_donation
      }));
      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } else {
      console.log('No valid events data received:', listEvents);
    }
  }, [listEvents.length]);

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  const eventTypes = [...new Set(events.flatMap(event => event.type))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error loading events: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 m-6 border border-gray-300 rounded-xl bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="px-4 py-2 bg-white shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            {selectedType || 'Type'}
            <ChevronDown size={16} />
          </button>
          
          {showTypeDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
              <button
                onClick={() => {
                  setSelectedType('');
                  setShowTypeDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
              >
                All Types
              </button>
              {eventTypes.map((type, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No events found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event}/>
            // <span>{event.funds ? 'true': ''}</span>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEvent
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default ManageEvents;