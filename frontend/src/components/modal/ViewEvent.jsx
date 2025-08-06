import { Calendar, MapPin } from "lucide-react";

const ViewEvent = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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

export default ViewEvent