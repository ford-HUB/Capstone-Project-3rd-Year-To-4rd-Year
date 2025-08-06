import React from 'react';
import OptionModal from '../../components/modal/OptionModal';
import { FormatTime } from '../../utils/FormatTime.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { asset } from '../../assets/asset';

const VerifyAccountPage = ({ email, onVerificationComplete }) => {
    const [open, setOpen] = React.useState(true);
    const [otp, setOtp] = React.useState('');
    const [timeLeft, setTime] = React.useState(300); // 5 minutes in seconds
    const [showResend, setShowResend] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if(timeLeft <= 0) {
            setShowResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTime(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOtpChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and limit to 7 digits
        if (/^\d*$/.test(value) && value.length <= 7) {
            setOtp(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 7) {
            toast.error('Please enter a valid 7-digit OTP');
            return;
        }

        try {
            // TODO: Verify OTP with backend
            console.log('OTP:', otp);
            console.log('Email:', email);
            
            // If verification is successful
            toast.success('Account verified successfully!');
            onVerificationComplete();
            navigate('/login');
        } catch (error) {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const handleResendOtp = () => {
        // TODO: Implement resend OTP logic
        setTime(300); // Reset to 5 minutes
        setShowResend(false);
        toast.success('New OTP sent to your email');
    };

    return (
        <>
            <OptionModal open={open}>
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

                <div className="header flex justify-center font-bold">
                    <h1>Enter OTP we just sent to your email</h1>
                </div>

                <div className="divisor w-full flex items-center justify-center mt-4">
                    <hr className="w-full border-t border-slate-300" />
                    <span className="absolute bg-white px-2 my-3 text-sm font-base text-gray-400">
                        OTP Code
                    </span>
                </div>

                <div className="formContainer flex flex-col justify-center items-center mt-6">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="flex justify-center mb-6">
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="Enter 7-digit OTP"
                                className="w-64 h-12 text-center border rounded-md shadow-sm focus:border-blue-800 focus:ring-blue-800 text-lg tracking-widest"
                                maxLength={7}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                            />
                        </div>

                        {!showResend ? (
                            <div className="text-sm text-gray-500 text-center mt-4">
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
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white"
                                >
                                    Resend
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

export default VerifyAccountPage;
