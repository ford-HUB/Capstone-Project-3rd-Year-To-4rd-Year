import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Static star rating components (keeping as requested)
import StepOneExperienceRating from './event-feedback-evaluation/steps/StepOneExperienceRating';
import StepThreeSupportCommunication from './event-feedback-evaluation/steps/StepThreeSupportCommunication';
import StepFourFutureEngagement from './event-feedback-evaluation/steps/StepFourFutureEngagement';
import StepFiveFinalComments from './event-feedback-evaluation/steps/StepFiveFinalComments';
import SuccessMessage from './event-feedback-evaluation/custom-message/SuccessMessage';
import ProgressHeader from './event-feedback-evaluation/ui/ProgressHeader';
import Navigation from './event-feedback-evaluation/navigation/Navigation';

// Dynamic form components
import DynamicFormRenderer from '../../common/DynamicFormRenderer.jsx';

// Services and stores
import { useFeedbackStore } from '../../../store/participant/useFeedbackStore.js';
import { useFormStore } from '../../../store/common/useFormStore.js';
import { decryptEventId } from '../../../utils/crypto.js';

// Static evaluation schema (keeping star ratings as requested)
const staticEvaluationSchema = z.object({
    // Static star ratings - keeping as requested
    overallRating: z
        .number({ required_error: 'Overall rating is required.' })
        .min(1, { message: 'Overall rating must be at least 1.' })
        .max(5, { message: 'Overall rating must not exceed 5.' }),

    contentQuality: z
        .number({ required_error: 'Content quality rating is required.' })
        .min(1, { message: 'Content quality must be at least 1.' })
        .max(5, { message: 'Content quality must not exceed 5.' }),

    organizationRating: z
        .number({ required_error: 'Organization rating is required.' })
        .min(1, { message: 'Organization rating must be at least 1.' })
        .max(5, { message: 'Organization rating must not exceed 5.' }),

    venueRating: z
        .number({ required_error: 'Venue rating is required.' })
        .min(1, { message: 'Venue rating must be at least 1.' })
        .max(5, { message: 'Venue rating must not exceed 5.' }),

    guidanceDuringEvent: z
        .number({ required_error: 'Guidance & support rating is required.' })
        .min(1, { message: 'Guidance & support rating must be at least 1.' })
        .max(5, { message: 'Guidance & support rating must not exceed 5.' }),

    communicationRating: z
        .number({ required_error: 'Communication rating is required.' })
        .min(1, { message: 'Communication rating must be at least 1.' })
        .max(5, { message: 'Communication rating must not exceed 5.' }),

    // Static text fields - keeping as requested
    mostValuable: z.string().optional(),
    leastValuable: z.string().optional(),
    suggestions: z.string().optional(),

    recommendEvent: z.enum(
        ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
        { required_error: 'Please choose one of the options that we provided.' }
    ),

    futureTopics: z.string().optional(),

    futureParticipation: z.enum(
        ['Yes, definitely', 'Yes, probably', 'Maybe', 'Probably not', 'No'],
        { required_error: 'Please choose one of the options that we provided' }
    ),

    additionalComments: z.string().optional(),

    shareTestimonial: z.boolean().optional(),
});

