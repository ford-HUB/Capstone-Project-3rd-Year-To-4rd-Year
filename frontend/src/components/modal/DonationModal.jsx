import React from 'react'
import { X, CheckCircle2, XCircle  } from 'lucide-react';

const DonationModal = ({selectedEvent, open, setOpen, action, onConfirm}) => {
    
    if(!open) return null
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Donation Event
                    </h2>
                    <button 
                        onClick={setOpen}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Are you sure you want to {action === 'open' ? 'open' : 'close'} the event for:
                        <span className="font-medium text-gray-800 px-2">{selectedEvent}</span>
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={setOpen}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(action)}
                        className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                            action === 'open' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {action === 'open' ? (
                            <>
                                <CheckCircle2 size={20} />
                                open
                            </>
                        ) : (
                            <>
                                <XCircle size={20} />
                                Cancel
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DonationModal