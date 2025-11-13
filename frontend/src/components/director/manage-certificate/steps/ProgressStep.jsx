import React from 'react';
import { Check } from "lucide-react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Select" },
    { number: 2, label: "Category" },
    { number: 3, label: "Confirm" },
    { number: 4, label: "Done", isComplete: true }
  ];

  return (
    <div className="hidden md:flex items-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className={`flex items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.number 
                ? step.isComplete && currentStep >= 4 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}>
              {step.isComplete && currentStep >= 4 ? <Check size={16} /> : step.number}
            </div>
            <span className="ml-2 font-medium">{step.label}</span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`w-8 h-1 ${
              currentStep > step.number 
                ? step.number === 3 ? 'bg-green-600' : 'bg-blue-600'
                : 'bg-gray-200'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;