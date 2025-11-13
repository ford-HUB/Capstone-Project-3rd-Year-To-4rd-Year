import React from 'react';
import { Heart } from 'lucide-react';

const CancelRegistrationModal = ({ isOpen, setOpen, eventData, onConfirm, isProcessing }) => {

    if(!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-white/20">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/25">
                            <img className='rounded-md ' src={eventData.event_image} alt="" srcset="" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Leave this event?
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We'll remove you from{' '}
                                <strong>{eventData.title}</strong>. You can
                                always join back anytime.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={onConfirm}
                                disabled={isProcessing}
                                className="w-full cursor-pointer py-3 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-all duration-200 shadow-lg shadow-red-500/25">
                                {isProcessing
                                    ? 'Leaving...'
                                    : 'Yes, leave event'}
                            </button>
                            <button
                                onClick={setOpen}
                                disabled={isProcessing}
                                className="w-full cursor-pointer py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                                Keep me registered
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CancelRegistrationModal;
