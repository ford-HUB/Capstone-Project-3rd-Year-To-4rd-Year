import React from "react";
import { Icon } from "lucide-react";

const StatCard = ({ icon: Icon, value, label, valueColor }) => (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        <Icon className="w-6 h-6 mr-2" />
        <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
      </div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
);

export default StatCard