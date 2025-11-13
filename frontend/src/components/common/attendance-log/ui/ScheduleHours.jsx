import React from "react";

const ScheduleHours = ({ hours }) => (
    <div className="flex items-center mb-6 overflow-x-auto">
      {hours.map((hour, index) => (
        <div
          key={hour}
          className={`flex-shrink-0 w-12 h-8 flex items-center justify-center text-xs font-medium rounded mr-1 ${
            index < 6 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {hour}{hour === '12' ? 'PM' : index < 4 ? 'AM' : 'PM'}
        </div>
      ))}
    </div>
);

export default ScheduleHours