import React from "react";
import { Check, Clock } from 'lucide-react';
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { getTotalHours } from "../../../../utils/partcipantUtils.js";
import { GetFirstLetter } from "../../../../utils/GetFirstLetter.js";
import dayjs from "dayjs";


const ParticipantRow = ({ participant, selected, onToggleSelection }) => (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center">
          <div className="flex items-center">
            <Avatar 
              initials={GetFirstLetter(participant.participantDetails.participant_name)}
              bgColor={'bg-blue-600'}
              size="lg" 
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{participant?.participantDetails.participant_name}</div>
              <div className="text-xs text-gray-500">{participant?.eventDetails.event_name}</div>
            </div>
          </div>
        </div>
        
        <div className="self-start">
          <div className="flex flex-col items-start">
            <Badge variant={participant.eventDetails.event_type?.toLowerCase() || 'default'}>
              {participant.eventDetails.event_type}
            </Badge>
            {participant.eventDetails.event_type === 'School' && participant.eventDetails.department_name && (
              <div className="text-xs text-gray-500 mt-1">
                {participant.eventDetails.department_name}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-900">{dayjs(participant.time_in).format("hh:mm A")}</div>
        <div className="text-sm text-gray-900">{participant.time_out === null ? '-': dayjs(participant.time_out).format("hh:mm A")}</div>
        <div className="text-sm text-gray-900">{participant.status !== 'Present' && participant.eventDetails.event_status !== 'Completed' ? 'In Progress': participant.eventDetails.event_status === 'Completed' && participant.status !== 'Present' ? 'Failed to Timeout' : getTotalHours(participant.time_in, participant.time_out)}</div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${participant.time_out && participant.eventDetails.event_status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>
            {participant.status !== 'Present' && participant.eventDetails.event_status === 'Completed' ? 'In Complete': 'Present'}
          </span>
          {participant.status === 'Present' && (
            <div className="flex items-center text-green-600">
              <Check className="w-4 h-4" />
            </div>
          )}
          {participant.status === 'In Progress' && (
            <div className="flex items-center text-orange-500">
              <Clock className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

export default ParticipantRow