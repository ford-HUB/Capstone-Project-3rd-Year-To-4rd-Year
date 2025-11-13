import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const BeneficiaryEnhancedModalFooter = ({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    onSubmit,
    isSubmitting,
    canProceed,
    isLastStep
}) => {
    return (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={onPrev}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                i + 1 <= currentStep
                                    ? 'bg-green-600'
                                    : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {isLastStep ? (
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting || !canProceed}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            isSubmitting || !canProceed
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Complete Registration</span>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            !canProceed
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                    >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default BeneficiaryEnhancedModalFooter;
