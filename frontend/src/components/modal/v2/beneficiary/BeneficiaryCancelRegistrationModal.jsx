import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';

const BeneficiaryCancelRegistrationModal = ({ isOpen, setOpen, eventData, onConfirm, isProcessing }) => {

    if(!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-white/20">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
                            <img className='rounded-md' src={eventData.event_image} alt="" srcSet="" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Cancel your registration?
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                You'll be removed from{' '}
                                <strong>{eventData.title}</strong>. You can
                                always register again if needed.
                            </p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-amber-700">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Important</span>
                            </div>
                            <p className="text-xs text-amber-600 mt-1">
                                Canceling may affect your assistance opportunities. Consider your decision carefully.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={onConfirm}
                                disabled={isProcessing}
                                className="w-full cursor-pointer py-3 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-all duration-200 shadow-lg shadow-red-500/25">
                                {isProcessing
                                    ? 'Canceling...'
                                    : 'Yes, cancel registration'}
                            </button>
                            <button
                                onClick={setOpen}
                                disabled={isProcessing}
                                className="w-full cursor-pointer py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                                Keep my registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BeneficiaryCancelRegistrationModal;
