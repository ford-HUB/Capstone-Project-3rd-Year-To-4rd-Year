import React from 'react';
import { X, Mail, CheckCircle, Clock } from 'lucide-react';

const BeneficiaryFeedbackReminderModal = ({ open, setOpen, eventData }) => {
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
                    <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Share Your Feedback
                    </h3>

                    <p className="text-gray-600 mb-6">
                        We value your experience! If you'd like to share feedback about this event, 
                        please check your Gmail for the evaluation form.
                    </p>

                    <div className="space-y-3 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Check your Gmail inbox for evaluation form
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Complete the form to help us improve
                            </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                                Your feedback is completely optional
                            </span>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-green-800">
                                <p className="font-medium mb-1">Note:</p>
                                <p className="text-green-700">
                                    The evaluation form will be sent to your registered email address. 
                                    You can complete it at your convenience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium">
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryFeedbackReminderModal;

