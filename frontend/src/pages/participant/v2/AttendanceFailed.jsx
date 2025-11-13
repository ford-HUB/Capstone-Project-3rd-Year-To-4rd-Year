import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanQRAttendanceStore } from '../../../store/common/useScanQRAttendanceStore.js';
import { getMessageInfo, getColorClasses, renderIcon } from '../../../utils/attendanceMessageUtils.jsx';

const AttendanceFailed = () => {
    const navigate = useNavigate()
    const { message } = useScanQRAttendanceStore()

    const messageInfo = getMessageInfo(message || '');
    const { type, icon, title, description, color, instructions } = messageInfo;

    const colorClasses = getColorClasses(color);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 text-center">
                    <div className="mb-8">
                        <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${colorClasses.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                            {renderIcon(icon)}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">
                            {title}
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {description}
                        </p>
                    </div>
                    
                    <div className="mb-8">
                        <div className={`bg-gradient-to-r ${colorClasses.bg} rounded-2xl p-6 border ${colorClasses.border}`}>
                            <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 w-2 h-2 bg-gradient-to-r ${colorClasses.gradient} rounded-full mt-2`}></div>
                                <p className={`${colorClasses.text} font-medium text-left`}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">What you can do:</h3>
                        <div className="space-y-3 text-left">
                            {instructions.map((instruction, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 bg-gradient-to-r ${colorClasses.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-600">{instruction}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/participant/dashboard')}
                            className={`w-full bg-gradient-to-r ${colorClasses.button} text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Return to Home</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => window.location.href = "https://lens.google.com"}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
                        >
                            Return to Scanner
                        </button>
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Need help? Contact the event organizer for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AttendanceFailed;