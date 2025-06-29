import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';
import CreateEvent from '../../components/modal/CreateEvent';
import Participants from '../../components/modal/Participants';
import EditEvent from '../../components/modal/EditEvent';
import { useEventHooks } from '../../hooks/staff/useEventHooks.js';
import Delete from '../../components/modal/Delete.jsx';
import dayjs from 'dayjs';

const EventsManagement = () => {
  const { listEvents, getListEvents, loading, error, deleteEvent } = useEventHooks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [events, setEvents] = useState([]);

  // Modal state
    const [modalState, setModalState] = React.useState({
      isOpen: false,
      name: '',
      action: null,
      requestId: null
    });

  // Debugging logs
  useEffect(() => {
    console.log('List data from hook:', listEvents);
  }, [listEvents]);

  useEffect(() => {
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

  useEffect(() => {
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
        participants: []
      }));
      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } else {
      console.log('No valid events data received:', listEvents);
    }
  }, [listEvents]);



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

  const handleRemoveParticipant = (participantId) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      setEvents(events.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            participants: event.participants.filter(p => p.id !== participantId)
          };
        }
        return event;
      }));
    }
  };

  const handleEditEvent = () => {
    setSelectedEvent(null)
    getListEvents()
  };

  const handleDeleteEvent = async (eventId) => {
      const success = await deleteEvent(eventId)

      if(!success) return
      getListEvents()
  };

  const handleViewParticipants = (event) => {
    setSelectedEvent(event);
    setShowParticipantsModal(true);
  };

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      {/* Search and Filter */}
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

      {/* Events Grid */}
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
            <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              {event.event_image && (
                <div className="mb-3 h-40 overflow-hidden rounded-lg">
                  <img 
                    src={event.event_image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x150?text=Event+Image';
                    }}
                  />
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">{event.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.type === 'Community' ? 'bg-green-100 text-green-800' :
                  event.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.type}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  {event.date} ({event.startTime} - {event.endTime})
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  {event.currentParticipants}/{event.maxParticipants} Participants
                </div>
                <div className="text-sm text-gray-600">
                  Organizer: {event.organizer}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewParticipants(event)}
                  className="px-3 py-1.5 text-sm bg-white shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users size={16} />
                  View Participants
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                    title="Edit Event"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setModalState({ isOpen: true, name: event.title, action: 'delete', requestId: event.id })}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Delete Event"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEvent
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}

      {showParticipantsModal && selectedEvent && (
        <Participants
          event={selectedEvent}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedEvent(null);
          }}
          onRemoveParticipant={handleRemoveParticipant}
        />
      )}

      {selectedEvent && !showParticipantsModal && (
        <EditEvent
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleEditEvent}
        />
      )}

      <Delete
        isOpen={modalState.isOpen}
        onClose={() => (setModalState({ isOpen: false, name: '', action: null, requestId: null }))}
        onConfirm={async() => { await handleDeleteEvent(modalState.requestId); setModalState({...modalState, isOpen: false}) }}
        event={modalState.name}
        action={modalState.action}
      />
    </div>
  );
};

export default EventsManagement;