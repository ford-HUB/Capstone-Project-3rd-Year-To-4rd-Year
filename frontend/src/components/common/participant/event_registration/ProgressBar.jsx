import React from 'react';
import { Check } from 'lucide-react';

const ProgressBar = ({ currentStep, totalSteps }) => (
    <div className="mt-4 flex items-center space-x-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              step <= currentStep
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white/60'
            }`}
          >
            {step < currentStep ? <Check size={14} /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 transition-colors duration-300 ${
                step < currentStep ? 'bg-white' : 'bg-white/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
);

export default ProgressBar;