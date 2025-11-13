import React from 'react';
import { Check } from 'lucide-react';

const BeneficiaryStepIndicator = ({ currentStep, totalSteps }) => {
    const steps = [
        { number: 1, title: 'Personal Info', description: 'Verify your details' },
        { number: 2, title: 'Needs Assessment', description: 'Tell us your needs' },
        { number: 3, title: 'ID Verification', description: 'Provide valid ID' },
        { number: 4, title: 'Review', description: 'Confirm registration' }
    ];

    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                const isUpcoming = currentStep < step.number;

                return (
                    <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                                    isCompleted
                                        ? 'bg-green-600 text-white'
                                        : isCurrent
                                        ? 'bg-green-100 text-green-600 border-2 border-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p
                                    className={`text-xs font-medium ${
                                        isCurrent || isCompleted
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {step.title}
                                </p>
                                <p
                                    className={`text-xs ${
                                        isCurrent || isCompleted
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                                    currentStep > step.number
                                        ? 'bg-green-600'
                                        : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BeneficiaryStepIndicator;
