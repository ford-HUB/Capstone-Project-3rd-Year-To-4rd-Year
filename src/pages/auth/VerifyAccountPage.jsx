import React from 'react';
import OptionModal from '../../components/modal/OptionModal';
import { FormatTime } from '../../utils/FormatTime.js';
import { asset } from '../../assets/asset';

const VerifyAccountPage = () => {
    const [open, setOpen] = React.useState(true)
    const [otp, setOtp] = React.useState('')
    const [agree, setAgree] = React.useState(false)

    const [timeLeft, setTime] = React.useState(100)

    React.useEffect(() => {
        if(timeLeft <= 0) return

        const timer = setInterval(() => {
            setTime(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!otp) {
            alert('Please enter OTP');
            return;
        }

        if (!agree) {
            alert('Please accept the terms and conditions');
            return;
        }

        console.log('OTP:', otp);
        console.log('Agreed:', agree);
    };

    return (
        <>
            <OptionModal open={open}>
                {/* <div className="content flex justify-between">
                    <div className="logo px-2 py-4">
                        <img src={asset.logo} alt="UCLM CARES" className="h-24 w-24" />
                    </div>
                    <div className="titleContainer flex justify-end flex-col py-5 pl-2.5">
                        <span className="flex justify-center items-end text-slate-500 text-[12px]">
                            Welcome To University Of Cebu
                        </span>
                        <h1 className="text-[26px] font-base">Verify<br /> Account</h1>
                    </div>
                </div> */}

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

                        <div class="flex justify-center gap-2 mb-6">
                            <input className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-blue-800 focus:ring-blue-800" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required/>
                            <input className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-blue-800 focus:ring-blue-800" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required/>
                            <input className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-blue-800 focus:ring-blue-800" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required/>
                            <input className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-blue-800 focus:ring-blue-800" type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" autocomplete="one-time-code" required/>
                        </div>

                        {timeLeft > 0 && (
                        <div className="text-sm text-gray-500 text-center mt-4">
                            Verification expires in: <span className="font-semibold">{FormatTime(timeLeft)}</span>
                        </div>
                    )}


                        <div className="OptionSelection flex justify-center items-center mt-1 grid-cols-2 gap-2">
                            {
                                timeLeft <= 0 && <button
                                className="bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white"
                                type="submit" >
                                Resend
                            </button>
                            }
                            <button
                                className="bg-blue-600 rounded-md text-white w-full px-1.5 py-2 text-[18px] font-Roboto flex justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-400 hover:text-white"
                                type="submit" >
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
