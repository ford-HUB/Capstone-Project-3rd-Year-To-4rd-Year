import React from 'react';

const StepProgress = ({ currentStep, totalSteps = 3 }) => {
  const steps = [
    { id: 1, label: 'Amount' },
    { id: 2, label: 'Payment' },
    { id: 3, label: 'Preferences' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step.id 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.id}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {steps.map(step => (
          <span key={step.id}>{step.label}</span>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
