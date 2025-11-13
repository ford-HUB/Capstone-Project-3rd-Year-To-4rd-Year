import React from "react";
import { CheckCircle } from "lucide-react";

const StepIndicator = ({ steps, currentStep, completedSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              currentStep > step.id || completedSteps.includes(step.id)
                ? 'bg-green-500 border-green-500 text-white' 
                : currentStep === step.id 
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {completedSteps.includes(step.id) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                currentStep === step.id ? 'text-blue-600' : 
                completedSteps.includes(step.id) ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.name}
              </div>
              <div className="text-xs text-gray-400 hidden sm:block">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              currentStep > step.id || completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default StepIndicator;
