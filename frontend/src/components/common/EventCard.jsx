import React from 'react'
import { Calendar, MapPin, Users, Trash2, Edit2, BadgeCheck, QrCode, Menu } from 'lucide-react';
import EditEvent from '../modal/EditEvent';
import DeleteModal from '../modal/DeleteEventModal';
import JoinEventModal from '../modal/JoinEventModal';
import { useEventStore } from '../../store/event/useEventStore';
import DonationIconButton from './DonationIconButton';
import QRCodeModal from '../modal/QRCodeModal';

const EventCard = ({ event }) => {
  const { getListEvents, deleteEvent } = useEventStore()
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [showEventBoardModal, setShowEventBoardModal] = React.useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = React.useState(false)
  const [events, setEvents] = React.useState([])

  const [modalState, setModalState] = React.useState({
    isOpen: false,
    name: '',
    action: null,
    requestId: null
  });

  const handleEventBoard = (event) => {
    setSelectedEvent(event);
    setShowEventBoardModal(true);
  };

  const handleEditEvent = async() => {
    await getListEvents()
    setSelectedEvent(null)
    window.location.reload()
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteEvent(eventId)
    await getListEvents()
    window.location.reload()
  };

  const man = (participantId) => {
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

  return (
    <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className='absolute top-[37.5%] left-[40.6%]'>
                {
                  event.funds || event.goods ? <span className='text-[8px] text-black inline-flex items-center '><BadgeCheck className='h-3 w-3 text-blue-600 m-2'/>Donation</span> : null
                }
              </div>
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

                <div className='flex-col space-x-2.5'>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'Community' ? 'bg-yellow-100 text-yellow-800' :
                    event.type === 'Educational' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800' // fallback color
                    }`}>
                    {event.status}
                  </span>

                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'Community' ? 'bg-green-100 text-green-800' :
                    event.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                    }`}>
                    {event.type}
                  </span>
                </div>
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
                {event.currentParticipants}/{event.maxParticipants} Registered Participants
              </div>
              <div className="text-sm text-gray-600">
                Organizer: {event.organizer}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={() => handleEventBoard(event)}
            className="px-3 py-1.5 text-sm bg-white shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Menu size={16} />
            </button>
                
              <div className="flex items-center gap-2">
                <button onClick={() => { 
                  setShowQRCodeModal(true)
                  setSelectedEvent(event)
                }}
                className='p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50'>
                  <QrCode size={18}/>
                </button>
                {
                  event.type !== 'School' &&
                  <DonationIconButton event={event}/>
                }
                <button onClick={() => setSelectedEvent(event)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <Edit2 size={18} />
                </button>

                <button onClick={() => setModalState({ isOpen: true, name: event.title, action: 'delete', requestId: event.id })}
                  className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete Event">
                  <Trash2 size={18} />
                </button>
            </div>
          </div>

      {showEventBoardModal && selectedEvent && (
        <JoinEventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventBoardModal(false);
            setSelectedEvent(null);
          }}
          onRemoveParticipant={man}
        />
      )}

      {showQRCodeModal && selectedEvent && (
        <QRCodeModal 
        isOpen={showQRCodeModal}
        onClose={() => { 
          setShowQRCodeModal(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        />
      )}

      {selectedEvent && !showEventBoardModal && !showQRCodeModal && (
        <EditEvent
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleEditEvent}
        />
      )}

      <DeleteModal
        isOpen={modalState.isOpen}
        onClose={() => (setModalState({ isOpen: false, name: '', action: null, requestId: null }))}
        onConfirm={async() => { await handleDeleteEvent(modalState.requestId); setModalState({...modalState, isOpen: false}) }}
        event={modalState.name}
        action={modalState.action}
      />
    </div>
  )
}

export default EventCard