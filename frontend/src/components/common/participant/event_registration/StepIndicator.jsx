import React from 'react';
import { CheckCircle, Circle, User, Shield, Calendar } from 'lucide-react';

const StepIndicator = ({ currentStep, totalSteps }) => {
    const steps = [
        { id: 1, title: 'Personal Info', icon: User, description: 'Your details' },
        { id: 2, title: 'Emergency Contact', icon: Shield, description: 'Safety information' },
        { id: 3, title: 'Event Details', icon: Calendar, description: 'Final confirmation' }
    ];

    return (
        <div className="space-y-4 mb-8">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={currentStep}
                    aria-valuemin={1}
                    aria-valuemax={totalSteps}
                    aria-label={`Registration progress: step ${currentStep} of ${totalSteps}`}
                />
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const isUpcoming = currentStep < step.id;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div 
                                className={`
                                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                                    ${isCompleted 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : isCurrent 
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg scale-110' 
                                            : 'bg-white border-gray-300 text-gray-400'
                                    }
                                `}
                                role="img"
                                aria-label={`Step ${step.id}: ${step.title} - ${isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming'}`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6" />
                                ) : (
                                    <Icon className="w-6 h-6" />
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p className={`text-sm font-medium ${
                                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`
                                flex-1 h-0.5 mx-2 transition-all duration-300
                                ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                            `} />
                        )}
                    </React.Fragment>
                );
            })}
            </div>
        </div>
    );
};

export default StepIndicator;
