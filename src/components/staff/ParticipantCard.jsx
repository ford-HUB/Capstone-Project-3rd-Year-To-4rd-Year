import { Star, Award } from "lucide-react";

const ParticipantCard = ({ participant }) => (
  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="relative">
      <img
        src={participant.avatar}
        alt={participant.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
        <Star size={12} className="text-white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-sm truncate">{participant.name}</h4>
      <p className="text-xs text-gray-600">Active Member</p>
    </div>
    <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
      <Award size={14} />
      <span>{participant.eventsJoined} events</span>
    </div>
  </div>
);

export default ParticipantCard