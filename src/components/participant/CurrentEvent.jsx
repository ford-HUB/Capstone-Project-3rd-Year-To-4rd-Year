import React from 'react'
import { Users, Star, MapPin, Play } from 'lucide-react';
import { asset } from '../../assets/asset';

const CurrentEvent = () => {
    const [timeLeft, setTimeLeft] = React.useState({ hours: 2, minutes: 30, seconds: 45 });

    // Temporary data for current event
      const currentEvent = {
        title: "UCLM FREE HILOT",
        startTime: "9:30 AM",
        image: asset.fourThree,
        participants: 100,
        organizer: "Bea",
        location: "UCLM Basketball court",
        description: "walay description basta ari namo!"
    };

    React.useEffect(() => {
        const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
            } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
            } else if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
            }
            return prev;
        });
        }, 1000);

        return () => clearInterval(timer);
    }, []);


  return (
    <>
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-100">Event Started</span>
                </div>
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium text-gray-500">
                Started At {currentEvent.startTime}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <img 
                    src={currentEvent.image} 
                    alt="Current Event"
                    className="w-full h-40 object-cover rounded-lg border-2 border-white border-opacity-30 shadow-lg"
                />
                <div className="mt-4 space-y-2">
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="text-gray-500 w-4 h-4" />
                        <span className='text-gray-500'>{currentEvent.participants} Participants</span>
                    </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Star className="text-gray-500 w-4 h-4" />
                        <span className='text-gray-500'>{currentEvent.organizer}</span>
                    </div>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="text-gray-500 w-4 h-4" />
                        <span className='text-gray-500'>{currentEvent.location}</span>
                    </div>
                    </div>
                </div>
                </div>

                <div className="flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-3">{currentEvent.title}</h2>
                    <p className="text-blue-100 mb-6">{currentEvent.description}</p>
                    
                    <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 mb-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 mb-2">Time Remaining</div>
                            <div className="flex flex-cols justify-center gap-5 text-center auto-cols-max">
                                <div className="flex flex-col text-gray-500">
                                    <span className="countdown font-mono text-5xl text-gray-500">
                                        <span style={{"--value":timeLeft.hours} } aria-live="polite" aria-label={timeLeft.hours}>{String(timeLeft.hours)}</span>
                                    </span>
                                    hours
                                </div>
                                <div className="flex flex-col text-gray-500">
                                    <span className="countdown font-mono text-5xl text-gray-500">
                                        <span style={{"--value":timeLeft.minutes} } aria-live="polite" aria-label={timeLeft.minutes}>{timeLeft.minutes}</span>
                                    </span>
                                    min
                                </div>
                                <div className="flex flex-col text-gray-500">
                                    <span className="countdown font-mono text-5xl text-gray-500">
                                        <span style={{"--value":timeLeft.seconds} } aria-live="polite" aria-label={timeLeft.seconds}>{timeLeft.seconds}</span>
                                    </span>
                                    sec
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <button className="bg-white text-indigo-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <Play className="w-5 h-5" />
                    Watch Live
                </button>
                </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default CurrentEvent