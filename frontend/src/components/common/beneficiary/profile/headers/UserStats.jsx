import React from "react";
import StatCard from "../cards/StatCard";
import { Award, ClipboardClock, FileText, MapPin } from "lucide-react";

const UserStats = ({ totalHours, accomplishmentData }) => (
    <div className="flex space-x-16 text-white">
      <StatCard icon={ClipboardClock} value={accomplishmentData.assistanceReceived || 0} label="Assistance Received" valueColor="text-yellow-400" />
      <StatCard icon={Award} value={accomplishmentData.eventsAttended || 0} label="Events Attended" valueColor="text-blue-400" />
      <StatCard icon={MapPin} value={accomplishmentData.locationMatches || 0} label="Location Matches" valueColor="text-purple-400" />
    </div>
);

export default UserStats;


