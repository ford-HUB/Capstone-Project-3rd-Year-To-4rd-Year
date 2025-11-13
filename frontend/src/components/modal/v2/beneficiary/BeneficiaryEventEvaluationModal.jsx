import React, { useState } from 'react';
import { X, Star, MessageSquare, ThumbsUp, ThumbsDown, Send, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBeneficiaryEvaluationStore } from '../../../../store/beneficiary/useBeneficiaryEvaluationStore';
import { beneficiaryEvaluationSchema } from '../../../../forms/BeneficiaryEvaluationSchema.js';

// Static step components
import StepOneExperienceRating from '../../../beneficiary/v2/event-evaluation/steps/StepOneExperienceRating';
import StepTwoDetailedFeedback from '../../../beneficiary/v2/event-evaluation/steps/StepTwoDetailedFeedback';
import StepThreeFutureEngagement from '../../../beneficiary/v2/event-evaluation/steps/StepThreeFutureEngagement';
import StepFourFinalComments from '../../../beneficiary/v2/event-evaluation/steps/StepFourFinalComments';
import SuccessMessage from '../../../beneficiary/v2/event-evaluation/custom-message/SuccessMessage';
import ProgressHeader from '../../../beneficiary/v2/event-evaluation/ui/ProgressHeader';
import Navigation from '../../../beneficiary/v2/event-evaluation/navigation/Navigation';

// Dynamic form components
import DynamicFormRenderer from '../../../common/DynamicFormRenderer.jsx';


