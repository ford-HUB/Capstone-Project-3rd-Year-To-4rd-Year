import React from 'react';
import { Clock, CheckCircle, Calendar, MapPin, Users } from 'lucide-react';
import dayjs from 'dayjs';
import { formatHours, formatAttendanceDate, formatTime } from '../../../utils/attendanceUtils.js';

/**
 * Attendance Record Card Component
 * Displays individual attendance record information
 */
const AttendanceRecordCard = ({ record }) => {
    // Get status display configuration
    const getStatusDisplay = (status) => {
        if (status === 'completed') {
            return {
                icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                badge: 'bg-green-100 text-green-800',
                text: 'Completed'
            };
        }
        return {
            icon: <Clock className="w-5 h-5 text-blue-600" />,
            badge: 'bg-blue-100 text-blue-800',
            text: 'In Progress'
        };
    };

    const statusDisplay = getStatusDisplay(record.status);
    
    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {record.event.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatAttendanceDate(record.attendance_date)}</span>
                        </div>
                        
                        {record.hours_worked !== undefined && record.hours_worked !== null && (
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatHours(record.hours_worked)}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{record.event.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{record.event.category}</span>
                        </div>
                    </div>

                    {record.time_in && (
                        <div className="mt-3 text-xs text-gray-500">
                            <div>Time In: {formatTime(record.time_in)}</div>
                            {record.time_out && (
                                <div>Time Out: {formatTime(record.time_out)}</div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="ml-4">
                    <div className="flex items-center space-x-2">
                        {statusDisplay.icon}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.badge}`}>
                            {statusDisplay.text}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRecordCard;
