import React from 'react';
import {
    CheckCircle,
    Clock,
    MapPin,
    ArrowRight,
    Zap,
    Wifi,
} from 'lucide-react';

const AttendanceSuccessPage = () => {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [animationComplete, setAnimationComplete] = React.useState(false);
    const [pulseVisible, setPulseVisible] = React.useState(true);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000)

        // Animation timing
        setTimeout(() => setAnimationComplete(true), 500);
        setTimeout(() => setPulseVisible(false), 2000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    }

    // Enhanced mock data with user-friendly information
    const attendanceData = {
        employeeName: 'Cris Dyford Bonghanoy',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
        department: 'Full Stack Developer',
        location: 'WeWork Downtown',
        recordedTime: currentTime,
        status: 'Checked In',
        streak: 12,
        nextMeeting: 'Team Standup in 30 mins',
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-300 to-blue-600 flex items-center justify-center p-4 relative overflow-y-auto">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-50 h-50 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-4 max-w-md w-full relative z-10 transform transition-all duration-700 ease-out">

                <div className="text-center mb-6 relative">
                    <div
                        className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 transform transition-all duration-500 ${
                            animationComplete ? 'scale-100' : 'scale-0'
                        } ${pulseVisible ? 'animate-pulse' : ''}`}>
                        <CheckCircle className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>

                    <div
                        className={`transition-all duration-700 delay-300 ${
                            animationComplete
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }`}>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            You're all set! 🎉
                        </h1>
                        <p className="text-gray-600 font-medium">
                            Welcome back,{' '}
                            {attendanceData.employeeName.split(' ')[0]}
                        </p>
                    </div>
                </div>

                <div
                    className={`flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl mb-6 transition-all duration-700 delay-500 ${
                        animationComplete
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                    }`}>
                    <div className="relative">
                        <img
                            src={attendanceData.avatar}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Zap className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                            {attendanceData.employeeName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {attendanceData.department}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-blue-600 text-xs font-semibold">
                                {attendanceData.streak} day streak!
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className={`space-y-3 mb-3 transition-all duration-700 delay-700 ${
                        animationComplete
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                    }`}>

                    <div className="text-center bg-gradient-to-r from-blue-50 to-blue-50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-600 font-semibold text-sm">
                                CHECKED IN AT
                            </span>
                        </div>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent mb-1">
                            {formatTime(attendanceData.recordedTime)}
                        </p>
                        <p className="text-gray-600 font-medium">
                            {formatDate(attendanceData.recordedTime)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-2 mb-1">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">
                                    LOCATION
                                </span>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">
                                {attendanceData.location}
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center space-x-2 mb-1">
                                <Wifi className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">
                                    STATUS
                                </span>
                            </div>
                            <p className="font-semibold text-emerald-600 text-sm">
                                {attendanceData.status}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className={`space-y-3 transition-all duration-700 delay-1000 ${
                        animationComplete
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                    }`}>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                        <span>View My Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <button className="w-full bg-white bg-opacity-80 text-gray-700 py-3 px-6 rounded-2xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                        Check Out Later
                    </button>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Powered by SmartAttend • Synced at{' '}
                        {formatTime(currentTime)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AttendanceSuccessPage