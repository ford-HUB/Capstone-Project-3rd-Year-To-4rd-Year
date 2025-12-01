import React from 'react';
import { User, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import RHFInputField from '../RHFInputField.jsx';
import StepHeader from '../StepHeader.jsx';
import InfoBox from '../InfoBox.jsx';

const RHFAccountInfoStep = ({
    register,
    errors,
    watch,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    onEmailCheck,
    navigateToAccountInfoRef,
    emailValidationStatus,
    setEmailValidationStatus,
}) => {
    const isBeneficiary = watch('isBeneficiary') === 'true';
    const participantType = watch('participantType');
    const isAlumni = participantType === 'alumni';

    // Get dynamic label and placeholder based on participant type
    const getIdLabel = () => {
        switch (participantType) {
            case 'student':
                return 'Student ID';
            case 'staff':
                return 'Staff ID';
            case 'faculty':
                return 'Faculty ID';
            case 'alumni':
                return 'Alumni ID';
            default:
                return 'School ID';
        }
    };

    const getIdPlaceholder = () => {
        if (isBeneficiary) {
            return 'Not required for beneficiaries';
        }
        switch (participantType) {
            case 'student':
                return 'Enter your Student ID';
            case 'staff':
                return 'Enter your Staff ID';
            case 'faculty':
                return 'Enter your Faculty ID';
            case 'alumni':
                return 'Enter your Alumni ID';
            default:
                return 'Enter your School ID';
        }
    };

    // Handle email check for regular volunteers
    const handleEmailCheck = async (email) => {
        if (!email || email.trim() === '') {
            setEmailValidationStatus({
                checked: false,
                exists: false,
                valid: false,
                checking: false,
                message: '',
                canReuse: false,
            });
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailValidationStatus({
                checked: false,
                exists: false,
                valid: false,
                checking: false,
                message: 'Please enter a valid email address',
                canReuse: false,
            });
            return;
        }

        setEmailValidationStatus((prev) => ({
            ...prev,
            checking: true,
            checked: false,
        }));

        try {
            const response = await onEmailCheck(email);
            if (response.success) {
                setEmailValidationStatus({
                    checked: true,
                    exists: response.exists,
                    valid: !response.exists || response.canReuse,
                    checking: false,
                    message: response.message,
                    canReuse: response.canReuse || false,
                });
            } else {
                setEmailValidationStatus({
                    checked: false,
                    exists: false,
                    valid: false,
                    checking: false,
                    message: response.message || 'Error checking email',
                    canReuse: false,
                });
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailValidationStatus({
                checked: false,
                exists: false,
                valid: false,
                checking: false,
                message: 'Error checking email. Please try again.',
                canReuse: false,
            });
        }
    };

    // Auto-check email when it changes (with debounce)
    React.useEffect(() => {
        const email = watch('email');

        // Reset states when email changes
        setEmailValidationStatus({
            checked: false,
            exists: false,
            valid: false,
            checking: false,
            message: '',
            canReuse: false,
        });

        if (!email || email.trim() === '') {
            return;
        }

        // Debounce the email check
        const timeoutId = setTimeout(() => {
            handleEmailCheck(email);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [watch('email')]);

    return (
        <div className="space-y-6">
            <StepHeader
                title="Account Information"
                description="Create your login credentials"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RHFInputField
                    label={getIdLabel()}
                    name="studentId"
                    register={register}
                    error={errors.studentId}
                    placeholder={getIdPlaceholder()}
                    icon={User}
                    required={!isBeneficiary}
                    disabled={isBeneficiary}
                />

                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700">
                        Email Address{' '}
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="email@gmail.com"
                            className={`w-full px-3 py-2 pl-10 pr-12 border rounded-md focus:outline-none focus:ring-2 ${
                                errors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : emailValidationStatus.exists && !emailValidationStatus.canReuse
                                    ? 'border-red-500 focus:ring-red-500'
                                    : emailValidationStatus.canReuse
                                    ? 'border-yellow-500 focus:ring-yellow-500'
                                    : emailValidationStatus.valid
                                    ? 'border-green-500 focus:ring-green-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('email')}
                        />

                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {emailValidationStatus.checking ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : emailValidationStatus.checked ? (
                                emailValidationStatus.exists ? (
                                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            !
                                        </span>
                                    </div>
                                ) : (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                )
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            )}
                        </div>
                    </div>

                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}

                    {/* Show email status messages */}
                    {emailValidationStatus.checked && emailValidationStatus.message && (
                        <div
                            className={`rounded-md p-3 ${
                                emailValidationStatus.exists && !emailValidationStatus.canReuse
                                    ? 'bg-red-50 border border-red-200'
                                    : emailValidationStatus.canReuse
                                    ? 'bg-yellow-50 border border-yellow-200'
                                    : 'bg-green-50 border border-green-200'
                            }`}>
                            <p
                                className={`text-sm ${
                                    emailValidationStatus.exists && !emailValidationStatus.canReuse
                                        ? 'text-red-800'
                                        : emailValidationStatus.canReuse
                                        ? 'text-yellow-800'
                                        : 'text-green-800'
                                }`}>
                                {emailValidationStatus.message}
                            </p>
                        </div>
                    )}
                    {emailValidationStatus.checking && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                            <p className="text-blue-800 text-sm">
                                <div className="inline animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                                Checking email availability...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700">
                        Confirm Password{' '}
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
            </div>

            <InfoBox
                type="info"
                title="Password Requirements:">
                <ul className="space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                </ul>
            </InfoBox>
        </div>
    );
};

export default RHFAccountInfoStep;
