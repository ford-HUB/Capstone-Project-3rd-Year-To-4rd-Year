import React from 'react';
import { Calendar, MapPin, Users, Clock, FileText } from 'lucide-react';
import { formatDateTime, getEventDuration } from '../../../../utils/dateUtils.js';
import { getEventStatusColor, getAvatar } from '../../../../utils/statusUtils.js';
import ProofUploadButton from '../../../participant/ProofUploadButton.jsx';
import '../../../../styles/scrollbar.css'

const EventDetailsModal = ({
    isOpen,
    onClose,
    event,
    registration,
    onStatusUpdate
}) => {
    if (!isOpen || !event || !registration) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                {getAvatar(event?.title)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {event?.title}
                                </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                        !registration?.proof_uploaded && event?.status === 'Completed' 
                            ? 'text-orange-700 bg-orange-100 border-orange-200' 
                            : getEventStatusColor(event?.status)
                    }`}>
                        {!registration?.proof_uploaded && event?.status === 'Completed' ? 'Pending Requirements' : event?.status}
                    </span>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {event?.description}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Event Schedule</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>Start: {formatDateTime(event?.event_started)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>End: {formatDateTime(event?.event_ended)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-purple-500" />
                                        <span>Duration: {getEventDuration(event?.event_started, event?.event_ended)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <span>{event?.location || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Users className="w-4 h-4 text-green-500" />
                                        <span>{event?.participants || 0}/{event?.max_participants || 0} participants</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium text-gray-700">Proof Upload</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        registration?.proof_uploaded
                                            ? 'text-green-700 bg-green-100'
                                            : 'text-orange-700 bg-orange-100'
                                    }`}>
                                        {registration?.proof_uploaded ? 'Uploaded' : 'Pending'}
                                    </span>
                                </div>
                                
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                            <ProofUploadButton 
                                event={event} 
                                registration={registration}
                                onStatusUpdate={onStatusUpdate}
                            />
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
