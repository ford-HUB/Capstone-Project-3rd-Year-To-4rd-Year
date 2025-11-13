import React from 'react';
import { X } from 'lucide-react';
import { encryptEventId } from '../../../../utils/crypto.js';

const AskingEvaluationModal = ({ open, setOpen, eventData }) => {
    const handleEvaluateNow = () => {
        window.location.replace(
            `${import.meta.env.VITE_FRONTEND_URL}/event-feedback-evaluation?token=${encryptEventId(eventData.event_id)}`
        );
    };

    const handleEvaluateLater = () => {
        console.log('User chose to evaluate later');
        setOpen(false)
        // Add your "remind later" logic here
    };

    if(!open) return null

    return (
        <div className="fixed bg-black/50 backdrop-blur-[2px]  inset-0 z-1000 flex items-center justify-center">
            {/* <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}><X/></div> */}

            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
                {/* Close button */}
                <button
                    onClick={setOpen}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                        <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Event Evaluation
                    </h3>

                    <p className="text-gray-600 mb-6">
                        Would you like to evaluate the event to receive your
                        certificate?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={handleEvaluateNow}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium">
                            Evaluate Now
                        </button>

                        <button
                            onClick={handleEvaluateLater}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskingEvaluationModal;
