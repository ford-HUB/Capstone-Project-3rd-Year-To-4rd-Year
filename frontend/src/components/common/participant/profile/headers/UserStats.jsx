import React from "react";
import StatCard from "../cards/StatCard";
import { Award, ClipboardClock, FileText } from "lucide-react";
import { FormatHours } from "../../../../../utils/HoursConverterUtils";


const UserStats = ({ totalHours, accomplishmentData }) => (
    <div className="flex space-x-16 text-white">
      <StatCard icon={ClipboardClock} value={FormatHours(totalHours?.total_hours_volunteered)} label="Total Hours" valueColor="text-yellow-400" />
      <StatCard icon={Award} value={accomplishmentData.certificateTotal} label="Total Certificates" valueColor="text-blue-400" />
      <StatCard icon={FileText} value={accomplishmentData.eventCompletedCount} label="Events Completed" valueColor="text-purple-400" />
    </div>
);

export default UserStats