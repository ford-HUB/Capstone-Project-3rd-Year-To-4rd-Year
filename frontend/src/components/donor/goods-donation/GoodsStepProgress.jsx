import React from 'react';

const GoodsStepProgress = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Goods', description: 'What you\'re donating' },
    { number: 2, label: 'Drop-off', description: 'When & where' },
    { number: 3, label: 'Confirm', description: 'Review & submit' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step.number 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="font-medium">{step.label}</div>
            <div className="text-xs">{step.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoodsStepProgress;
