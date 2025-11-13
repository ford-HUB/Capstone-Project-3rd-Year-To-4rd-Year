import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const BeneficiaryActionsToggle = ({ 
    open, 
    setOpen, 
    onComplete, 
    modalPosition, 
    selectedRegistration 
}) => {
    const handleAction = async (action) => {
        onComplete({ action, registration: selectedRegistration });
        setOpen(false);
    };

    if (!open || !selectedRegistration) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-40 ${open ? 'visible' : 'hidden'}`}
                onClick={() => setOpen(false)}
            />
            
            {/* Dropdown */}
            <div 
                className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48"
                style={{
                    top: `${modalPosition.y}px`,
                    left: `${modalPosition.x}px`,
                    transform: 'translateX(-100%)'
                }}
            >
                <button
                    onClick={() => handleAction('view')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>

                <button
                    onClick={() => handleAction('approve')}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2"
                >
                    <CheckCircle className="w-4 h-4" />
                    Approve Registration
                </button>

                <button
                    onClick={() => handleAction('decline')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                    <XCircle className="w-4 h-4" />
                    Decline Registration
                </button>
            </div>
        </>
    );
};

export default BeneficiaryActionsToggle;
