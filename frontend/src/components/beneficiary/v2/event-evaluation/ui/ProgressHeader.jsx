import React from 'react';

const ProgressHeader = ({ 
  currentStep, 
  totalSteps, 
  steps, 
  title = "Beneficiary Event Evaluation",
  description = "Share your experience to help us improve our events"
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-blue-100">{description}</p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-blue-100">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-blue-500 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold">{steps[currentStep - 1]?.title}</h2>
        <p className="text-blue-100 text-sm">{steps[currentStep - 1]?.description}</p>
      </div>
    </div>
  );
};

export default ProgressHeader;
