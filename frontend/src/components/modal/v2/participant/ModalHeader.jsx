import React from 'react';
import { X } from 'lucide-react';
import ProgressBar from '../../../common/participant/event_registration/ProgressBar';

const ModalHeader = ({ onClose, currentStep, totalSteps, eventData }) => (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 overflow-hidden px-6 py-4 text-white relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
      
      <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
      <p className="text-purple-100 text-sm">{eventData?.title}</p>
      
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </div>
);

export default ModalHeader