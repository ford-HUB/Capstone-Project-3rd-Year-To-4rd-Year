// CurrentEvent.jsx
import React from 'react'
import { Users, Star, MapPin, Play } from 'lucide-react';
import dayjs from 'dayjs';

const CurrentEvent = ({ matchedEvents =[] }) => {
    const [current, setCurrent] = React.useState(null)
    const [timeLeft, setTimeLeft] = React.useState(null)
    
    React.useEffect(() => {
        if (matchedEvents && matchedEvents.length > 0) {
            const now = new Date()
            const currentEvent = matchedEvents.find(event => {
                const startDate = new Date(event.event_started)
                return startDate <= now && new Date(event.event_ended) >= now
            })
            setCurrent(currentEvent)
        }
    }, [matchedEvents])

    React.useEffect(() => {
        if (!current) return

        const calculateTimeLeft = () => {
            const now = dayjs()
            const end = dayjs(current.event_ended)
            const diff = end.diff(now, 'second')

            if (diff <= 0) {
                return { hours: 0, minutes: 0, seconds: 0 }
            }

            return {
                hours: Math.floor(diff / 3600),
                minutes: Math.floor((diff % 3600) / 60),
                seconds: diff % 60
            }
        }

        // Set initial time
        setTimeLeft(calculateTimeLeft())

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(interval)
    }, [current])

    if (!current || !timeLeft) {
        return <div>No current event happening now</div>
    }

    const currentEventData = {
        title: current.title,
        startTime: dayjs(current.event_started).format('h:mm A'),
        image: current.event_image,
        participants: current.participants,
        organizer: current.Organizer.name,
        location: current.location,
        description: current.description
    }

    return (
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white relative overflow-hidden rounded-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-gray-100">Event Started</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium text-gray-500">
                        Started At {currentEventData.startTime}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <img 
                            src={currentEventData.image} 
                            alt="Current Event"
                            className="w-full h-40 object-cover rounded-lg border-2 border-white border-opacity-30 shadow-lg"
                        />
                        <div className="mt-4 space-y-2">
                            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="text-gray-500 w-4 h-4" />
                                    <span className='text-gray-500'>{currentEventData.participants} Participants</span>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="text-gray-500 w-4 h-4" />
                                    <span className='text-gray-500'>{currentEventData.organizer}</span>
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="text-gray-500 w-4 h-4" />
                                    <span className='text-gray-500'>{currentEventData.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-3">{currentEventData.title}</h2>
                            <p className="text-blue-100 mb-6">{currentEventData.description}</p>
                            
                            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 mb-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-2">Time Remaining</div>
                                    <div className="flex flex-cols justify-center gap-5 text-center auto-cols-max">
                                        <div className="flex flex-col text-gray-500">
                                            <span className="countdown font-mono text-5xl text-gray-500">
                                                <span style={{"--value":timeLeft.hours}}>{String(timeLeft.hours).padStart(2, '0')}</span>
                                            </span>
                                            hours
                                        </div>
                                        <div className="flex flex-col text-gray-500">
                                            <span className="countdown font-mono text-5xl text-gray-500">
                                                <span style={{"--value":timeLeft.minutes}}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                            </span>
                                            min
                                        </div>
                                        <div className="flex flex-col text-gray-500">
                                            <span className="countdown font-mono text-5xl text-gray-500">
                                                <span style={{"--value":timeLeft.seconds}}>{String(timeLeft.seconds).padStart(2, '0')}</span>
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
    )
}

export default CurrentEvent