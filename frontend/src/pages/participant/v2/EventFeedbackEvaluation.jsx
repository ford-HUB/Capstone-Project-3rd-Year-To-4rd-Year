import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { eventEvaluationSchema } from "../../../forms/FeedbackSchema.js";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';

import StepOneExperienceRating from "../../../components/participant/v2/event-feedback-evaluation/steps/StepOneExperienceRating";
import StepTwoDetailedFeedback from "../../../components/participant/v2/event-feedback-evaluation/steps/StepTwoDetailedFeedback";
import StepThreeSupportCommunication from "../../../components/participant/v2/event-feedback-evaluation/steps/StepThreeSupportCommunication";
import StepFourFutureEngagement from "../../../components/participant/v2/event-feedback-evaluation/steps/StepFourFutureEngagement";
import StepFiveFinalComments from "../../../components/participant/v2/event-feedback-evaluation/steps/StepFiveFinalComments";
import SuccessMessage from "../../../components/participant/v2/event-feedback-evaluation/custom-message/SuccessMessage";
import ProgressHeader from "../../../components/participant/v2/event-feedback-evaluation/ui/ProgressHeader";
import Navigation from "../../../components/participant/v2/event-feedback-evaluation/navigation/Navigation";
import StepHeader from "../../../components/participant/v2/event-feedback-evaluation/ui/StepHeader";

// Dynamic form components
import DynamicFormRenderer from "../../../components/common/DynamicFormRenderer.jsx";

// Services and stores
import { useFeedbackStore } from "../../../store/participant/useFeedbackStore.js";
import { useFormStore } from "../../../store/common/useFormStore.js";
import { useProofUploadStore } from "../../../store/participant/useProofUploadStore.js";
import { decryptEventId } from "../../../utils/crypto.js";

const EventFeedbackEvaluation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [dynamicForms, setDynamicForms] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { submitEventEvaluation } = useFeedbackStore();
  const { getFormsForReflection, getEvents, events, submitEventFormResponses } = useFormStore();
  const { markEvaluationCompleted } = useProofUploadStore();
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
          
          // Use form_id as prefix to avoid conflicts, ensure field key is a valid string
          const fieldKey = `${form.form_id}_${String(field.id)}`;
          dynamicFields[fieldKey] = fieldSchema;
        });
      }
    });
    
    return z.object(dynamicFields);
  };

  const combinedSchema = z.object({
    ...eventEvaluationSchema.shape,
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
      if (!token) {
        console.error('No token provided in URL');
        setLoading(false);
        return;
      }
      
      try {
        const eventId = decryptEventId(token);
        
        if (!eventId) {
          console.error('Failed to decrypt event ID from token:', token);
          setLoading(false);
          return;
        }
        
        setCurrentEvent(eventId);
        
        // Get events to find the current event details
        await getEvents();
        
        // Get dynamic forms for this event
        await getFormsForReflection({ event_id: eventId });
        
        // Get forms from store
        const { reflectionForms } = useFormStore.getState();
        setDynamicForms(reflectionForms || []);
        
        
        // Log form details for debugging
        if (reflectionForms && reflectionForms.length > 0) {
          reflectionForms.forEach(form => {
            // Form details available for debugging if needed
          });
        }
        
      } catch (error) {
        console.error('Error loading dynamic forms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDynamicForms();
  }, [token, getFormsForReflection, getEvents]);

  const totalSteps = 5;
  const steps = [
    { id: 1, title: "Experience Rating", description: "Rate your volunteer experience" },
    { id: 2, title: "Detailed Feedback", description: "Share your thoughts" },
    { id: 3, title: "Support & Communication", description: "Evaluate coordination" },
    { id: 4, title: "Future Engagement", description: "Your future interest" },
    { id: 5, title: "Final Comments", description: "Additional feedback" },
  ];

  // Define required fields per step
  const stepValidations = {
    1: ["overallRating", "contentQuality", "organizationRating", "venueRating"],
    2: dynamicForms.length > 0 ? [] : ["mostValuable", "leastValuable", "suggestions"], // Dynamic fields validation will be handled by the dynamic form
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
      // Defer state update to next tick to avoid morphing the clicked
      // Next button into a submit button within the same click event,
      // which can cause an unintended form submit.
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 0);
    }
    // If we're on the last step, do nothing (the submit button will handle submission)
  };
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (formData) => {
    try {
      // Validate that we have a valid event ID
      if (!currentEvent) {
        console.error('No valid event ID found. Cannot submit evaluation.');
        return;
      }


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

      // Mark evaluation as completed
      await markEvaluationCompleted(currentEvent);

      // Submit dynamic form responses using proper service/store pattern
      if (dynamicForms.length > 0) {
        const formResponses = [];
        
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
              formResponses.push({
                form_id: form.form_id,
                response_data: dynamicData
              });
            }
          }
        }

        if (formResponses.length > 0) {
          const formSubmissionSuccess = await submitEventFormResponses(formResponses);
          if (!formSubmissionSuccess) {
            console.error('Failed to submit some form responses');
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
        if (dynamicForms.length > 0) {
          return (
            <div className="space-y-6">
              {dynamicForms.map(form => (
                <div key={form.form_id} className="space-y-6">
                  <DynamicFormRenderer
                    formSchema={form.form_schema}
                    onSubmit={() => {}} // Handled by main form
                    className="space-y-6"
                    register={register}
                    control={control}
                    errors={errors}
                    formId={form.form_id}
                  />
                </div>
              ))}
            </div>
          );
        } else {
          return <StepTwoDetailedFeedback register={register} errors={errors} />;
        }
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

  if (loading || !currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-blue-100">Preparing your evaluation form</p>
          </div>
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {!currentEvent ? 'Validating event information...' : 'Loading evaluation form...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get the title and description from the first dynamic form, or use default
  const headerTitle = dynamicForms.length > 0 ? dynamicForms[0].title : "Volunteer Feedback";
  const headerDescription = dynamicForms.length > 0 ? dynamicForms[0].description : "Share your experience to help us improve";
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <ProgressHeader 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          steps={steps} 
          title={headerTitle}
          description={headerDescription}
        />

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

export default EventFeedbackEvaluation;
