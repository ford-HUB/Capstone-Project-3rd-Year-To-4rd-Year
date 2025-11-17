import React from 'react';
import { Upload, User, FileText, GraduationCap, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/participant/useAuthStore.js';
import { useDepartment } from '../../context/useDepartmentContext.jsx';
import extractImageId from '../../services/orcService.js';
import CleanReGex from '../../utils/CleanReGex.js';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { volunteerRegistrationSchema } from '../../forms/VolunteerSchemas.js';
import { encrypt } from '../../utils/crypto.js';

import Header from '../../components/common/registration/Header.jsx';
import StepIndicator from '../../components/common/registration/StepIndicator.jsx';
import NavigationButtons from '../../components/common/registration/NavigationButtons.jsx';
import RHFAccountInfoStep from '../../components/common/registration/steps/RHFAccountInfoStep.jsx';
import RHFPersonalDetailsStep from '../../components/common/registration/steps/RHFPersonalDetailsStep.jsx';
import RHFAcademicInfoStep from '../../components/common/registration/steps/RHFAcademicInfoStep.jsx';
import RHFVolunteerTypeStep from '../../components/common/registration/steps/RHFVolunteerTypeStep.jsx';
import RHFIDVerificationStep from '../../components/common/registration/steps/RHFIDVerificationStep.jsx';

const UpdateRegistrationUI = () => {
    const { departmentCourses } = useDepartment();
    const { signup, checkEmailExists } = useAuthStore();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(volunteerRegistrationSchema),
        mode: 'onChange', // Validate on change to update errors in real-time
        reValidateMode: 'onChange', // Re-validate on change
        shouldFocusError: false, // Don't focus on errors automatically
        defaultValues: {
            studentId: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            middleName: '',
            age: undefined,
            gender: '',
            department: '',
            course: '',
            yearLevel: undefined,
            phoneNumber: '',
            currentAddress: '',
            isBeneficiary: 'false',
            beneficiaryType: '',
            organization_name: '',
            studentIdFile: undefined,
        },
    });

    const [isRegistering, setIsRegistering] = React.useState(false);
    const [registrationStep, setRegistrationStep] = React.useState(1);

    // Local state for UI
    const [preview, setPreview] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [completedSteps, setCompletedSteps] = React.useState([]);
    const [studentIdFile, setStudentIdFile] = React.useState(null);
    const [isProcessingOCR, setIsProcessingOCR] = React.useState(false);
    const [attemptedSteps, setAttemptedSteps] = React.useState(new Set());
    const [hasReachedLastStep, setHasReachedLastStep] = React.useState(false);
    const [emailValidationStatus, setEmailValidationStatus] = React.useState({
        checked: false,
        exists: false,
        valid: false,
        checking: false
    });

    // Watch form values for dynamic steps
    const isBeneficiary = watch('isBeneficiary') === 'true';
    const beneficiaryType = watch('beneficiaryType');
    const currentIsBeneficiary = watch('isBeneficiary');

    // Track previous volunteer type to detect changes
    const prevVolunteerTypeRef = React.useRef(currentIsBeneficiary);
    
    // useRef for navigation control when email exists
    const navigateToAccountInfoRef = React.useRef(false);

    // Effect to handle volunteer type changes
    React.useEffect(() => {
        const prevVolunteerType = prevVolunteerTypeRef.current;
        
        // Only reset if volunteer type actually changed and we're not on the initial load
        if (prevVolunteerType && prevVolunteerType !== currentIsBeneficiary) {
            resetFormForVolunteerTypeChange(currentIsBeneficiary);
            console.log(`Switched to ${currentIsBeneficiary === 'false' ? 'Regular Volunteer' : 'Beneficiary'} registration. Form data has been reset.`);
        }
        
        // Update the ref for next comparison
        prevVolunteerTypeRef.current = currentIsBeneficiary;
    }, [currentIsBeneficiary]);

    // Step validation - check if current step fields have errors
    const isStepValid = React.useMemo(() => {
        // If step hasn't been attempted yet, consider it valid (don't show errors)
        if (!attemptedSteps.has(registrationStep)) {
            return true;
        }

        // Watch all form values
        const formValues = watch();

        switch (registrationStep) {
            case 1:
                // Volunteer type selection - only validate beneficiary fields if beneficiary is selected
                const isBeneficiarySelected =
                    formValues.isBeneficiary === 'true';
                if (isBeneficiarySelected) {
                    // For beneficiaries, check if beneficiaryType and organization_name are filled
                    return (
                        formValues.isBeneficiary &&
                        formValues.beneficiaryType &&
                        (formValues.beneficiaryType === 'individual' ||
                            formValues.organization_name?.trim())
                    );
                } else {
                    // For regular volunteers, just check if isBeneficiary is set
                    return formValues.isBeneficiary === 'false';
                }

            case 2:
                // Account information - validate based on volunteer type
                const isBeneficiaryForFields =
                    formValues.isBeneficiary === 'true';
                if (isBeneficiaryForFields) {
                    // For beneficiaries, check email, password, confirmPassword
                    return (
                        formValues.email?.trim() &&
                        formValues.password?.trim() &&
                        formValues.confirmPassword?.trim() &&
                        formValues.password === formValues.confirmPassword
                    );
                } else {
                    // For regular volunteers, check studentId, email, password, confirmPassword
                    // Use more lenient validation that matches the form schema
                    const studentIdValid =
                        formValues.studentId?.trim() &&
                        formValues.studentId.length === 8 &&
                        /^\d{8}$/.test(formValues.studentId);
                    const emailValid =
                        formValues.email?.trim() &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
                    const passwordValid =
                        formValues.password?.trim() &&
                        formValues.password.length >= 6;
                    const confirmPasswordValid =
                        formValues.confirmPassword?.trim() &&
                        formValues.password === formValues.confirmPassword;

                    // For regular volunteers, also check if email validation passed
                    const emailValidationPassed = emailValidationStatus.checked && 
                        !emailValidationStatus.exists && 
                        emailValidationStatus.valid;

                    return (
                        studentIdValid &&
                        emailValid &&
                        passwordValid &&
                        confirmPasswordValid &&
                        emailValidationPassed
                    );
                }

            case 3:
                // Personal details
                return (
                    formValues.firstName?.trim() &&
                    formValues.lastName?.trim() &&
                    formValues.middleName?.trim() &&
                    formValues.age &&
                    formValues.gender &&
                    formValues.phoneNumber?.trim() &&
                    formValues.currentAddress?.trim()
                );

            case 4:
                // Academic info (only for regular volunteers)
                const isBeneficiaryForStep4 =
                    formValues.isBeneficiary === 'true';
                if (isBeneficiaryForStep4) {
                    return true; // No fields to validate for beneficiaries
                } else {
                    return (
                        formValues.department &&
                        formValues.course &&
                        formValues.yearLevel
                    );
                }

            case 5:
                // ID verification (only for regular volunteers)
                const isBeneficiaryForStep5 =
                    formValues.isBeneficiary === 'true';
                if (isBeneficiaryForStep5) {
                    return true; // No fields to validate for beneficiaries
                } else {
                    return formValues.studentIdFile;
                }

            default:
                return true;
        }
    }, [registrationStep, attemptedSteps, watch(), emailValidationStatus]);

    // Dynamic steps based on beneficiary status
    const getSteps = () => {
        const baseSteps = [
            {
                id: 1,
                name: 'Volunteer Type',
                icon: Heart,
                description: 'Choose your volunteer role',
            },
            {
                id: 2,
                name: 'Account Info',
                icon: User,
                description: 'Login credentials and basic info',
            },
            {
                id: 3,
                name: 'Personal Details',
                icon: FileText,
                description: 'Your personal information',
            },
        ];

        // Add Academic Info step only for regular volunteers (not beneficiaries)
        if (!isBeneficiary) {
            baseSteps.push({
                id: 4,
                name: 'Academic Info',
                icon: GraduationCap,
                description: 'Department and course details',
            });
            baseSteps.push({
                id: 5,
                name: 'ID Verification',
                icon: Upload,
                description: 'Upload your student ID',
            });
        }

        return baseSteps;
    };

    const steps = getSteps();

    // Event handlers

    // Function to check email existence (returns response object)
    const handleEmailCheckAndNavigate = async (email) => {
        if (!email || email.trim() === '') {
            return { exists: false, success: false };
        }

        const response = await checkEmailExists(email);
        return response;
    };

    const resetForm = () => {
        // Reset form to default values
        reset({
            studentId: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            middleName: '',
            age: undefined,
            gender: '',
            department: '',
            course: '',
            yearLevel: undefined,
            phoneNumber: '',
            currentAddress: '',
            isBeneficiary: 'false',
            beneficiaryType: '',
            organization_name: '',
            studentIdFile: undefined,
        });

        // Reset all state
        setPreview(null);
        setStudentIdFile(null);
        setCompletedSteps([]);
        setAttemptedSteps(new Set());
        setHasReachedLastStep(false);
        setIsProcessingOCR(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setEmailValidationStatus({
            checked: false,
            exists: false,
            valid: false,
            checking: false
        });

        // Force trigger validation to clear any lingering errors
        setTimeout(() => {
            trigger();
        }, 100);

        console.log('Form has been reset to initial state');
    };

    const resetFormForVolunteerTypeChange = (newVolunteerType) => {
        // Reset only the fields that differ between volunteer types
        const currentValues = watch();
        
        // Reset fields that are specific to volunteer types
        setValue('studentId', newVolunteerType === 'false' ? '' : '');
        setValue('beneficiaryType', '');
        setValue('organization_name', '');
        setValue('department', '');
        setValue('course', '');
        setValue('yearLevel', undefined);
        setValue('studentIdFile', undefined);
        
        // Reset file-related state
        setPreview(null);
        setStudentIdFile(null);
        setIsProcessingOCR(false);
        
        // Reset completed steps and attempted steps to force re-validation
        setCompletedSteps([]);
        setAttemptedSteps(new Set());
        
        // Force trigger validation to clear any lingering errors
        setTimeout(() => {
            trigger();
        }, 100);

        console.log(`Form data reset for volunteer type change to: ${newVolunteerType === 'false' ? 'Regular Volunteer' : 'Beneficiary'}`);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size too large (max 5MB)');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Only JPG, JPEG, and PNG files are allowed');
                return;
            }

            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
            setValue('studentIdFile', file);

            // Process OCR for text extraction and validation
            setIsProcessingOCR(true);
            try {
                const extractedText = await extractImageId(file);
                console.log('Raw Extracted Data:', extractedText);

                if (!extractedText || typeof extractedText !== 'string') {
                    toast.error(
                        'Could not extract text from the image. Please try a clearer photo.'
                    );
                    setIsProcessingOCR(false);
                    return;
                }

                const cleanedText = await CleanReGex(extractedText);
                const firstName = watch('firstName');
                const middleName = watch('middleName');
                const lastName = watch('lastName');
                const studentName = `${firstName} ${middleName} ${lastName}`
                    .trim()
                    .toLowerCase();

                // Check if the extracted text contains the student's name
                if (cleanedText.toLowerCase().includes(studentName)) {
                    toast.success(
                        'ID verification successful! Name matches the uploaded ID.'
                    );
                } else {
                    toast.error(
                        "Name on ID doesn't match the provided information. Please check your details or upload a clearer photo."
                    );
                }
            } catch (error) {
                console.error('OCR processing error:', error);
                toast.error('Error processing the image. Please try again.');
            } finally {
                setIsProcessingOCR(false);
            }
        }
    };

    // Function to get fields that should be validated for current step
    const getCurrentStepFields = () => {
        switch (registrationStep) {
            case 1:
                // Volunteer type selection - only validate beneficiary fields if beneficiary is selected
                const isBeneficiarySelected = watch('isBeneficiary') === 'true';
                if (isBeneficiarySelected) {
                    return [
                        'isBeneficiary',
                        'beneficiaryType',
                        'organization_name',
                    ];
                }
                return ['isBeneficiary'];
            case 2:
                // Account information - only validate studentId for regular volunteers
                const isBeneficiaryForFields =
                    watch('isBeneficiary') === 'true';
                if (isBeneficiaryForFields) {
                    return ['email', 'password', 'confirmPassword'];
                }
                return ['studentId', 'email', 'password', 'confirmPassword'];
            case 3:
                // Personal details
                return [
                    'firstName',
                    'lastName',
                    'middleName',
                    'age',
                    'gender',
                    'phoneNumber',
                    'currentAddress',
                ];
            case 4:
                // Academic info (only for regular volunteers)
                const isBeneficiaryForStep4 = watch('isBeneficiary') === 'true';
                if (isBeneficiaryForStep4) {
                    return []; // No fields to validate for beneficiaries
                }
                return ['department', 'course', 'yearLevel'];
            case 5:
                // ID verification (only for regular volunteers)
                const isBeneficiaryForStep5 = watch('isBeneficiary') === 'true';
                if (isBeneficiaryForStep5) {
                    return []; // No fields to validate for beneficiaries
                }
                return ['studentIdFile'];
            default:
                return [];
        }
    };

    const nextStep = async () => {
        // Mark current step as attempted
        setAttemptedSteps((prev) => new Set([...prev, registrationStep]));

        // Get the fields that should be validated for the current step
        const fieldsToValidate = getCurrentStepFields();

        // Trigger validation for all fields to ensure refine validations work
        const triggerResult = await trigger();

        // We need to manually check the fields we care about for each step
        // because the trigger result might include errors from other steps
        let isValid;
        if (registrationStep === 1) {
            // Step 1: Volunteer type selection
            const isBeneficiarySelected = watch('isBeneficiary') === 'true';
            const fieldsToCheck = isBeneficiarySelected
                ? ['isBeneficiary', 'beneficiaryType', 'organization_name']
                : ['isBeneficiary'];
            
            // Check if there are any errors for the fields we care about
            const hasErrors = fieldsToCheck.some((field) => errors[field]);
            
            // Also check if the fields are actually filled and valid
            const formValues = watch();
            let fieldsValid = true;
            
            if (isBeneficiarySelected) {
                // For beneficiaries, check if beneficiaryType and organization_name are filled
                fieldsValid = (
                    formValues.isBeneficiary &&
                    formValues.beneficiaryType &&
                    (formValues.beneficiaryType === 'individual' ||
                        formValues.organization_name?.trim())
                );
            } else {
                // For regular volunteers, just check if isBeneficiary is set
                fieldsValid = formValues.isBeneficiary === 'false';
            }
            
            isValid = !hasErrors && fieldsValid;

            console.log('Step 1 Debug:');
            console.log('Fields to check:', fieldsToCheck);
            console.log('Errors:', errors);
            console.log('Has errors:', hasErrors);
            console.log('Fields valid:', fieldsValid);
            console.log('Form values:', formValues);
            console.log('Is valid:', isValid);
        } else if (registrationStep === 2) {
            // Step 2: Account information
            const isBeneficiaryForFields = watch('isBeneficiary') === 'true';
            const fieldsToCheck = isBeneficiaryForFields
                ? ['email', 'password', 'confirmPassword']
                : ['studentId', 'email', 'password', 'confirmPassword'];
            
            // Check if there are any errors for the fields we care about
            const hasErrors = fieldsToCheck.some((field) => errors[field]);
            
            // Also check if the fields are actually filled and valid
            const formValues = watch();
            let fieldsValid = true;
            
            if (isBeneficiaryForFields) {
                // For beneficiaries
                fieldsValid = (
                    formValues.email?.trim() &&
                    formValues.password?.trim() &&
                    formValues.confirmPassword?.trim() &&
                    formValues.password === formValues.confirmPassword
                );
            } else {
                // For regular volunteers
                const studentIdValid =
                    formValues.studentId?.trim() &&
                    formValues.studentId.length === 8 &&
                    /^\d{8}$/.test(formValues.studentId);
                const emailValid =
                    formValues.email?.trim() &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
                const passwordValid =
                    formValues.password?.trim() &&
                    formValues.password.length >= 6;
                const confirmPasswordValid =
                    formValues.confirmPassword?.trim() &&
                    formValues.password === formValues.confirmPassword;

                fieldsValid = (
                    studentIdValid &&
                    emailValid &&
                    passwordValid &&
                    confirmPasswordValid
                );
            }
            
            isValid = !hasErrors && fieldsValid;

            console.log('Step 2 Debug:');
            console.log('Fields to check:', fieldsToCheck);
            console.log('Errors:', errors);
            console.log('Has errors:', hasErrors);
            console.log('Fields valid:', fieldsValid);
            console.log('Is valid:', isValid);
        } else if (registrationStep === 3) {
            // Step 3: Personal details
            const fieldsToCheck = [
                'firstName',
                'lastName', 
                'middleName',
                'age',
                'gender',
                'phoneNumber',
                'currentAddress'
            ];
            
            // Check if there are any errors for the fields we care about
            const hasErrors = fieldsToCheck.some((field) => errors[field]);
            
            // Also check if the fields are actually filled and valid
            const formValues = watch();
            const fieldsValid = (
                formValues.firstName?.trim() &&
                formValues.lastName?.trim() &&
                formValues.middleName?.trim() &&
                formValues.age &&
                formValues.gender &&
                formValues.phoneNumber?.trim() &&
                formValues.currentAddress?.trim()
            );
            
            isValid = !hasErrors && fieldsValid;

            console.log('Step 3 Debug:');
            console.log('Fields to check:', fieldsToCheck);
            console.log('Errors:', errors);
            console.log('Has errors:', hasErrors);
            console.log('Fields valid:', fieldsValid);
            console.log('Form values:', formValues);
            console.log('Is valid:', isValid);
        } else if (registrationStep === 4) {
            // Step 4: Academic info (only for regular volunteers)
            const isBeneficiaryForStep4 = watch('isBeneficiary') === 'true';
            if (isBeneficiaryForStep4) {
                isValid = true; // No fields to validate for beneficiaries
            } else {
                const fieldsToCheck = ['department', 'course', 'yearLevel'];
                
                // Check if there are any errors for the fields we care about
                const hasErrors = fieldsToCheck.some((field) => errors[field]);
                
                // Also check if the fields are actually filled and valid
                const formValues = watch();
                const fieldsValid = (
                    formValues.department &&
                    formValues.course &&
                    formValues.yearLevel
                );
                
                isValid = !hasErrors && fieldsValid;

                console.log('Step 4 Debug:');
                console.log('Fields to check:', fieldsToCheck);
                console.log('Errors:', errors);
                console.log('Has errors:', hasErrors);
                console.log('Fields valid:', fieldsValid);
                console.log('Form values:', formValues);
                console.log('Is valid:', isValid);
            }
        } else if (registrationStep === 5) {
            // Step 5: ID verification (only for regular volunteers)
            const isBeneficiaryForStep5 = watch('isBeneficiary') === 'true';
            if (isBeneficiaryForStep5) {
                isValid = true; // No fields to validate for beneficiaries
            } else {
                const fieldsToCheck = ['studentIdFile'];
                
                // Check if there are any errors for the fields we care about
                const hasErrors = fieldsToCheck.some((field) => errors[field]);
                
                // Also check if the fields are actually filled and valid
                const formValues = watch();
                const fieldsValid = formValues.studentIdFile;
                
                isValid = !hasErrors && fieldsValid;

                console.log('Step 5 Debug:');
                console.log('Fields to check:', fieldsToCheck);
                console.log('Errors:', errors);
                console.log('Has errors:', hasErrors);
                console.log('Fields valid:', fieldsValid);
                console.log('Form values:', formValues);
                console.log('Is valid:', isValid);
            }
        } else {
            // For other steps, use the trigger result directly
            isValid = triggerResult;
        }

        if (!isValid) {
            // Get current step fields to show specific errors
            let currentStepFields = [];
            switch (registrationStep) {
                case 1:
                    const isBeneficiarySelected =
                        watch('isBeneficiary') === 'true';
                    currentStepFields = isBeneficiarySelected
                        ? [
                              'isBeneficiary',
                              'beneficiaryType',
                              'organization_name',
                          ]
                        : ['isBeneficiary'];
                    break;
                case 2:
                    const isBeneficiaryForFields =
                        watch('isBeneficiary') === 'true';
                    currentStepFields = isBeneficiaryForFields
                        ? ['email', 'password', 'confirmPassword']
                        : ['studentId', 'email', 'password', 'confirmPassword'];
                    break;
                case 3:
                    currentStepFields = [
                        'firstName',
                        'lastName',
                        'middleName',
                        'age',
                        'gender',
                        'phoneNumber',
                        'currentAddress',
                    ];
                    break;
                case 4:
                    const isBeneficiaryForStep4 =
                        watch('isBeneficiary') === 'true';
                    currentStepFields = isBeneficiaryForStep4
                        ? []
                        : ['department', 'course', 'yearLevel'];
                    break;
                case 5:
                    const isBeneficiaryForStep5 =
                        watch('isBeneficiary') === 'true';
                    currentStepFields = isBeneficiaryForStep5
                        ? []
                        : ['studentIdFile'];
                    break;
                default:
                    currentStepFields = [];
            }

            // Filter errors for current step only
            // For Step 2, we validate all fields but only show current step errors
            const currentStepErrors = Object.entries(errors).filter(([field]) =>
                currentStepFields.includes(field)
            );

            // Show detailed error message
            if (currentStepErrors.length > 0) {
                const errorMessages = currentStepErrors
                    .map(([field, error]) => {
                        // Format field names properly
                        let formattedField = field
                            .replace(/([A-Z])/g, ' $1')
                            .trim();
                        if (field === 'studentId')
                            formattedField = 'Student ID';
                        if (field === 'confirmPassword')
                            formattedField = 'Confirm Password';
                        if (field === 'firstName')
                            formattedField = 'First Name';
                        if (field === 'lastName') formattedField = 'Last Name';
                        if (field === 'middleName')
                            formattedField = 'Middle Name';
                        if (field === 'phoneNumber')
                            formattedField = 'Phone Number';
                        if (field === 'currentAddress')
                            formattedField = 'Current Address';
                        if (field === 'yearLevel')
                            formattedField = 'Year Level';
                        if (field === 'studentIdFile')
                            formattedField = 'Student ID File';
                        if (field === 'organization_name')
                            formattedField = 'Organization Name';
                        if (field === 'beneficiaryType')
                            formattedField = 'Beneficiary Type';
                        if (field === 'isBeneficiary')
                            formattedField = 'Volunteer Type';

                        return `• ${formattedField}: ${error.message}`;
                    })
                    .join('\n');

                toast.error(
                    `Please fix the following errors:\n${errorMessages}`,
                    {
                        duration: 5000,
                        style: {
                            whiteSpace: 'pre-line',
                            maxWidth: '400px',
                        },
                    }
                );
            } else {
                toast.error(
                    'Please fill in all required fields correctly before proceeding'
                );
            }

            return; // Don't proceed if validation fails
        }

        setCompletedSteps((prev) => [...prev, registrationStep]);

        const totalSteps = steps.length;

        // If we're at the last step, submit the form
        if (registrationStep === totalSteps) {
            setHasReachedLastStep(true);
            handleSubmit(onSubmitForm)();
            return;
        }

        // Move to next step
        setRegistrationStep(registrationStep + 1);
    };

    const prevStep = () => {
        if (registrationStep > 1) {
            const newStep = registrationStep - 1;
            
            // If user is going back to step 1 and they have reached the last step before, reset the form
            if (newStep === 1 && hasReachedLastStep) {
                resetForm();
                setRegistrationStep(1);
                toast.success('Form has been reset. Please start your registration again.');
            } else {
                setRegistrationStep(newStep);
            }
        }
    };

    const onSubmitForm = async (data) => {
        console.log('onSubmitForm called with data:', data);
        setIsRegistering(true);

        try {
            // For regular volunteers, perform OCR validation before submission
            const isBeneficiaryBool =
                data.isBeneficiary === 'true' || data.isBeneficiary === true;
            if (!isBeneficiaryBool && data.studentIdFile) {
                const extractedText = await extractImageId(data.studentIdFile);
                console.log('Final OCR validation:', extractedText);

                if (!extractedText || typeof extractedText !== 'string') {
                    toast.error('Please attach a valid student ID');
                    return;
                }

                const cleanedText = await CleanReGex(extractedText);
                const studentName =
                    `${data.firstName} ${data.middleName} ${data.lastName}`
                        .trim()
                        .toLowerCase();

                if (!cleanedText.toLowerCase().includes(studentName)) {
                    toast.error(
                        "Name on ID doesn't match your provided information. Please check your details or upload a clearer photo."
                    );
                    return;
                }
            }

            // Prepare the data for the backend
            const formDataToSend = new FormData();
            formDataToSend.append(
                'studentId',
                isBeneficiaryBool ? '' : data.studentId
            );
            formDataToSend.append('email', data.email);
            formDataToSend.append('password', data.password);
            formDataToSend.append('confirmPassword', data.confirmPassword);
            formDataToSend.append('firstname', data.firstName);
            formDataToSend.append('lastname', data.lastName);
            formDataToSend.append('middlename', data.middleName);
            formDataToSend.append('age', Number(data.age));
            formDataToSend.append('gender', data.gender);
            formDataToSend.append('phoneNumber', data.phoneNumber);
            formDataToSend.append('address', data.currentAddress);

            // Only add academic info for regular volunteers
            if (!isBeneficiaryBool) {
                formDataToSend.append('department', data.department);
                formDataToSend.append('course', data.course);
                formDataToSend.append('yearLevel', data.yearLevel || '');
            } else {
                // For beneficiaries, use default values or empty string for yearLevel
                formDataToSend.append('department', '');
                formDataToSend.append('course', '');
                formDataToSend.append('yearLevel', '');
            }

            formDataToSend.append(
                'isBeneficiary',
                isBeneficiaryBool.toString()
            );
            formDataToSend.append(
                'beneficiaryType',
                data.beneficiaryType || ''
            );

            // Add organization name for organization beneficiaries
            if (isBeneficiaryBool && data.beneficiaryType === 'organization') {
                formDataToSend.append(
                    'organization_name',
                    data.organization_name
                );
            }

            // Add student ID file if it exists (for regular volunteers)
            if (data.studentIdFile) {
                formDataToSend.append(
                    'studentIdFile',
                    data.studentIdFile,
                    data.studentIdFile.name
                );
            }

            const success = await signup(formDataToSend);

            if (success) {  
                const encryptedEmail = encrypt(data.email);
                window.location.href = `/verification_code?rq_access=${encodeURIComponent(encryptedEmail)}`;
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsRegistering(false);
        }
    };

    const renderStepContent = () => {
        // Show errors for the current step if it has been attempted
        const shouldShowErrors = attemptedSteps.has(registrationStep);
        const filteredErrors = shouldShowErrors ? errors : {};

        const rhfProps = {
            register,
            errors: filteredErrors,
            watch,
            setValue,
            onEmailCheck: handleEmailCheckAndNavigate,
            navigateToAccountInfoRef,
            emailValidationStatus,
            setEmailValidationStatus,
        };

        switch (registrationStep) {
            case 1:
                return <RHFVolunteerTypeStep {...rhfProps} />;
            case 2:
                return (
                    <RHFAccountInfoStep
                        {...rhfProps}
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        setShowPassword={setShowPassword}
                        setShowConfirmPassword={setShowConfirmPassword}
                    />
                );
            case 3:
                return <RHFPersonalDetailsStep {...rhfProps} />;
            case 4:
                // Academic Info step - only for regular volunteers
                if (!isBeneficiary) {
                    return (
                        <RHFAcademicInfoStep
                            {...rhfProps}
                            departmentCourses={departmentCourses}
                        />
                    );
                }
                // This should not happen since step 4 is only added for non-beneficiaries
                return null;
            case 5:
                // ID Verification step - only for regular volunteers
                if (!isBeneficiary) {
                    return (
                        <RHFIDVerificationStep
                            {...rhfProps}
                            preview={preview}
                            onFileUpload={handleFileUpload}
                            onRemoveFile={() => {
                                setPreview(null);
                                setValue('studentIdFile', undefined);
                            }}
                            isProcessingOCR={isProcessingOCR}
                        />
                    );
                }
                // This should not happen since step 5 is only added for non-beneficiaries
                return null;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <h2 className="text-2xl font-bold mb-2">
                            Volunteer Registration
                        </h2>
                        <p className="text-blue-100">
                            Join the UCLM CARES community as a volunteer
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <StepIndicator
                            steps={steps}
                            currentStep={registrationStep}
                            completedSteps={completedSteps}
                        />

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Only submit if we're on the final step
                                if (registrationStep === steps.length) {
                                    handleSubmit(onSubmitForm)();
                                }
                            }}
                            className="space-y-8">
                            {/* Global Error Warning */}
                            {attemptedSteps.has(registrationStep) &&
                                (() => {
                                    let currentStepFields = [];
                                    switch (registrationStep) {
                                        case 1:
                                            const isBeneficiarySelected =
                                                watch('isBeneficiary') ===
                                                'true';
                                            currentStepFields =
                                                isBeneficiarySelected
                                                    ? [
                                                          'isBeneficiary',
                                                          'beneficiaryType',
                                                          'organization_name',
                                                      ]
                                                    : ['isBeneficiary'];
                                            break;
                                        case 2:
                                            const isBeneficiaryForFields =
                                                watch('isBeneficiary') ===
                                                'true';
                                            currentStepFields =
                                                isBeneficiaryForFields
                                                    ? [
                                                          'email',
                                                          'password',
                                                          'confirmPassword',
                                                      ]
                                                    : [
                                                          'studentId',
                                                          'email',
                                                          'password',
                                                          'confirmPassword',
                                                      ];
                                            break;
                                        case 3:
                                            currentStepFields = [
                                                'firstName',
                                                'lastName',
                                                'middleName',
                                                'age',
                                                'gender',
                                                'phoneNumber',
                                                'currentAddress',
                                            ];
                                            break;
                                        case 4:
                                            const isBeneficiaryForStep4 =
                                                watch('isBeneficiary') ===
                                                'true';
                                            currentStepFields =
                                                isBeneficiaryForStep4
                                                    ? []
                                                    : [
                                                          'department',
                                                          'course',
                                                          'yearLevel',
                                                      ];
                                            break;
                                        case 5:
                                            const isBeneficiaryForStep5 =
                                                watch('isBeneficiary') ===
                                                'true';
                                            currentStepFields =
                                                isBeneficiaryForStep5
                                                    ? []
                                                    : ['studentIdFile'];
                                            break;
                                        default:
                                            currentStepFields = [];
                                    }

                                    const currentStepErrors = Object.entries(
                                        errors
                                    ).filter(([field]) =>
                                        currentStepFields.includes(field)
                                    );

                                    if (currentStepErrors.length > 0) {
                                        return (
                                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            className="h-5 w-5 text-yellow-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor">
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-yellow-800">
                                                            🚫 Form has
                                                            validation errors -
                                                            Cannot proceed
                                                        </h3>
                                                        <div className="mt-1 text-sm text-yellow-700">
                                                            Please review and
                                                            fix all highlighted
                                                            errors below before
                                                            continuing.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                            {renderStepContent()}

                            <NavigationButtons
                                currentStep={registrationStep}
                                isLoading={isRegistering}
                                onPrevStep={prevStep}
                                onNextStep={nextStep}
                                onSubmit={handleSubmit(onSubmitForm)}
                                totalSteps={steps.length}
                                isNextDisabled={
                                    registrationStep < steps.length
                                        ? !isStepValid
                                        : false
                                }
                            />
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Need help? Contact us at{' '}
                        <a
                            href="mailto:support@uclm.edu"
                            className="text-blue-600 hover:underline">
                            support@uclmcares.online  
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpdateRegistrationUI;
