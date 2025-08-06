import { X, MapPin, UserPlus, Trash2, Users, Calendar } from "lucide-react";

const Participants = ({ event, onClose, onRemoveParticipant }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                {event.currentParticipants}/{event.maxParticipants} Participants
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
                width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
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

export default Participants