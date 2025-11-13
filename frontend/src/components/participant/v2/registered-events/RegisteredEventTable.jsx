import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Eye, List, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { formatDate, formatDateTime, getEventDuration } from '../../../../utils/dateUtils.js';
import { getEventStatusColor, getProofStatusColor, getProofStatusText, getAvatar } from '../../../../utils/statusUtils.js';
import EventRequirementsModal from '../../../modal/v2/participant/EventRequirementsModal.jsx';

const RegisteredEventTable = ({
    events,
    onViewEventDetails,
    onStatusUpdate,
    loading = false
}) => {
    const [showRequirementsModal, setShowRequirementsModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    const handleViewRequirements = (event, registration) => {
        setSelectedEvent(event);
        setSelectedRegistration(registration);
        setShowRequirementsModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading events...</span>
                </div>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">You haven't registered for any events yet.</p>
            </div>
        );
    }

    return (
        <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Event Details
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Schedule
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {events.map((reg) => {
                            const ev = reg?.Event;
                            return (
                                <React.Fragment key={reg?.event_registration_id}>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 px-6">
                                            <div className="flex items-start space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                                    {getAvatar(ev?.title)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                        {ev?.title ?? 'Untitled Event'}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                        {ev?.description?.substring(0, 100)}...
                                                    </p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                            <Users className="w-3 h-3" />
                                                            <span>{ev?.participants || 0}/{ev?.max_participants || 0}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{getEventDuration(ev?.event_started, ev?.event_ended)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm text-gray-900">
                                                    <Calendar className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium">{formatDate(ev?.event_started)}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDateTime(ev?.event_started)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    to {formatDate(ev?.event_ended)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <span className="truncate max-w-32">{ev?.location || 'TBA'}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                                reg?.display_status === 'Completed - Requirements Needed'
                                                    ? 'text-blue-700 bg-blue-100 border-blue-200' 
                                                    : reg?.display_status === 'Completed Requirements'
                                                    ? 'text-green-700 bg-green-100 border-green-200'
                                                    : getEventStatusColor(ev?.status)
                                            }`}>
                                                {reg?.display_status || ev?.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onViewEventDetails(ev, reg)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewRequirements(ev, reg)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="View Requirements"
                                                >
                                                    <List className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        
        {/* Requirements Modal */}
        <EventRequirementsModal
            isOpen={showRequirementsModal}
            onClose={() => setShowRequirementsModal(false)}
            event={selectedEvent}
            registration={selectedRegistration}
            onStatusUpdate={onStatusUpdate}
        />
        </>
    );
};

export default RegisteredEventTable;

