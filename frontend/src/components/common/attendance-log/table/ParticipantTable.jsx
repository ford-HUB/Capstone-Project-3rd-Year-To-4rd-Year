
import ParticipantRow from "../row/ParticipantRow";
import SearchInput from "../ui/SearchInput";

const ParticipantsTable = ({ 
    participants, 
    searchTerm, 
    selectedParticipants, 
    onSearchChange,
    onToggleSelection,
    onSelectAll
  }) => {
    const filteredParticipants = participants?.filter(participant =>
        participant.participantDetails.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant?.eventDetails.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant?.eventDetails.event_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <SearchInput
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search participants or events"
            />
            <div className="flex space-x-3">
              <button disabled className="px-4 py-2 cursor-not-allowed space-x-1.5 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600">
                <span className="loading loading-spinner loading-xs"></span>
                <span>Generate Certificate...</span>
              </button>
            </div>
          </div>
        </div>
  
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              Participant
            </div>
            <div>Event Type</div>
            <div>Time In</div>
            <div>Time Out</div>
            <div>Total Time</div>
            <div>Status</div>
          </div>
        </div>
  
        <div className="divide-y divide-gray-200">
          {filteredParticipants?.map((participant) => (
            <ParticipantRow
              key={participant.id}
              participant={participant}
              selected={selectedParticipants.includes(participant.id)}
              onToggleSelection={onToggleSelection}
            />
          ))}
        </div>
  
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex space-x-4">
              <span>Event attendance policy</span>
              <span>Privacy terms</span>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ParticipantsTable