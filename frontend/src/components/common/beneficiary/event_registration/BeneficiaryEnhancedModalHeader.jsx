import React from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';
import dayjs from 'dayjs';

const BeneficiaryEnhancedModalHeader = ({ eventData, onClose, currentStep, totalSteps }) => {
    return (
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">Event Registration</h2>
                    <p className="text-green-100 text-sm">
                        Step {currentStep} of {totalSteps} - Register for assistance
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{eventData.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-200" />
                        <span className="text-green-100">
                            {dayjs(eventData.event_started).format('MMM D, YYYY')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-200" />
                        <span className="text-green-100">
                            {dayjs(eventData.event_started).format('h:mm A')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-200" />
                        <span className="text-green-100 truncate">
                            {eventData.location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryEnhancedModalHeader;
