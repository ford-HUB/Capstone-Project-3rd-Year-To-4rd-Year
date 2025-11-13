import React from "react";

const StatCard = ({ icon: Icon, value, label, valueColor = "text-white" }) => (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <Icon className="w-8 h-8" />
      </div>
      <div className={`text-2xl font-bold ${valueColor} mb-1`}>
        {value}
      </div>
      <div className="text-sm opacity-90">
        {label}
      </div>
    </div>
);

export default StatCard;


