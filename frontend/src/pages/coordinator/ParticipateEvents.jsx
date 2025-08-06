import React, { useState } from 'react';
import { ListCollapse, Users, Star, MapPin, Play, Calendar, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import CoordinatorSidePanel from '../../components/coordinator/CoordinatorSidePanel';
import { asset } from '../../assets/asset';

const ParticipateEvents = () => {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 2, minutes: 30, seconds: 45 });
  const [nextEventIndex, setNextEventIndex] = React.useState(0);

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

  // Temporary data for next events
  const nextEvents = [
    {
      id: 1,
      title: "Community Outreach",
      time: "2:00 PM",
      participants: 45,
      image: asset.fourThree
    },
    {
      id: 2,
      title: "Health Seminar",
      time: "4:00 PM",
      participants: 30,
      image: asset.fourThree
    }
  ];

  // Temporary data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Addiction Seminar",
      date: "May 28",
      time: "1:00 PM",
      participants: 22,
      type: "School",
      priority: "high"
    },
    {
      id: 2,
      title: "Tabang sa mayaman event",
      date: "May 29",
      time: "3:00 PM",
      participants: 30,
      type: "Program",
      priority: "medium"
    },
    {
      id: 3,
      title: "Community Free Foods",
      date: "May 30",
      time: "10:00 AM",
      participants: 45,
      type: "Program",
      priority: "high"
    }
  ];

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

  const nextSlide = () => {
    setNextEventIndex((prev) => (prev + 1) % nextEvents.length);
  };

  const prevSlide = () => {
    setNextEventIndex((prev) => (prev - 1 + nextEvents.length) % nextEvents.length);
  };

  return (
    <div className="p-6 bg-gray-50 pt-24">
      <div className="flex flex-col md:flex-row gap-4">
        <CoordinatorSidePanel />
        
        {/* Top participant ni*/}
        <div className="w-full md:w-1/3 ml-12 pl-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🏆 Top Participants This Week
            </h2>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <ul className="space-y-4">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                  Most active participants this week
                </li>
                
                {/* Top Participant 1 */}
                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
                  <div>
                    <img 
                      className="w-10 h-10 rounded-lg" 
                      src={asset.cris}
                      alt="Participant"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Cris Dyford Bonghanoy</div>
                    <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <ListCollapse className="w-5 h-5 text-gray-500" />
                  </button>
                </li>

                {/* Top Participant 2 */}
                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-thin opacity-30 tabular-nums">02</div>
                  <div>
                    <img 
                      className="w-10 h-10 rounded-lg" 
                      src={asset.bossing}
                      alt="Participant"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Darryl Gabito</div>
                    <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <ListCollapse className="w-5 h-5 text-gray-500" />
                  </button>
                </li>

                {/* Top Participant 3 */}
                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-thin opacity-30 tabular-nums">03</div>
                  <div>
                    <img 
                      className="w-10 h-10 rounded-lg" 
                      src={asset.backgroundV2}
                      alt="Participant"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Sean Allen Curaraton</div>
                    <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <ListCollapse className="w-5 h-5 text-gray-500" />
                  </button>
                </li>

                {/* Top Participant 4 */}
                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-thin opacity-30 tabular-nums">04</div>
                  <div>
                    <img 
                      className="w-10 h-10 rounded-lg" 
                      src={asset.master}
                      alt="Participant"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Daryl Jay Bueno</div>
                    <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <ListCollapse className="w-5 h-5 text-gray-500" />
                  </button>
                </li>

                {/* Top Participant 5 */}
                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-thin opacity-30 tabular-nums">05</div>
                  <div>
                    <img 
                      className="w-10 h-10 rounded-lg" 
                      src={asset.boy}
                      alt="Participant"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Kent Amante</div>
                    <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <ListCollapse className="w-5 h-5 text-gray-500" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content - Now on the right */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Current Event Section */}
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
                                <span style={{"--value":timeLeft.hours}} aria-live="polite" aria-label={timeLeft.hours}>{String(timeLeft.hours)}</span>
                              </span>
                              hours
                            </div>
                            <div className="flex flex-col text-gray-500">
                              <span className="countdown font-mono text-5xl text-gray-500">
                                <span style={{"--value":timeLeft.minutes}} aria-live="polite" aria-label={timeLeft.minutes}>{timeLeft.minutes}</span>
                              </span>
                              min
                            </div>
                            <div className="flex flex-col text-gray-500">
                              <span className="countdown font-mono text-5xl text-gray-500">
                                <span style={{"--value":timeLeft.seconds}} aria-live="polite" aria-label={timeLeft.seconds}>{timeLeft.seconds}</span>
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

            {/* Next Events Carousel */}
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
                  {nextEvents.map((event) => (
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
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                  Total {upcomingEvents.length} results
                </span>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {event.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.priority === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{event.participants}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-color opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-200">
                          Manage
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                  <Calendar className="w-4 h-4" />
                  View Full Event Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipateEvents; 