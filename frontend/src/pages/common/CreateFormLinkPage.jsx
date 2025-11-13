import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, FileText, Globe, CheckCircle, Users } from 'lucide-react';
import { useFormStore } from '../../store/common/useFormStore.js';
import { formLinkSchema, stepSchemas } from '../../forms/FormLinkSchema.js';

// Import reusable components
import FormLinkStepHeader from '../../components/common/form-link/FormLinkStepHeader.jsx';
import FormLinkNavigation from '../../components/common/form-link/FormLinkNavigation.jsx';
import StepOneEventSelection from '../../components/common/form-link/steps/StepOneEventSelection.jsx';
import StepTwoTargetRole from '../../components/common/form-link/steps/StepTwoTargetRole.jsx';
import StepThreeFormDetails from '../../components/common/form-link/steps/StepThreeFormDetails.jsx';
import StepFourGoogleFormLink from '../../components/common/form-link/steps/StepFourGoogleFormLink.jsx';
import StepFiveReview from '../../components/common/form-link/steps/StepFiveReview.jsx';

const CreateFormLinkPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Zustand store
    const { 
        events, 
        loading, 
        error,
        formLinkStatus,
        getEventsV2, 
        getEventFormLinkStatus,
        submitEventGoogleFormLink 
    } = useFormStore();
    
    // React Hook Form setup
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
        reset
    } = useForm({
        resolver: zodResolver(formLinkSchema),
        defaultValues: {
            event_id: '',
            title: '',
            description: '',
            form_link: '',
            sheet_link: '',
            target_role: ''
        },
        mode: 'onChange'
    });

    const steps = [
        { id: 1, title: 'Select Event', description: 'Choose the event for your form', icon: Calendar },
        { id: 2, title: 'Target Role', description: 'Select who can access this form', icon: Users },
        { id: 3, title: 'Form Details', description: 'Add title and description', icon: FileText },
        { id: 4, title: 'Google Form Link', description: 'Paste your Google Form URL', icon: Globe },
        { id: 5, title: 'Review & Submit', description: 'Review and create your form link', icon: CheckCircle }
    ];

    // Load events on component mount with filtering
    useEffect(() => {
        getEventsV2({
            exclude_with_forms: 'true'
        });
    }, [getEventsV2]);

    // Watch for target_role changes - no filtering, just show visual indicators
    useEffect(() => {
        const targetRole = watch('target_role');
        
        // Don't filter events, just let the user see all events
        // The backend will prevent duplicate submissions
        // Visual indicators will show which roles already have forms
    }, [watch('target_role')]);

    // Watch for event selection changes and fetch form link status
    useEffect(() => {
        const eventId = watch('event_id');
        if (eventId) {
            getEventFormLinkStatus(eventId);
        }
    }, [watch('event_id'), getEventFormLinkStatus]);

    // Watch form values for real-time validation
    const watchedValues = watch();

    // Step navigation functions
    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    // Validate current step using Zod schemas
    const validateCurrentStep = async () => {
        const currentStepSchema = stepSchemas[`step${currentStep}`];
        if (!currentStepSchema) return true;

        const fieldsToValidate = Object.keys(currentStepSchema.shape);
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };

    // Handle next step
    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid) {
            nextStep();
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        const success = await submitEventGoogleFormLink(data);
        
        if (success) {
            // Reset form
            reset();
            setCurrentStep(1);
            
            // Navigate back or to form list
            navigate('/director/form-list');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOneEventSelection register={register} errors={errors} events={events} loading={loading} />;
            case 2:
                return <StepTwoTargetRole watchedValues={watchedValues} setValue={setValue} errors={errors} formLinkStatus={formLinkStatus} />;
            case 3:
                return <StepThreeFormDetails register={register} errors={errors} watchedValues={watchedValues} />;
            case 4:
                return <StepFourGoogleFormLink register={register} errors={errors} watchedValues={watchedValues} />;
            case 5:
                return <StepFiveReview watchedValues={watchedValues} events={events} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Step Progress */}
            <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const isClickable = currentStep > step.id || (currentStep === step.id);
                            
                            return (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={() => isClickable && goToStep(step.id)}
                                            disabled={!isClickable}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                                                isCompleted 
                                                    ? 'bg-green-500 text-white shadow-lg' 
                                                    : isActive 
                                                        ? 'bg-blue-500 text-white shadow-lg scale-110' 
                                                        : 'bg-gray-200 text-gray-500'
                                            } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </button>
                                        <div className="mt-2 text-center">
                                            <p className={`text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                                            currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="backdrop-blur-sm rounded-xl overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {renderStep()}
                            
                            <FormLinkNavigation
                                currentStep={currentStep}
                                totalSteps={steps.length}
                                onPrevious={prevStep}
                                onNext={handleNext}
                                isLoading={loading}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFormLinkPage;