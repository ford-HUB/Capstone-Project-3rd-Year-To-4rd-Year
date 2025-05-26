import React from 'react'
import { ChevronLeft, ChevronRight, Clock, Users, ArrowRight } from 'lucide-react'
import { asset } from '../../assets/asset';

const NextEventCarousel = () => {
    const [nextEventIndex, setNextEventIndex] = React.useState(0);

    // Mock data for next events carousel
    const nextEvents = [
        {
        id: 1,
        image: asset.fourOne,
        title: "Team Building Challenge",
        time: "2:00 PM Today",
        participants: 24
        },
        {
        id: 2,
        image: asset.groupImage,
        title: "Innovation Workshop",
        time: "Tomorrow 10:00 AM",
        participants: 18
        },
        {
        id: 3,
        image: asset.fourFour,
        title: "Community Service Day",
        time: "May 27, 9:00 AM",
        participants: 35
        }
    ];

    // Auto-slide for next events
    React.useEffect(() => {
        const autoSlide = setInterval(() => {
        setNextEventIndex(prev => (prev + 1) % nextEvents.length);
        }, 4000);

        return () => clearInterval(autoSlide);
    }, [nextEvents.length]);

    const nextSlide = () => {
        setNextEventIndex((prev) => (prev + 1) % nextEvents.length);
    };

    const prevSlide = () => {
        setNextEventIndex((prev) => (prev - 1 + nextEvents.length) % nextEvents.length);
    };

  return (
    <>
        <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Next Events</h3>
            <div className="flex gap-2">
                <button 
                onClick={prevSlide}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                onClick={nextSlide}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            </div>

            <div className="relative overflow-hidden rounded-lg">
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${nextEventIndex * 100}%)` }}
            >
                {nextEvents.map((event, _i) => (
                <div key={event.id} className="w-full flex-shrink-0">
                    <div className="relative group cursor-pointer">
                    <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg opacity-60"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{event.participants}</span>
                        </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white bg-opacity-20 backdrop-blur text-white p-2 rounded-full hover:bg-opacity-30 transition-all">
                        <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {nextEvents.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setNextEventIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                    index === nextEventIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                    }`}
                />
                ))}
            </div>
            </div>
        </div>
    </>
  )
}

export default NextEventCarousel