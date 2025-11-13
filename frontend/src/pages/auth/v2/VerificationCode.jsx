import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../store/participant/useAuthStore.js';
import { useDonorAuthStore } from '../../../store/donor/useDonorAuthStore.js';
import { useProfileStore } from '../../../store/participant/useProfileStore.js';
import { useVerificationStore } from '../../../store/participant/useVerificationStore.js';
import { useVerificationStore as useDonorVerificationStore } from '../../../store/donor/useVerificationStore.js';
import { FormatTime } from '../../../utils/FormatTime.js';
import { useNavigate } from 'react-router-dom';

const VerificationCode = () => {
    const navigate = useNavigate()
    
    // Check if user is donor or participant based on localStorage userRole
    const isDonor = localStorage.getItem('userRole') === 'Donor';
    
    // Use appropriate stores based on user type
    const { checkAuth: checkParticipantAuth, authenticatedUser: participantUser } = useAuthStore();
    const { checkAuth: checkDonorAuth, authenticatedUser: donorUser } = useDonorAuthStore();
    const { undoEmailChanges } = useProfileStore()
    
    const [timeLeft, setTimeLeft] = React.useState(0);
    
    // Use appropriate verification store
    const participantVerification = useVerificationStore();
    const donorVerification = useDonorVerificationStore();
    
    const { otp_expiration, clearExpiresAt, resendCode, verifyCode } = isDonor ? donorVerification : participantVerification;
    const { checkAuth, authenticatedUser } = isDonor ? { checkAuth: checkDonorAuth, authenticatedUser: donorUser } : { checkAuth: checkParticipantAuth, authenticatedUser: participantUser };
    
    const [showResend, setShowResend] = React.useState(false);
    const [isResendLoading, setResendLoading] = React.useState(false)
    const [undoLoading, setUndoLoading] = React.useState(false)

    const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRefs = useRef([]);

    React.useEffect(() => {
        if (!otp_expiration) return;

        const expiryTime = new Date(otp_expiration).getTime();
        let intervalId;

        const updateTimer = () => {
            const now = Date.now();
            const diff = expiryTime - now;

            if (diff <= 0) {
                setTimeLeft(0);
                clearExpiresAt();
                setShowResend(true);
                if (intervalId) clearInterval(intervalId);
            } else {
                setTimeLeft(Math.floor(diff / 1000));
            }
        };

        intervalId = setInterval(updateTimer, 1000);
        updateTimer();
        
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [otp_expiration, clearExpiresAt]);

    React.useEffect(() => {
        let isMounted = true

        const runCheck = async () => {
            try {
                await checkAuth()
            } catch (error) {
                if(isMounted) {
                    console.error("Fetch error:", error);
                }
            }
            
        };

        runCheck();
        return () => {
            isMounted = false
        }
    }, [checkAuth]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleInputChange = (index, value) => {
        // Only allow alphanumeric characters
        const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        if (sanitizedValue.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = sanitizedValue;
            setOtp(newOtp);
            setError('');

            // Auto-focus next input
            if (sanitizedValue && index < 6) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 6) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === 'Enter') {
            handleVerifyEmail();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '');

        if (pastedData.length === 7) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            setError('');
            inputRefs.current[6]?.focus();
        }
    };

    const handleVerifyEmail = async () => {
        const enteredOTP = otp.join('');

        if (enteredOTP.length !== 7) {
            setError('Please enter the complete verification code');
            return;
        }

        setIsLoading(true);
        setError('');

        setTimeout(async () => {

            const success = await verifyCode(enteredOTP)
            if(!success) {
                setError('Invalid verification code. Please try again.');
                // Clear inputs on error response
                setOtp(['', '', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                setIsLoading(false)
                return
            }

            setIsSuccess(true);
            setError('');
            setIsLoading(false);
        }, 1500);
    };

    const handleResendCode = async () => {
        setOtp(['', '', '', '', '', '', '']);
        setError('');
        setIsSuccess(false);
        setResendLoading(true)
        inputRefs.current[0]?.focus();
        const success = await resendCode()
        if(!success) return setResendLoading(false)
        setResendLoading(false)
        console.log('Resending verification code...');
    };

    const handleChangeEmail = async () => {
        setUndoLoading(true)
        const success = await undoEmailChanges()
        if(!success) return setUndoLoading(false)
        setUndoLoading(false)

        navigate('/participant/profile')

    };

    const handleContinue = () => {
        if(!authenticatedUser) {
            return navigate('/')
        }

        // Redirect to appropriate dashboard based on user type
        if (isDonor) {
            navigate('/donor/dashboard')
        } else {
            navigate('/participant/profile')
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Email Verified!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Your email address has been successfully verified.
                    </p>
                    <button onClick={() => navigate('/')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="relative mx-auto mb-8 w-20 h-20">
                    <div className="w-16 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg mx-auto mb-2 relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform rotate-2"></div>
                        <div className="absolute top-2 left-2 w-12 h-1 bg-white rounded"></div>
                        <div className="absolute top-4 left-2 w-8 h-1 bg-white rounded"></div>
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">
                        Verify Your Email Address
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        A 7-character verification code has been sent to your
                        email. <br />
                        This step helps us confirm that it’s really you. <br />{' '}
                        Enter the code below to proceed safely.
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex gap-3 justify-center mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                value={digit}
                                onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-xl transition-all duration-200 ${
                                    error
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white'
                                } focus:outline-none focus:shadow-lg`}
                                maxLength={1}
                                autoComplete="off"
                                inputMode="text"
                                aria-label={`Digit ${
                                    index + 1
                                } of verification code`}
                            />
                        ))}
                    </div>

                    {
                        !showResend && error && (
                            <div className="text-red-500 text-sm text-center mb-4 p-2 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )
                    }
                </div>

                {
                    authenticatedUser && 
                    <div className="text-center mb-6">
                        <span className="text-gray-600 text-sm">
                            Want to Change Your Email Address?{' '}
                        </span>
                        <button
                            onClick={handleChangeEmail}
                            className="cursor-pointer text-green-500 hover:text-green-600 font-medium text-sm underline transition-colors">
                            Change Here
                        </button>
                    </div>
                }

                <button
                    onClick={handleVerifyEmail}
                    disabled={isLoading || otp.join('').length !== 7}
                    className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
                        isLoading || otp.join('').length !== 7
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Verifying...
                        </div>
                    ) : (
                        'Verify Email'
                    )}
                </button>

                {!showResend ? (
                    <div className=" text-gray-500 text-right p-0.5 text-xs">
                        expires in:{' '}
                        <span className="font-semibold">
                            {FormatTime(timeLeft)}
                        </span>
                    </div>
                ) : (
                    showResend && !isResendLoading ?
                    <div className="text-sm text-red-500 text-center mt-4">
                        OTP has expired. Please request a new code.
                    </div> : 
                    <div className=" text-gray-500 text-right p-0.5 text-xs">
                        expires in:{' '}
                        <span className="font-semibold">
                            {FormatTime(timeLeft)}
                        </span>
                    </div>
                )}

                {
                    showResend && (
                        <div className="text-center mt-6">
                        <button
                            onClick={handleResendCode}
                            className="text-gray-500 cursor-pointer hover:text-gray-700 text-sm transition-colors underline"
                            disabled={isResendLoading}>
                            {isResendLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Resending...
                                </div>
                            ) : (
                                'Resend Code'
                            )}
                        </button>
                    </div>
                    )
                }
            </div>
        </div>
    );
};

export default VerificationCode;
