import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

const EnhancedModalFooter = ({ 
    currentStep, 
    totalSteps, 
    onPrev, 
    onNext, 
    onSubmit, 
    isSubmitting,
    canProceed = true,
    isLastStep = false
}) => {
    const isFirstStep = currentStep === 1;
    const isLastStepActual = currentStep === totalSteps;

    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                {/* Previous Button */}
                <button
                    onClick={onPrev}
                    disabled={isFirstStep}
                    className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${isFirstStep 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300'
                        }
                    `}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>

                {/* Step Indicator Dots */}
                <div className="flex items-center space-x-2 order-2 sm:order-1">
                    {Array.from({ length: totalSteps }, (_, index) => (
                        <div
                            key={index}
                            className={`
                                w-2 h-2 rounded-full transition-all duration-300
                                ${index + 1 <= currentStep 
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-300'
                                }
                            `}
                        />
                    ))}
                </div>

                {/* Next/Submit Button */}
                <div className="order-1 sm:order-3">
                {isLastStepActual ? (
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting || !canProceed}
                        className={`
                            flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200
                            ${isSubmitting || !canProceed
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Complete Registration</span>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`
                            flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                            ${!canProceed
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
                </div>
            </div>

            {/* Help Text */}
            <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                    {isLastStepActual 
                        ? 'Review your information before submitting'
                        : `Step ${currentStep} of ${totalSteps} - ${getStepDescription(currentStep)}`
                    }
                </p>
            </div>
        </div>
    );
};

const getStepDescription = (step) => {
    switch (step) {
        case 1:
            return 'Verify your personal information';
        case 2:
            return 'Add emergency contact details (optional)';
        case 3:
            return 'Review and confirm your registration';
        default:
            return '';
    }
};

export default EnhancedModalFooter;