const DynamicEventEvaluation = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [dynamicForms, setDynamicForms] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);

    const { submitEventEvaluation } = useFeedbackStore();
    const { getFormsForReflection, getEvents, events } = useFormStore();
    const [searchQuery] = useSearchParams();
    const token = searchQuery.get('token');

    // Generate dynamic schema based on available forms
    const generateDynamicSchema = () => {
        let dynamicFields = {};
        
        dynamicForms.forEach(form => {
            if (form.form_schema && form.form_schema.fields) {
                form.form_schema.fields.forEach(field => {
                    // Skip star rating fields as they're handled statically
                    if (field.type === 'rating') return;
                    
                    let fieldSchema;
                    switch (field.type) {
                        case 'text':
                        case 'email':
                        case 'textarea':
                            fieldSchema = field.required 
                                ? z.string().min(1, { message: `${field.label} is required.` })
                                : z.string().optional();
                            break;
                        case 'number':
                            fieldSchema = field.required
                                ? z.number({ required_error: `${field.label} is required.` })
                                : z.number().optional();
                            break;
                        case 'select':
                        case 'radio':
                            if (field.options && field.options.length > 0) {
                                fieldSchema = field.required
                                    ? z.enum(field.options, { required_error: `${field.label} is required.` })
                                    : z.enum(field.options).optional();
                            } else {
                                fieldSchema = z.string().optional();
                            }
                            break;
                        case 'checkbox':
                            fieldSchema = z.array(z.string()).optional();
                            break;
                        default:
                            fieldSchema = z.string().optional();
                    }
                    
                    // Use form_id as prefix to avoid conflicts
                    dynamicFields[`${form.form_id}_${field.id}`] = fieldSchema;
                });
            }
        });
        
        return z.object(dynamicFields);
    };

    const combinedSchema = z.object({
        ...staticEvaluationSchema.shape,
        ...generateDynamicSchema().shape
    });

    const {
        register,
        handleSubmit,
        control,
        trigger,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(combinedSchema),
        defaultValues: {
            // Static defaults
            overallRating: 0,
            contentQuality: 0,
            organizationRating: 0,
            venueRating: 0,
            mostValuable: '',
            leastValuable: '',
            suggestions: '',
            guidanceDuringEvent: 0,
            communicationRating: 0,
            recommendEvent: 'Maybe',
            futureTopics: '',
            futureParticipation: 'Maybe',
            additionalComments: '',
            shareTestimonial: false,
        },
    });

    // Load dynamic forms based on event
    useEffect(() => {
        const loadDynamicForms = async () => {
            if (!token) return;
            
            try {
                const eventId = decryptEventId(token);
                setCurrentEvent(eventId);
                
                // Get events to find the current event details
                await getEvents();
                
                // Get dynamic forms for this event
                await getFormsForReflection({ event_id: eventId });
                
                // Get forms from store
                const { reflectionForms } = useFormStore.getState();
                setDynamicForms(reflectionForms || []);
                
            } catch (error) {
                console.error('Error loading dynamic forms:', error);
            }
        };

        loadDynamicForms();
    }, [token, getFormsForReflection, getEvents]);

    const totalSteps = 5;
    const steps = [
        { id: 1, title: "Experience Rating", description: "Rate your volunteer experience" },
        { id: 2, title: "Dynamic Questions", description: "Answer event-specific questions" },
        { id: 3, title: "Support & Communication", description: "Evaluate coordination" },
        { id: 4, title: "Future Engagement", description: "Your future interest" },
        { id: 5, title: "Final Comments", description: "Additional feedback" },
    ];

    // Define required fields per step
    const stepValidations = {
        1: ["overallRating", "contentQuality", "organizationRating", "venueRating"],
        2: [], // Dynamic fields validation will be handled by the dynamic form
        3: ["guidanceDuringEvent", "communicationRating"],
        4: ["recommendEvent", "futureParticipation"],
        5: [], // Step 5 is optional
    };

    // Handle Next button
    const handleNext = async () => {
        const fieldsToValidate = stepValidations[currentStep] || [];
        let isValid = true;

        // Only validate required fields for current step
        if (currentStep !== totalSteps && fieldsToValidate.length > 0) {
            isValid = await trigger(fieldsToValidate);
        }

        if (!isValid) return;

        // Only move to next step if we're not on the last step
        if (currentStep < totalSteps) {
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, 0);
        }
    };

    const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const onSubmit = async (formData) => {
        try {
            // Separate static and dynamic data
            const staticData = {
                overallRating: formData.overallRating,
                contentQuality: formData.contentQuality,
                organizationRating: formData.organizationRating,
                venueRating: formData.venueRating,
                mostValuable: formData.mostValuable,
                leastValuable: formData.leastValuable,
                suggestions: formData.suggestions,
                guidanceDuringEvent: formData.guidanceDuringEvent,
                communicationRating: formData.communicationRating,
                recommendEvent: formData.recommendEvent,
                futureTopics: formData.futureTopics,
                futureParticipation: formData.futureParticipation,
                additionalComments: formData.additionalComments,
                shareTestimonial: formData.shareTestimonial,
            };

            // Submit static evaluation first
            const success = await submitEventEvaluation(currentEvent, staticData);
            if (!success) return;

            // Submit dynamic form responses
            for (const form of dynamicForms) {
                if (form.form_schema && form.form_schema.fields) {
                    const dynamicData = {};
                    form.form_schema.fields.forEach(field => {
                        const fieldKey = `${form.form_id}_${field.id}`;
                        if (formData[fieldKey] !== undefined) {
                            dynamicData[field.id] = formData[fieldKey];
                        }
                    });

                    if (Object.keys(dynamicData).length > 0) {
                        // Submit dynamic form response
                        const response = await fetch(`/api/form/${form.form_id}/submit`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include', // Include cookies for authentication
                            body: JSON.stringify({ response_data: dynamicData })
                        });

                        if (!response.ok) {
                            console.error(`Failed to submit form ${form.form_id}`);
                        }
                    }
                }
            }

            setSubmitted(true);

            setTimeout(() => {
                setSubmitted(false);
                window.document.location.replace(`${import.meta.env.VITE_FRONTEND_URL}/participant/dashboard`);
                setCurrentStep(1);
                reset();
            }, 3000);

        } catch (error) {
            console.error('Error submitting evaluation:', error);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOneExperienceRating control={control} errors={errors} />;
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Event-Specific Questions</h3>
                        {dynamicForms.length > 0 ? (
                            dynamicForms.map(form => (
                                <div key={form.form_id} className="border rounded-lg p-4 bg-gray-50">
                                    <h4 className="font-medium text-gray-700 mb-4">{form.title}</h4>
                                    {form.description && (
                                        <p className="text-sm text-gray-600 mb-4">{form.description}</p>
                                    )}
                                    <DynamicFormRenderer
                                        formSchema={form.form_schema}
                                        onSubmit={() => {}} // Handled by main form
                                        className="space-y-4"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No additional questions for this event.
                            </p>
                        )}
                    </div>
                );
            case 3:
                return <StepThreeSupportCommunication control={control} errors={errors} />;
            case 4:
                return <StepFourFutureEngagement control={control} register={register} errors={errors} />;
            case 5:
                return <StepFiveFinalComments control={control} register={register} errors={errors} />;
            default:
                return null;
        }
    };

    if (submitted) {
        return <SuccessMessage />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                <ProgressHeader currentStep={currentStep} totalSteps={totalSteps} steps={steps} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 min-h-[500px]">{renderStep()}</div>

                    <Navigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
};

export default DynamicEventEvaluation;
