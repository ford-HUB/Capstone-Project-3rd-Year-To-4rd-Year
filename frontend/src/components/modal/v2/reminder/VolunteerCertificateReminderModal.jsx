import React from 'react';
import { X, Award, CheckCircle, Clock } from 'lucide-react';

const VolunteerCertificateReminderModal = ({ open, setOpen, eventData }) => {
    const handleClose = () => {
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed bg-black/50 backdrop-blur-[2px] inset-0 z-1000 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                        <Award className="w-8 h-8 text-yellow-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Certificate Requirements
                    </h3>

                    <p className="text-gray-600 mb-6">
                        To receive your volunteer certificate, you must complete the following requirements:
                    </p>

                    <div className="space-y-3 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Complete event evaluation and feedback
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Upload proof of participation (photos)
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Meet minimum attendance hours
                            </span>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Important:</p>
                                <p className="text-blue-700">
                                    You can complete these requirements later from your registered events page. 
                                    Your certificate will be generated once all requirements are met.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium">
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VolunteerCertificateReminderModal;

