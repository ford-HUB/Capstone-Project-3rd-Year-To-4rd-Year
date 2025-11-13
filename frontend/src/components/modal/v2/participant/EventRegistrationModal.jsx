import React from 'react';
import { X, CheckCircle, AlertCircle, User, Shield, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import PersonalInfoStep from '../../../common/participant/event_registration/steps/PersonalInfoStep';
import EmergencyContactStep from '../../../common/participant/event_registration/steps/EmergencyContactStep';
import EventDetailsStep from '../../../common/participant/event_registration/steps/EventDetailsStep';
import SuccessScreen from '../../../common/participant/event_registration/SuccessScreen';
import StepIndicator from '../../../common/participant/event_registration/StepIndicator';
import EnhancedModalHeader from '../../../common/participant/event_registration/EnhancedModalHeader';
import EnhancedModalFooter from '../../../common/participant/event_registration/EnhancedModalFooter';
import { emergencyContactSchema } from '../../../../forms/StudentSchemas.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { useProfileStore } from '../../../../store/participant/useProfileStore.js';
import { useAuthStore } from '../../../../store/participant/useAuthStore.js';
import { useEventStore as useEventParticipantStore } from '../../../../store/participant/useEventStore.js';
import { useEventStore } from '../../../../store/event/useEventStore.js';

const EventRegistrationModal = ({ open, setOpen, eventData, onSuccess }) => {
    const { getParticipantRegisterStatus, getParticipantCount } = useEventStore();
    const { event_registration } = useEventParticipantStore()
    const { currentProfileInfo } = useProfileStore()
    const { authenticatedUser } = useAuthStore()
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const focusRef = React.useRef(null)

    const { register, watch, handleSubmit, trigger, formState: { errors,  isSubmitting } } = useForm({
        resolver: zodResolver(emergencyContactSchema),
        defaultValues: {
            emergency_contact_fullname: '',
            emergency_contact_number: '',
            relationship: '',
            emergency_contact_email: ''
        },

        mode: 'onBlur'
    })

    const formValues = watch()

    React.useEffect(() => {
        if (focusRef.current) {
          focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [errors]);

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the modal when it opens
            const modal = document.querySelector('[role="dialog"]');
            if (modal) {
                modal.focus();
            }
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, setOpen]);


    const handleNext = async () => {
        if (currentStep === 1) {
            // Step 1 is just display, no validation needed
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        } else if (currentStep === 2) {
            // Step 2 (emergency contact form) - all fields are optional now
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSuccessClose = () => {
        onSuccess(eventData.event_id)
        setIsSuccess(false)
        setOpen(false)
    }

    const onSubmit = async (formData) => {
        const success = await event_registration(eventData.event_id, formData)
        if(!success) return

        // Refresh data immediately after successful registration
        try {
            await getParticipantRegisterStatus(eventData.event_id)
            await getParticipantCount(eventData.event_id)
        } catch (error) {
            console.log('Error refreshing data:', error)
        }
        
        setIsSuccess(true)
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        userProfile={currentProfileInfo}
                        userEmail={authenticatedUser}
                    />
                );
            case 2:
                return (
                    <EmergencyContactStep
                        focusRef={focusRef}
                        register={register}
                        errors={errors}
                        userProfile={currentProfileInfo}
                    />
                );
            case 3:
                return (
                    <EventDetailsStep
                    userProfile={currentProfileInfo}
                    userEmail={authenticatedUser}
                    formValues={formValues}
                    />
                );
            default:
                return null;
        }
    };

    if (!open) return null

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            tabIndex={-1}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden transform transition-all duration-500 scale-100 mx-4 sm:mx-0"
                role="document"
            >
                <EnhancedModalHeader
                    eventData={eventData}
                    onClose={() => setOpen(false)}
                    currentStep={currentStep}
                    totalSteps={3}
                />

                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-280px)]">
        {isSuccess ? (
            <SuccessScreen onClose={handleSuccessClose} />
        ) : (
                        <div className="space-y-6">
                            <StepIndicator currentStep={currentStep} totalSteps={3} />
                            {renderCurrentStep()}
                        </div>
                    )}
                </div>

                {!isSuccess && (
                    <EnhancedModalFooter
                        currentStep={currentStep}
                        totalSteps={3}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onSubmit={handleSubmit(onSubmit)}
                        isSubmitting={isSubmitting}
                        canProceed={true}
                        isLastStep={currentStep === 3}
                    />
                )}
            </div>
        </div>
    );
}

export default EventRegistrationModal
