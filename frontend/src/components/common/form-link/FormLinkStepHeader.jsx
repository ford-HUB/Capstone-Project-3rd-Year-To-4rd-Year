import React from 'react';

const FormLinkStepHeader = ({ 
  currentStep, 
  totalSteps, 
  steps, 
  title = "Upload Form Link",
  description = "Create a form link for your event"
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white mb-2">{title}</h1>
        <p className="text-blue-100 text-sm">{description}</p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-white">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-blue-100">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-blue-400 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-white">{steps[currentStep - 1]?.title}</h2>
        <p className="text-blue-100 text-sm">{steps[currentStep - 1]?.description}</p>
      </div>
    </div>
  );
};

export default FormLinkStepHeader;
