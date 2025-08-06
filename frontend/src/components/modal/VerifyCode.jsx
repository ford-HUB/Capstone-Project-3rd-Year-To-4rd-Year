import React from 'react';
import OptionModal from './OptionModal.jsx';
import { FormatTime } from '../../utils/FormatTime.js';
import { useNavigate } from 'react-router-dom';
import { asset } from '../../assets/asset.jsx';
import { useVerificationStore } from '../../store/participant/useVerificationStore.js';
import { useAuthStore } from '../../store/participant/useAuthStore.js';

const VerifyCode = ({ onVerificationComplete }) => {
    const [current, setCurrent] = React.useState(true)
    const [otp, setOtp] = React.useState('');
    const [timeLeft, setTimeLeft] = React.useState(0);
    const { otp_expiration, clearExpiresAt, resendCode, verifyCode } = useVerificationStore()
    const [isResendLoading, setResendLoading] = React.useState(false)
    const [showResend, setShowResend] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
    if (!otp_expiration) return;

    const expiryTime = new Date(otp_expiration).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = expiryTime - now;

            if (diff <= 0) {
                setTimeLeft(0);
                clearExpiresAt();
                setShowResend(true)
                clearInterval(intervalId);
            } else {
                setTimeLeft(Math.floor(diff / 1000));
            }
        }

        updateTimer()
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [otp_expiration ])

    const { checkAuth, authenticatedUser } = useAuthStore()

    React.useEffect(() => {
        const runCheck = async () => {
            if (!authenticatedUser) return
            await checkAuth()
        }

        runCheck();
    }, [authenticatedUser])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const success = await verifyCode(otp)
        if(!success) return
        await onVerificationComplete();
        setCurrent(false)
        setTimeout( async()=> {
            await navigate('/')
        }, 1000)
    
    };

    const handleResendOtp = async(e) => {
        e.preventDefault()
        const success = await resendCode()
        if(!success) return
        setResendLoading(false)
        setShowResend(false)
    };

    return (
        <>
            <OptionModal open={current} setOpen={current}>
                <div className="content flex justify-between">
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES" className="h-24 w-24" />
                    </div>
                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className="flex justify-center items-end text-slate-500 text-[12px]">
                            Welcome To University Of Cebu
                        </span>
                        <h1 className="text-[26px] font-base">Verify<br /> Account</h1>
                    </div>
                </div>

                <div className="header flex justify-center py-3">
                    <h1 className='text-gray-400 text-sm'>Enter OTP we just sent to your email</h1>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my-3 text-sm font-base text-gray-400">
                        OTP Code
                    </span>
                </div>

                <div className="formContainer flex flex-col justify-center items-center mt-6">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex justify-center mb-4">
                            <input
                                type="text"
                                placeholder="Enter 7-digit OTP"
                                className="w-64 h-12 text-center border border-gray-300 rounded-md focus:border-blue-800 focus:ring-blue-800 text-xl tracking-widest"
                                maxLength={7}
                                inputMode="text"
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        {!showResend ? (
                            <div className=" text-gray-500 text-center text-xs">
                                Verification expires in: <span className="font-semibold">{FormatTime(timeLeft)}</span>
                            </div>
                        ) : (
                            <div className="text-sm text-red-500 text-center mt-4">
                                OTP has expired. Please request a new code.
                            </div>
                        )}

                        <div className="OptionSelection flex justify-center items-center mt-1 grid-cols-2 gap-2">
                            {showResend && (
                                <button
                                    disabled={isResendLoading}
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white"
                                >
                                    { isResendLoading ? 'Resending...': 'Resend' }
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </OptionModal>
        </>
    );
};

export default VerifyCode; 