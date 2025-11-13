import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Eye, List, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { formatDate, getEventDuration } from '../../../../utils/dateUtils.js';
import { getEventStatusColor, getProofStatusColor, getProofStatusText, getAvatar } from '../../../../utils/statusUtils.js';
import ProofUploadButton from '../../ProofUploadButton.jsx';
import EventRequirementsModal from '../../../modal/v2/participant/EventRequirementsModal.jsx';
import CertificateRequirementIndicator from '../../../certificate/CertificateRequirementIndicator.jsx';

const RegisteredEventCard = ({
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((reg) => {
                const ev = reg?.Event;
                return (
                    <div key={reg?.event_registration_id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                    {getAvatar(ev?.title)}
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                    reg?.display_status === 'Completed - Requirements Needed'
                                        ? 'text-blue-700 bg-blue-100 border-blue-200' 
                                        : reg?.display_status === 'Completed Requirements'
                                        ? 'text-green-700 bg-green-100 border-green-200'
                                        : getEventStatusColor(ev?.status)
                                }`}>
                                    {reg?.display_status || ev?.status}
                                </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {ev?.title ?? 'Untitled Event'}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {ev?.description}
                            </p>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>{formatDate(ev?.event_started)} - {formatDate(ev?.event_ended)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="truncate">{ev?.location || 'TBA'}</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Users className="w-4 h-4 text-green-500" />
                                        <span>{ev?.participants || 0}/{ev?.max_participants || 0} participants</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-purple-500" />
                                        <span>{getEventDuration(ev?.event_started, ev?.event_ended)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Certificate Requirements Instruction for Completed Events */}
                            {ev?.status === 'Completed' && reg?.display_status === 'Completed - Requirements Needed' && (
                                <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-3 mb-4">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-blue-900 mb-1">
                                                📜 Certificate Requirements
                                            </h4>
                                            <p className="text-sm text-blue-800">
                                                <strong>To receive your volunteer certificate, you must upload proof of your participation.</strong>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <h5 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                                                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                                <span className="text-sm">Upload Proof</span>
                                            </h5>
                                            <p className="text-xs text-blue-700">
                                                Click "Upload Proof" to submit evidence of your participation.
                                            </p>
                                        </div>
                                        
                                        <div className="bg-green-50 rounded-lg p-3">
                                            <h5 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
                                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                                <span className="text-sm">Requirements</span>
                                            </h5>
                                            <ul className="text-xs text-green-700 space-y-1">
                                                <li>• Photos from the event</li>
                                                <li>• Clear and legible files</li>
                                                <li>• Max 5 files allowed</li>
                                            </ul>
                                        </div>
                                        
                                        <div className="bg-yellow-50 rounded-lg p-3">
                                            <h5 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
                                                <span className="w-5 h-5 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                                <span className="text-sm">Next Steps</span>
                                            </h5>
                                            <p className="text-xs text-yellow-700">
                                                We'll review your proof and generate your certificate once approved.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-sm text-blue-700">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Certificate will be generated after proof approval</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Navigate to proof upload page
                                                console.log('Navigate to proof upload for event:', ev?.event_id);
                                            }}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Proof</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onViewEventDetails(ev, reg)}
                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View Details</span>
                                </button>
                                <button
                                    onClick={() => handleViewRequirements(ev, reg)}
                                    className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                >
                                    <List className="w-4 h-4" />
                                    <span>View Requirements</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
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

export default RegisteredEventCard;
