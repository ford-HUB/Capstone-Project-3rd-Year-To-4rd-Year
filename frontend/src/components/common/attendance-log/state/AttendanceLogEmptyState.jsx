import React from 'react';
import { Users, Calendar, Clock, Plus } from 'lucide-react';

const AttendanceLogEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      {/* Icon Container */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
          <Clock className="w-3 h-3 text-gray-500" />
        </div>
      </div>

      {/* Main Message */}
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-3">
          No Attendance Records
        </h3>
        <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed">
          The attendance log today is currently empty
        </p>
      </div>
    </div>
  );
};

export default AttendanceLogEmptyState