import React from 'react';
import { BookOpen, Award, Wifi, WifiOff } from 'lucide-react';
import EventCard from '../../../components/participant/v2/EventCard.jsx';
import { useEventStore } from '../../../store/participant/useEventStore.js';
import { useCertificateStore } from '../../../store/common/useCertificateStore.js';
import RecommendationSidebar from '../../../components/participant/v2/sidebar/RecommendationSidebar.jsx';
import EventCalendar from '../../../components/participant/v2/cards/EventCalendar.jsx';
import CertificateInformative from '../../../components/common/certificate/cards/CertificateInformative.jsx';
import { initSocket } from '../../../api/socket.js';

const ParticpantHomePage = () => {
    const { 
        matchedEvents, 
        recommendations, 
        getMatchEvent, 
        eventData, 
        getEventData,
        matchingProgress,
        isSocketConnected,
        isLoading,
        initializeSocket,
        cleanupSocket,
        checkConnectionStatus,
        clearLoading,
        interest
    } = useEventStore();
    const { getCertificates, certificateData } = useCertificateStore()
    const [searchQuery, setSearchQuery] = React.useState('');
    const [dots, setDots] = React.useState('');

    React.useEffect(() => {
        const interval = setInterval(() => {
          setDots(prev => {
            if (prev === '...') return '';
            return prev + '.';
          });
        }, 500);
    
        return () => clearInterval(interval);
    }, []);

    // Initialize socket connection on mount
    React.useEffect(() => {
        // Initialize socket first, then set up listeners
        initSocket();
        
        // Small delay to ensure socket is ready
        const timer = setTimeout(() => {
            initializeSocket();
        }, 100);
        
        // Periodic connection status check
        const statusCheckInterval = setInterval(() => {
            checkConnectionStatus();
        }, 5000); // Check every 5 seconds
        
        return () => {
            clearTimeout(timer);
            clearInterval(statusCheckInterval);
            cleanupSocket();
        };
    }, [initializeSocket, cleanupSocket, checkConnectionStatus]);

    // Optimized data fetching with polling fallback
    React.useEffect(() => {
        const fetchMatchedEvents = async () => {
            try {
                await getMatchEvent();
            } catch (error) {
                console.log('fetch matched events error:', error.message);
            }
        };

        // Initial fetch
        fetchMatchedEvents();
        
        // Polling fallback every 30 seconds if socket is not connected
        const pollInterval = setInterval(() => {
            if (!isSocketConnected) {
                fetchMatchedEvents();
            }
        }, 30000);

        return () => clearInterval(pollInterval);
    }, [getMatchEvent, isSocketConnected]);

    React.useEffect(() => {
        const fetchEventData = async () => {
            try {
                await getEventData();
            } catch (error) {
                console.log('fetch event data error:', error.message);
            }
        };

        if (eventData?.length === 0) {
            fetchEventData();
        }
    }, [eventData?.length, getEventData]);

    React.useEffect(() => {
        getCertificates()
    }, [certificateData?.length])

    // Clear loading when we have data
    React.useEffect(() => {
        if ((matchedEvents && matchedEvents.length > 0) || (recommendations && recommendations.length > 0)) {
            clearLoading();
        }
    }, [matchedEvents, recommendations, clearLoading])

    const filteredMatchedEvents = React.useMemo(() => {
        if (!matchedEvents || matchedEvents.length === 0) return [];
        if (!interest || interest.length === 0) return matchedEvents;

        const normalize = (value) =>
            (value || '')
                .toString()
                .toLowerCase()
                .trim()
                .replace(/s\b/, ''); // basic plural handling (e.g. "drives" -> "drive")

        const normalizedInterests = new Set(interest.map(normalize));

        return matchedEvents.filter((event) => {
            const categories = event.Categories || [];

            // If the event has no categories, keep it as a safe default
            if (!categories.length) return true;

            return categories.some((cat) => {
                const normalizedCategory = normalize(cat.name || cat.category_name || '');

                if (normalizedInterests.has(normalizedCategory)) {
                    return true;
                }

                for (const interestName of normalizedInterests) {
                    if (
                        normalizedCategory.includes(interestName) ||
                        interestName.includes(normalizedCategory)
                    ) {
                        return true;
                    }
                }

                return false;
            });
        });
    }, [matchedEvents, interest]);


    // Show loading only if we have no data and are actually loading
    if (isLoading && (!matchedEvents || matchedEvents.length === 0) && (!recommendations || recommendations.length === 0))
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your personalized events{dots}</p>
                </div>
            </div>
        )
    
    console.log('recommendation result: ', recommendations)
    console.log('Socket connection status: ', isSocketConnected)
    
    return (
        <div className="bg-gray-30 min-h-screen">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-4">
                {/* AI Recommendation sidebar - stacks on small, sidebar on large */}
                <div className="bg-blue-50 flex-col border-b lg:border-b-0 lg:border-r border-gray-300 overflow-hidden w-full lg:w-[22rem] order-3 lg:order-1">
                    <RecommendationSidebar eventData={recommendations} />
                </div>

                {/* Main personalized matches area */}
                <div className="flex flex-col p-4 flex-1 order-1 lg:order-2">
                    <div className="flex space-x-3.5 items-center pb-4">
                       <BookOpen className='h-12 w-12'/>
                        <h1 className="text-gray-800 text-3xl py-2">
                         Your Personalized Event Matches
                        </h1>
                        <div className="ml-auto flex items-center space-x-2">
                            {isSocketConnected ? (
                                <div className="flex items-center text-green-600 space-x-2">
                                    <Wifi className="h-5 w-5" />
                                    <span className="text-sm">Live</span>
                                </div>
                            ) : (
                                <div className="flex items-center text-gray-400">
                                    <WifiOff className="h-5 w-5" />
                                    <span className="text-sm">Offline</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {matchingProgress && (
                        <div className="mb-4 p-3  rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-blue-700 text-sm">
                                    {matchingProgress.message}
                                </span>
                            </div>
                        </div>
                    )}

                    <span className='text-xl font-bold pb-2'>In-Progress</span>

                    <div className='flex items-start'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-10 lg:pb-0 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
                            {
                                filteredMatchedEvents?.length > 0 ? (
                                    filteredMatchedEvents.map((event) => (
                                        <EventCard key={event.event_id} eventData={event} />
                                    ))
                                ) : (
                                    <div className='text-gray-500'>No matched events found.</div>
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* Quick overview sidebar - full width on mobile, sidebar on large */}
                <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 bg-gradient-to-b from-gray-50 to-white w-full lg:w-[21rem] lg:h-screen pb-6 lg:pb-16 overflow-y-auto scrollbar-hide order-2 lg:order-3">
                    {/* Header Section */}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-10">
                        <h3 className="text-lg font-semibold text-gray-800">Quick Overview</h3>
                        <p className="text-sm text-gray-500 mt-1">Your events & achievements</p>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 px-4 py-6 space-y-6">
                        {/* Event Calendar Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Event Calendar</h4>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                            <EventCalendar eventData={eventData}/>
                        </div>

                        {/* Certificate Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Achievements</h4>
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <CertificateInformative certificateData={certificateData}/>
                        </div>

                        {/* Quick Stats Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-3">Quick Stats</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{filteredMatchedEvents?.length || 0}</div>
                                    <div className="text-xs text-blue-500">Matched Events</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{certificateData?.length || 0}</div>
                                    <div className="text-xs text-green-500">Certificates</div>
                                </div>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className={`rounded-xl p-3 border ${isSocketConnected ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center space-x-2">
                                {isSocketConnected ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-700">Live Updates</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-amber-700">Offline Mode</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {isSocketConnected ? 'Real-time event matching active' : 'Using cached data'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticpantHomePage;
