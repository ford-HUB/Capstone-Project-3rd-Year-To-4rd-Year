import React from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';

const NextEventCarousel = ({ matchedEvents = [] }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Filter out current event and get upcoming events
    const upcomingEvents = React.useMemo(() => {
        if (!matchedEvents || matchedEvents.length === 0) return [];
        
        const now = new Date();
        return matchedEvents
            .filter(event => {
                const startDate = new Date(event.event_started);
                return startDate > now; // Only future events
            })
            .sort((a, b) => new Date(a.event_started) - new Date(b.event_started)); // Sort by date
    }, [matchedEvents]);

    // Auto-slide for upcoming events
    React.useEffect(() => {
        if (upcomingEvents.length <= 1) return;
        
        const autoSlide = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % upcomingEvents.length);
        }, 4000);

        return () => clearInterval(autoSlide);
    }, [upcomingEvents.length]);

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % upcomingEvents.length);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + upcomingEvents.length) % upcomingEvents.length);
    };

    if (upcomingEvents.length === 0) {
        return (
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="text-center py-8 text-gray-500">
                    No upcoming events scheduled
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                {upcomingEvents.length > 1 && (
                    <div className="flex gap-2">
                        <button 
                            onClick={prevSlide}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Previous event"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Next event"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative overflow-hidden rounded-lg">
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {upcomingEvents.map((event) => (
                        <div key={event.event_id} className="w-full flex-shrink-0">
                            <div className="relative group cursor-pointer">
                                <img 
                                    src={event.event_image} 
                                    alt={event.title}
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x400?text=Event+Image';
                                        e.target.className = 'w-full h-48 object-contain bg-gray-200 rounded-lg p-4';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg opacity-60"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {dayjs(event.event_started).format('MMM D, h:mm A')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {event.participants}/{event.max_participants}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        className="bg-white bg-opacity-20 backdrop-blur text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
                                        aria-label="View event details"
                                    >
                                        <ArrowRight color='black' className="w-4 h-4  " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Carousel Indicators - Only show if more than one event */}
                {upcomingEvents.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {upcomingEvents.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                                }`}
                                aria-label={`Go to event ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NextEventCarousel;