const BeneficiaryEventEvaluationModal = ({ 
  open, 
  setOpen, 
  eventData, 
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 4;


  // Use store for state management
  const { 
    formSchema,
    dynamicForms,
    isLoadingForm,
    formError,
    isSubmitting, 
    error,
    success,
    submitEvaluation,
    submitSingleFormResponse,
    submitMultipleFormResponses, 
    fetchFormSchema,
    clearState,
    clearFormState
  } = useBeneficiaryEvaluationStore();


  // Generate dynamic schema based on available forms from store
  const generateDynamicSchema = () => {
    let dynamicFields = {};
    
    // Use dynamicForms from store, or convert formSchema to array format
    const formsToProcess = dynamicForms.length > 0 ? dynamicForms : 
      (formSchema ? [{
        form_id: formSchema.form_id,
        title: formSchema.title,
        description: formSchema.description,
        form_schema: formSchema.form_schema
      }] : []);
    
    formsToProcess.forEach(form => {
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
          const fieldKey = `${form.form_id}_${String(field.id)}`;
          dynamicFields[fieldKey] = fieldSchema;
        });
      }
    });
    
    return z.object(dynamicFields);
  };

  const combinedSchema = z.object({
    ...beneficiaryEvaluationSchema.shape,
    ...generateDynamicSchema().shape
  });

  const { register, handleSubmit, watch, setValue, control, trigger, formState: { errors }, reset } = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      // Static defaults
      overallRating: 0,
      eventOrganization: 0,
      venueQuality: 0,
      staffSupport: 0,
      eventContent: 0,
      mostHelpful: '',
      leastHelpful: '',
      suggestions: '',
      wouldRecommend: 'Maybe',
      futureParticipation: 'Maybe',
      additionalComments: '',
      shareTestimonial: false,
    },
    mode: 'onChange'
  });

  const watchedValues = watch();
  
  // Debug form values changes
  React.useEffect(() => {
    console.log('📝 Form values changed:', watchedValues);
    
    // Show dynamic field keys specifically
    const dynamicFieldKeys = Object.keys(watchedValues).filter(key => 
      !['overallRating', 'eventOrganization', 'venueQuality', 'staffSupport', 'eventContent', 
        'mostHelpful', 'leastHelpful', 'suggestions', 'wouldRecommend', 'futureParticipation', 
        'additionalComments', 'shareTestimonial'].includes(key)
    );
    
    if (dynamicFieldKeys.length > 0) {
      console.log('🎯 Dynamic field keys in form:', dynamicFieldKeys);
      console.log('📊 Dynamic field values:', dynamicFieldKeys.reduce((acc, key) => {
        acc[key] = watchedValues[key];
        return acc;
      }, {}));
    } else {
      console.log('⚠️ No dynamic field keys detected in form values');
    }
  }, [watchedValues]);

  // Load dynamic forms when modal opens
  React.useEffect(() => {
    if (open && eventData?.event_id) {
      console.log('BeneficiaryEvaluationModal: Loading form schema for event:', eventData.event_id);
      fetchFormSchema(eventData.event_id);
    }
  }, [open, eventData, fetchFormSchema]);

  // Debug dynamic forms loading
  React.useEffect(() => {
    console.log('BeneficiaryEvaluationModal: Dynamic forms updated:', dynamicForms);
    console.log('BeneficiaryEvaluationModal: Form schema:', formSchema);
    console.log('BeneficiaryEvaluationModal: Form error:', formError);
    
    // Debug the rendering logic
    const hasForms = dynamicForms.length > 0 || formSchema;
    console.log('BeneficiaryEvaluationModal: Has forms to render:', hasForms);
    console.log('BeneficiaryEvaluationModal: Dynamic forms count:', dynamicForms.length);
    console.log('BeneficiaryEvaluationModal: Form schema exists:', !!formSchema);
    
    if (formSchema && formSchema.form_schema && formSchema.form_schema.fields) {
      console.log('BeneficiaryEvaluationModal: Form schema fields count:', formSchema.form_schema.fields.length);
      console.log('BeneficiaryEvaluationModal: Form schema fields:', formSchema.form_schema.fields);
      
      // Debug expected field keys
      const expectedFieldKeys = formSchema.form_schema.fields.map(field => `${formSchema.form_id}_${field.id}`);
      console.log('BeneficiaryEvaluationModal: Expected field keys:', expectedFieldKeys);
    }
  }, [dynamicForms, formSchema, formError]);

  // Clear state when modal closes
  React.useEffect(() => {
    if (!open) {
      clearFormState();
      setCurrentStep(1);
      setSubmitted(false);
    }
  }, [open, clearFormState]);

  const handleClose = () => {
    setOpen(false);
    clearState();
    setCurrentStep(1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const onSubmitForm = async (formData) => {
    try {
      console.group("📝 Beneficiary Evaluation Submission Debug");
  
      console.log("Received formData:", formData);
      console.log("Event Data:", eventData);
      console.log("Dynamic Forms:", dynamicForms);
      console.log("Form Schema:", formSchema);
  
      // Separate static and dynamic data
      const staticData = {
        overallRating: formData.overallRating,
        eventOrganization: formData.eventOrganization,
        venueQuality: formData.venueQuality,
        staffSupport: formData.staffSupport,
        eventContent: formData.eventContent,
        mostHelpful: formData.mostHelpful,
        leastHelpful: formData.leastHelpful,
        suggestions: formData.suggestions,
        wouldRecommend: formData.wouldRecommend,
        futureParticipation: formData.futureParticipation,
        additionalComments: formData.additionalComments,
        shareTestimonial: formData.shareTestimonial,
      };
  
      console.log("Static data to submit:", staticData);
  
      // If parent provides onSubmit callback, use it instead of store
      if (onSubmit) {
        console.log("🔄 Using parent onSubmit callback...");
        console.log("📤 Passing both static data and full form data to parent...");
        console.log("📋 Static data being passed:", staticData);
        console.log("📝 Full form data being passed:", formData);
        console.log("🔍 Form data keys being passed:", Object.keys(formData));
        
        // Show which dynamic fields are in the form data
        const dynamicFieldKeys = Object.keys(formData).filter(key => 
          !['overallRating', 'eventOrganization', 'venueQuality', 'staffSupport', 'eventContent', 
            'mostHelpful', 'leastHelpful', 'suggestions', 'wouldRecommend', 'futureParticipation', 
            'additionalComments', 'shareTestimonial'].includes(key)
        );
        console.log("🎯 Dynamic field keys found in form data:", dynamicFieldKeys);
        
        if (dynamicFieldKeys.length > 0) {
          console.log("📊 Dynamic field values:", dynamicFieldKeys.reduce((acc, key) => {
            acc[key] = formData[key];
            return acc;
          }, {}));
        } else {
          console.log("⚠️ No dynamic field keys found in form data");
        }
        
        await onSubmit(staticData, formData); // Pass both static data and full form data
        setSubmitted(true);
        setTimeout(() => handleClose(), 3000);
        console.groupEnd();
        return;
      }
  
      // Submit static evaluation first
      console.log("Submitting static evaluation...");
      const result = await submitEvaluation(eventData.event_id, staticData);
      console.log("Static submission result:", result);
  
      if (!result.success) {
        console.error("❌ Static evaluation submission failed:", result);
        console.groupEnd();
        return;
      }
  
      // --- Handle dynamic forms ---
      if (dynamicForms.length > 0) {
        console.log(`Detected ${dynamicForms.length} dynamic form(s).`);
        const formResponses = [];
  
        for (const form of dynamicForms) {
          console.log("Processing dynamic form:", form.form_id, form.form_name || "");
          if (form.form_schema && form.form_schema.fields) {
            const dynamicData = {};
            form.form_schema.fields.forEach(field => {
              const fieldKey = `${form.form_id}_${field.id}`;
              if (formData[fieldKey] !== undefined) {
                dynamicData[field.id] = formData[fieldKey];
              }
            });
  
            console.log("Dynamic data for form", form.form_id, ":", dynamicData);
  
            if (Object.keys(dynamicData).length > 0) {
              formResponses.push({
                form_id: form.form_id,
                response_data: dynamicData
              });
            }
          } else {
            console.warn(`Form ${form.form_id} has no schema or fields.`);
          }
        }
  
        if (formResponses.length > 0) {
          console.log("Submitting multiple dynamic forms:", formResponses);
          const formSubmissionSuccess = await submitMultipleFormResponses(formResponses);
          console.log("Dynamic forms submission result:", formSubmissionSuccess);
  
          if (!formSubmissionSuccess.success) {
            console.error("❌ Failed to submit some dynamic form responses:", formSubmissionSuccess);
          }
        } else {
          console.log("No valid dynamic form responses to submit.");
        }
  
      } else if (formSchema && formSchema.form_schema && formSchema.form_schema.fields) {
        // Handle single dynamic form schema
        console.log("Detected single dynamic form schema.");
        console.log("Form schema fields:", formSchema.form_schema.fields);
        console.log("Available formData keys:", Object.keys(formData));
        
        const dynamicData = {};
        formSchema.form_schema.fields.forEach(field => {
          const fieldKey = `${formSchema.form_id}_${field.id}`;
          console.log(`Looking for field key: "${fieldKey}" in formData`);
          console.log(`Field ${field.id} (${field.label}): formData[${fieldKey}] =`, formData[fieldKey]);
          
          if (formData[fieldKey] !== undefined) {
            dynamicData[field.id] = formData[fieldKey];
            console.log(`✅ Found data for field ${field.id}:`, formData[fieldKey]);
          } else {
            console.log(`❌ No data found for field ${field.id} with key "${fieldKey}"`);
          }
        });

        console.log("Dynamic data to submit:", dynamicData);
  
        if (Object.keys(dynamicData).length > 0) {
          const singleResult = await submitSingleFormResponse(formSchema.form_id, dynamicData);
          console.log("Single dynamic form submission result:", singleResult);
        } else {
          console.log("No data found for single dynamic form schema.");
        }
      } else {
        console.log("No dynamic forms or schemas detected — static only.");
      }
  
      setSubmitted(true);
      setTimeout(() => handleClose(), 3000);
      console.groupEnd();
  
    } catch (error) {
      console.error("🚨 Error submitting evaluation:", error);
      console.groupEnd?.();
    }
  };
  

  const steps = [
    { id: 1, title: "Experience Rating", description: "Rate your beneficiary experience" },
    { id: 2, title: (dynamicForms.length > 0 || formSchema) ? "Beneficiary Response Form" : "Event Insights", description: (dynamicForms.length > 0 || formSchema) ? "Please provide your responses to the event-specific questions created by the administrator." : "Share your thoughts and experiences" },
    { id: 3, title: "Future Engagement", description: "Your future interest" },
    { id: 4, title: "Final Comments", description: "Additional feedback" },
  ];

  // Define required fields per step
  const stepValidations = {
    1: ["overallRating", "eventOrganization", "venueQuality", "staffSupport", "eventContent"],
    2: [], // Dynamic fields validation will be handled by the dynamic form
    3: ["wouldRecommend", "futureParticipation"],
    4: [], // Step 4 is optional
  };

  // Get required dynamic fields for step 2
  const getRequiredDynamicFields = () => {
    const requiredFields = [];
    const formsToCheck = dynamicForms.length > 0 ? dynamicForms : 
      (formSchema ? [{
        form_id: formSchema.form_id,
        form_schema: formSchema.form_schema
      }] : []);
      
    formsToCheck.forEach(form => {
      if (form.form_schema && form.form_schema.fields) {
        form.form_schema.fields.forEach(field => {
          if (field.required && field.type !== 'rating') {
            requiredFields.push(`${form.form_id}_${field.id}`);
          }
        });
      }
    });
    return requiredFields;
  };

  // Handle Next button
  const handleNext = async () => {
    let fieldsToValidate = stepValidations[currentStep] || [];
    let isValid = true;

    // For step 2, add dynamic field validation
    if (currentStep === 2) {
      const dynamicRequiredFields = getRequiredDynamicFields();
      fieldsToValidate = [...fieldsToValidate, ...dynamicRequiredFields];
    }

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneExperienceRating control={control} errors={errors} />;
      case 2:
        return (
          <div className="space-y-6">
            {(dynamicForms.length > 0 || formSchema) ? (
              // Render dynamic forms if available
              dynamicForms.length > 0 ? (
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
                      register={register}
                      control={control}
                      errors={errors}
                      formId={form.form_id}
                    />
                  </div>
                ))
              ) : (
                // Render single form schema if available
                formSchema && (
                    <DynamicFormRenderer
                    key={formSchema.form_id}
                    formSchema={formSchema.form_schema}
                    onSubmit={() => {}} // Handled by main form
                    className="space-y-6"
                    register={register}
                    control={control}
                    errors={errors}
                    formId={formSchema.form_id}
                  />
                )
              )
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Additional Questions</h3>
                <p className="text-gray-500">
                  This event doesn't have any additional questions to answer.
                </p>
              </div>
            )}
          </div>
        );
      case 3:
        return <StepThreeFutureEngagement control={control} register={register} errors={errors} />;
      case 4:
        return <StepFourFinalComments control={control} register={register} errors={errors} />;
      default:
        return null;
    }
  };

  if (submitted) {
    return <SuccessMessage />;
  }

  if (!open) return null;

  if (isLoadingForm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-blue-100">Preparing your evaluation form</p>
          </div>
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading evaluation form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (formError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Form</h3>
            <p className="text-gray-600 mb-4">{formError}</p>
            <button
              onClick={() => fetchFormSchema(eventData.event_id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div className="text-center py-12">
            <div className="text-blue-400 mb-4">
              <MessageSquare className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Director</h3>
            <p className="text-gray-600 mb-4">Waiting for director to submit the feedback form.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                The director needs to create a feedback form for this event before you can provide your evaluation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the title and description from the first dynamic form or formSchema, or use fallback
  const headerTitle = (dynamicForms.length > 0 && dynamicForms[0].title) || formSchema?.title
    ? (dynamicForms.length > 0 ? dynamicForms[0].title : formSchema.title)
    : "Beneficiary Event Evaluation";
  const headerDescription = (dynamicForms.length > 0 && dynamicForms[0].description) || formSchema?.description
    ? (dynamicForms.length > 0 ? dynamicForms[0].description : formSchema.description)
    : "Share your experience to help us improve our events";


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <ProgressHeader 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          steps={steps} 
          title={headerTitle}
          description={headerDescription}
        />

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="p-6 min-h-[500px] overflow-y-auto max-h-[calc(95vh-280px)]">
            {renderStep()}

            {/* Display submission error if any */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

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

export default BeneficiaryEventEvaluationModal;