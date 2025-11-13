import dayjs from "dayjs";

const BeneficiaryCustomToast = ({t, userData, message, eventDetails}) => {
    const now = dayjs()

    const isTimeIn = message.toLowerCase().includes("time-in".toLowerCase());
    const isTimeOut = message.toLowerCase().includes("time-out".toLowerCase()) || message.toLowerCase().includes("checked out");

    return (
        <div
            className={`${
                t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
            } max-w-2xl w-full bg-white shadow-xl rounded-2xl pointer-events-auto border border-gray-100 overflow-hidden transform transition-all duration-500 ease-out`}
            style={{
                animation: t.visible 
                    ? 'slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' 
                    : 'slideOutSmooth 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
            }}>
            
            {/* Custom CSS animations */}
            <style jsx>{`
                @keyframes slideInBounce {
                    0% {
                        transform: translateX(100%) scale(0.9);
                        opacity: 0;
                    }
                    50% {
                        transform: translateX(-5%) scale(1.02);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutSmooth {
                    0% {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%) scale(0.95);
                        opacity: 0;
                    }
                }
                
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scaleIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes slideInLeft {
                    0% {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideInRight {
                    0% {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.4s ease-out 0.2s both;
                }
                
                .animate-slide-in-left {
                    animation: slideInLeft 0.5s ease-out 0.1s both;
                }
                
                .animate-slide-in-right {
                    animation: slideInRight 0.5s ease-out 0.2s both;
                }
                
                .animate-fade-in-delay-1 {
                    animation: fadeInUp 0.6s ease-out 0.1s both;
                }
                
                .animate-fade-in-delay-2 {
                    animation: fadeInUp 0.6s ease-out 0.2s both;
                }
                
                .animate-fade-in-delay-3 {
                    animation: fadeInUp 0.6s ease-out 0.3s both;
                }
            `}</style>


            <div className={`px-6 py-4 ${isTimeIn ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} animate-fade-in-up`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                            isTimeIn ? 'bg-green-500' : 'bg-blue-500'
                        } animate-pulse`}></div>
                        <span className={`text-xl font-bold ${
                            isTimeIn ? 'text-green-800' : 'text-blue-800'
                        }`}>
                            {isTimeIn ? 'Checked In' : 'Event Completed'}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                            {now.format('h:mm A')}
                        </p>
                        <p className="text-sm text-gray-600">
                            {now.format('MMM D, YYYY')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 animate-slide-in-left">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Hi, {userData?.firstname || 'Beneficiary'}! 👋
                            </h3>
                            <p className="text-lg text-gray-700 mb-4">
                                {isTimeIn ? 'Welcome to the event!' : 'Thanks for participating!'}
                            </p>
                            
                            <div className="inline-flex items-center justify-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
                                <svg className="w-5 h-5 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-base font-semibold text-green-700">
                                    Successfully Recorded
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 flex items-center justify-center animate-scale-in">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center w-full hover:scale-105 transition-transform duration-200 border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                {isTimeIn ? 'Arrival Time' : 'Completion Time'}
                            </p>
                            <p className="text-4xl font-bold text-gray-900 mb-1">
                                {now.format('h:mm')}
                            </p>
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                {now.format('A')}
                            </p>
                            <p className="text-sm text-gray-500">
                                {now.format('dddd')}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1 animate-slide-in-right">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 h-full hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                <h4 className="text-sm font-bold text-blue-800 tracking-wide">EVENT DETAILS</h4>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xl font-bold text-gray-900 leading-tight">
                                        {eventDetails.title}
                                    </p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3 transform hover:translate-x-1 transition-transform duration-200">
                                        <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {dayjs(eventDetails.event_started).format('MMM D, YYYY')}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {dayjs(eventDetails.event_started).format('h:mm A')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start space-x-3 transform hover:translate-x-1 transition-transform duration-200">
                                        <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-700">
                                            {eventDetails.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BeneficiaryCustomToast;