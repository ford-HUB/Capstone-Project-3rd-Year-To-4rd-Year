import React from 'react';
import { X, Calendar, MapPin, Users, Clock } from 'lucide-react';

const EnhancedModalHeader = ({ eventData, onClose, currentStep, totalSteps }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 relative">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close registration modal"
                type="button"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Event Information */}
            <div className="pr-12">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 id="modal-title" className="text-2xl font-bold mb-2 line-clamp-2">{eventData.title}</h2>
                        <p id="modal-description" className="text-blue-100 text-sm line-clamp-2">{eventData.description}</p>
                    </div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-200" />
                        <div>
                            <p className="text-xs text-blue-200">Date</p>
                            <p className="text-sm font-medium">{formatDate(eventData.event_started)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-200" />
                        <div>
                            <p className="text-xs text-blue-200">Time</p>
                            <p className="text-sm font-medium">
                                {formatTime(eventData.event_started)} - {formatTime(eventData.event_ended)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-200" />
                        <div>
                            <p className="text-xs text-blue-200">Location</p>
                            <p className="text-sm font-medium line-clamp-1">{eventData.location}</p>
                        </div>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-200" />
                        <span className="text-sm text-blue-200">Registration Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{currentStep} of {totalSteps}</span>
                        <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedModalHeader;
