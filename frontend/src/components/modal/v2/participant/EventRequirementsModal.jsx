import React, { useState } from 'react';
import { X, CheckCircle, Upload, FileText } from 'lucide-react';
import ProofUploadButton from '../../../participant/ProofUploadButton.jsx';

const EventRequirementsModal = ({
    isOpen,
    onClose,
    event,
    registration,
    onStatusUpdate
}) => {
    if (!isOpen || !event) return null;

    const requirements = [
        {
            id: 1,
            title: "Event Participation Photos",
            description: "Upload clear photos showing your participation in the event",
            completed: registration?.proof_uploaded || false,
            icon: Upload
        },
        {
            id: 2,
            title: "Evaluation Form",
            description: "Complete the evaluation form sent to your email",
            completed: registration?.proof_uploaded || false, // Both requirements complete when proof is uploaded
            icon: FileText
        }
    ];


    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Event Requirements</h2>
                            <p className="text-gray-600 mt-1">{event.title}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {requirements.map((requirement) => {
                            const IconComponent = requirement.icon;
                            return (
                                <div
                                    key={requirement.id}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        requirement.completed
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-lg ${
                                            requirement.completed
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {requirement.completed ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <IconComponent className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${
                                                requirement.completed ? 'text-green-800' : 'text-gray-900'
                                            }`}>
                                                {requirement.title}
                                            </h3>
                                            <p className={`text-sm mt-1 ${
                                                requirement.completed ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                                {requirement.description}
                                            </p>
                                            {requirement.completed && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100 mt-2">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <p>Complete all requirements to finish your participation</p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                {!registration?.proof_uploaded && (
                                    <ProofUploadButton 
                                        event={event} 
                                        registration={registration}
                                        onStatusUpdate={onStatusUpdate}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRequirementsModal;
