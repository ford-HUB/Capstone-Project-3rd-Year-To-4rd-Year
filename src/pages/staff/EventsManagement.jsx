import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, MapPin, Users, ChevronDown, X, Eye, UserPlus } from 'lucide-react';
import CreateProgramModal from '../../components/staff/CreateProgramModal';

const ViewEventModal = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">View Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.type === 'Environmental' ? 'bg-green-100 text-green-800' :
                event.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {event.type}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Participants ({event.participants.length}/{event.maxParticipants})</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-3">
                {event.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      participant.role === 'Staff' ? 'bg-purple-100 text-purple-800' :
                      participant.role === 'Coordinator' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {participant.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Add edit functionality here
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParticipantsModal = ({ event, onClose, onRemoveParticipant }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Event Participants</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-lg">{event.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {event.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {event.location}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span className="font-medium">
                {event.participants.length}/{event.maxParticipants} Participants
              </span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <UserPlus size={16} />
              Add Participant
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(event.participants.length / event.maxParticipants) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {event.participants.map((participant) => (
            <div 
              key={participant.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium">{participant.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{participant.email}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    participant.role === 'Staff' 
                      ? 'bg-purple-100 text-purple-800'
                      : participant.role === 'Coordinator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                    }`}>
                    {participant.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onRemoveParticipant(participant.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditEventModal = ({ event, onClose, onSave }) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={editedEvent.title}
                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={editedEvent.type}
                onChange={(e) => setEditedEvent({ ...editedEvent, type: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Environmental">Environmental</option>
                <option value="Educational">Educational</option>
                <option value="Health">Health</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={editedEvent.date}
                onChange={(e) => setEditedEvent({ ...editedEvent, date: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editedEvent.location}
                onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
              <input
                type="number"
                value={editedEvent.maxParticipants}
                onChange={(e) => setEditedEvent({ ...editedEvent, maxParticipants: parseInt(e.target.value) })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateEventModal = ({ onClose, onSave }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    maxParticipants: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...newEvent,
      id: Date.now(),
      participants: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter event description"
              required
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={4}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                required
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants</label>
              <input
                type="number"
                placeholder="Enter max participants"
                required
                min="1"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              required
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select event type</option>
              <option value="Environmental">Environmental</option>
              <option value="Educational">Educational</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EventsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Cleanup Drive',
      type: 'Environmental',
      date: '2024-03-20',
      location: 'City Park',
      maxParticipants: 50,
      participants: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@uclm.edu',
          role: 'Coordinator',
          status: 'confirmed'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@uclm.edu',
          role: 'Volunteer',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 2,
      title: 'Tech Workshop',
      type: 'Educational',
      date: '2024-03-22',
      location: 'Main Campus',
      maxParticipants: 30,
      participants: [
        {
          id: 3,
          name: 'Mike Wilson',
          email: 'mike.w@uclm.edu',
          role: 'Staff',
          status: 'confirmed'
        }
      ]
    }
  ]);

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

  const handleEditEvent = (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
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

  const eventTypes = ['Environmental', 'Educational', 'Health'];

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
              {eventTypes.map(type => (
                <button
                  key={type}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">{event.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.type === 'Environmental' ? 'bg-green-100 text-green-800' :
                event.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {event.type}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                {event.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                {event.participants.length}/{event.maxParticipants} Participants
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
                  onClick={() => handleDeleteEvent(event.id)}
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

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateEvent}
        />
      )}

      {showParticipantsModal && selectedEvent && (
        <ParticipantsModal
          event={selectedEvent}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedEvent(null);
          }}
          onRemoveParticipant={handleRemoveParticipant}
        />
      )}

      {selectedEvent && !showParticipantsModal && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleEditEvent}
        />
      )}
    </div>
  );
};

export default EventsManagement; 