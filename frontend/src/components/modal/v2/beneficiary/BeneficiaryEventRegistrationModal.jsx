import React from 'react';
import { X, CheckCircle, AlertCircle, User, Shield, Calendar, ArrowRight, ArrowLeft, MapPin, Heart } from 'lucide-react';
import BeneficiaryPersonalInfoStep from '../../../common/beneficiary/event_registration/steps/BeneficiaryPersonalInfoStep';
import BeneficiaryContactInfoStep from '../../../common/beneficiary/event_registration/steps/BeneficiaryContactInfoStep';
import BeneficiaryVerificationStep from '../../../common/beneficiary/event_registration/steps/BeneficiaryVerificationStep';
import BeneficiaryEventDetailsStep from '../../../common/beneficiary/event_registration/steps/BeneficiaryEventDetailsStep';
import BeneficiarySuccessScreen from '../../../common/beneficiary/event_registration/BeneficiarySuccessScreen';
import BeneficiaryStepIndicator from '../../../common/beneficiary/event_registration/BeneficiaryStepIndicator';
import BeneficiaryEnhancedModalHeader from '../../../common/beneficiary/event_registration/BeneficiaryEnhancedModalHeader';
import BeneficiaryEnhancedModalFooter from '../../../common/beneficiary/event_registration/BeneficiaryEnhancedModalFooter';
import { beneficiaryEventRegistrationSchema } from '../../../../forms/BeneficiarySchemas.js';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { useBeneficiaryProfileStore } from '../../../../store/beneficiary/useBeneficiaryProfileStore.js';
import { useBeneficiaryAuthStore } from '../../../../store/beneficiary/useBeneficiaryAuthStore.js';
import { useBeneficiaryEventStore } from '../../../../store/beneficiary/useBeneficiaryEventStore.js';

const BeneficiaryEventRegistrationModal = ({ open, setOpen, eventData, onSuccess }) => {
    const { registerForEvent } = useBeneficiaryEventStore();
    const { currentProfileInfo, getCurrentProfile, isLoading: profileLoading, error: profileError } = useBeneficiaryProfileStore();
    const { authenticatedUser } = useBeneficiaryAuthStore();
    const [currentStep, setCurrentStep] = React.useState(1);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showVerificationErrors, setShowVerificationErrors] = React.useState(false);
    const focusRef = React.useRef(null);

    const { register, watch, handleSubmit, trigger, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(beneficiaryEventRegistrationSchema),
        defaultValues: {
            // Needs Assessment Information
            current_situation: '',
            needs: '',
            how_can_we_help: '',
            // ID Verification Information
            id_files: null
        },
        mode: 'onSubmit'
    });

    const formValues = watch();

    // Load profile data when modal opens
    React.useEffect(() => {
        if (open && !currentProfileInfo) {
            setIsLoading(true);
            getCurrentProfile().finally(() => setIsLoading(false));
        }
    }, [open, currentProfileInfo, getCurrentProfile]);

    // No need to update form values since we're not using personal info fields
    // The beneficiary profile data is already available in currentProfileInfo


    React.useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Find the first field with an error and scroll to it
            const firstErrorField = document.querySelector('[class*="border-red-300"]');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
                firstErrorField.focus();
            }
        }
    }, [errors]);

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
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
            // Step 1 (personal info) - no validation needed, just show read-only info
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        } else if (currentStep === 2) {
            // Step 2 (needs assessment) - validate needs assessment fields
            const needsAssessmentFields = ['current_situation', 'needs', 'how_can_we_help'];
            const isValid = await trigger(needsAssessmentFields);
            if (isValid) {
                setCurrentStep((prev) => Math.min(prev + 1, 4));
            }
        } else if (currentStep === 3) {
            // Step 3 (ID verification) - validate ID files upload
            setShowVerificationErrors(true);
            const verificationFields = ['id_files'];
            const isValid = await trigger(verificationFields);
            if (isValid) {
                setCurrentStep((prev) => Math.min(prev + 1, 4));
            }
            // Don't prevent navigation - let user see the error and fix it
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSuccessClose = () => {
        onSuccess(eventData.event_id);
        setIsSuccess(false);
        setCurrentStep(1);
        setOpen(false);
        setShowVerificationErrors(false);
        // Reset form to initial state
        reset({
            current_situation: '',
            needs: '',
            how_can_we_help: '',
            id_files: null
        });
    };

    const handleClose = () => {
        setOpen(false);
        setIsSuccess(false);
        setCurrentStep(1);
        setShowVerificationErrors(false);
        // Reset form to initial state
        reset({
            current_situation: '',
            needs: '',
            how_can_we_help: '',
            id_files: null
        });
    };

    const onSubmit = async (formData) => {
        // Create FormData to handle file uploads
        const processedFormData = new FormData();
        
        // Add needs assessment fields
        processedFormData.append('current_situation', formData.current_situation || '');
        processedFormData.append('needs', formData.needs || '');
        processedFormData.append('how_can_we_help', formData.how_can_we_help || '');
        
        // Add ID files
        if (formData.id_files && formData.id_files.length > 0) {
            Array.from(formData.id_files).forEach((file, index) => {
                processedFormData.append('id_files', file);
            });
        }
        
        const success = await registerForEvent(eventData.event_id, processedFormData);
        if (!success) return;

        setIsSuccess(true);
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BeneficiaryPersonalInfoStep
                        userProfile={currentProfileInfo}
                        userEmail={authenticatedUser?.email}
                        register={register}
                        errors={errors}
                        isEditable={false} // Make it read-only
                        focusRef={focusRef}
                    />
                );
            case 2:
                return (
                    <BeneficiaryContactInfoStep
                        register={register}
                        errors={errors}
                        userProfile={currentProfileInfo}
                    />
                );
            case 3:
                return (
                    <BeneficiaryVerificationStep
                        focusRef={focusRef}
                        register={register}
                        errors={errors}
                        userProfile={currentProfileInfo}
                        shouldShowErrors={showVerificationErrors}
                        setValue={setValue}
                        watch={watch}
                    />
                );
            case 4:
                return (
                    <BeneficiaryEventDetailsStep
                        userProfile={currentProfileInfo}
                        userEmail={authenticatedUser?.email}
                        formValues={formValues}
                        eventData={eventData}
                    />
                );
            default:
                return null;
        }
    };

    if (!open) return null;

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
                <BeneficiaryEnhancedModalHeader
                    eventData={eventData}
                    onClose={handleClose}
                    currentStep={currentStep}
                    totalSteps={4}
                />

                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-280px)]">
                    {isSuccess ? (
                        <BeneficiarySuccessScreen onClose={handleSuccessClose} />
                    ) : isLoading || profileLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading your profile...</p>
                            </div>
                        </div>
                    ) : profileError ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Loading Error</h3>
                                <p className="text-gray-600 mb-4">{profileError}</p>
                                <button 
                                    onClick={() => {
                                        setIsLoading(true);
                                        getCurrentProfile().finally(() => setIsLoading(false));
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <BeneficiaryStepIndicator currentStep={currentStep} totalSteps={4} />
                            {renderCurrentStep()}
                        </div>
                    )}
                </div>

                {!isSuccess && !isLoading && !profileLoading && !profileError && (
                    <BeneficiaryEnhancedModalFooter
                        currentStep={currentStep}
                        totalSteps={4}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onSubmit={handleSubmit(onSubmit)}
                        isSubmitting={isSubmitting}
                        canProceed={true}
                        isLastStep={currentStep === 4}
                    />
                )}
            </div>
        </div>
    );
};

export default BeneficiaryEventRegistrationModal;
