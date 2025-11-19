import React from 'react';
import { BookOpen, Award, Wifi, WifiOff, MapPin, RefreshCw } from 'lucide-react';
import { useBeneficiaryEventStore } from '../../../store/beneficiary/useBeneficiaryEventStore.js';
import BeneficiaryEventCard from '../../../components/beneficiary/v2/BeneficiaryEventCard.jsx';
import BeneficiaryRecommendationSidebar from '../../../components/beneficiary/v2/sidebar/BeneficiaryRecommendationSidebar.jsx';
import BeneficiaryEventCalendar from '../../../components/beneficiary/v2/cards/BeneficiaryEventCalendar.jsx';
import BeneficiaryLocationStats from '../../../components/beneficiary/v2/cards/BeneficiaryLocationStats.jsx';
import { initSocket } from '../../../api/socket.js';
import TestimonialSubmissionModal from '../../../components/modal/v2/beneficiary/TestimonialSubmissionModal.jsx';

const BeneficiaryHomePage = () => {
    const { 
        nearYouEvents, 
        almostNearYouEvents, 
        recommendations,
        beneficiaryLocation,
        beneficiaryCity,
        getMatchedEvents, 
        refreshMatches,
        matchingProgress,
        isSocketConnected,
        isLoading,
        initializeSocket,
        cleanupSocket,
        checkConnectionStatus,
        clearLoading,
        getAttendanceRecords
    } = useBeneficiaryEventStore();

    const [dots, setDots] = React.useState('');
    const [showTestimonialModal, setShowTestimonialModal] = React.useState(false);
    const [testimonialEventData, setTestimonialEventData] = React.useState(null);

    // Show near you events in center, recommendations in sidebar
    const allEvents = [...nearYouEvents, ...almostNearYouEvents];
    

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
        initializeSocket();
        
        return () => {
            cleanupSocket();
        };
    }, [initializeSocket, cleanupSocket]);

    // Fetch events on component mount
    React.useEffect(() => {
        let isMounted = true;
        
        const fetchEvents = async () => {
            try {
                if (allEvents.length === 0) {
                    const checkMatch = await getMatchedEvents();
                    // Events loaded or error occurred
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching events:', err.message);
                }
            } finally {
                if (isMounted) clearLoading();
            }
        };

        fetchEvents();

        return () => {
            isMounted = false;
        };
    }, [getMatchedEvents, clearLoading]);

    // Check for completed events and show testimonial modal
    React.useEffect(() => {
        const checkCompletedEvents = async () => {
            try {
                const response = await getAttendanceRecords(1, 10);

                if (response?.success && response?.data?.length > 0) {
                    // Get events that have ended and beneficiary has time_out
                    const completedEvents = response.data.filter(record => 
                        record.event?.status === 'Completed' && 
                        record.time_out && 
                        record.event?.event_ended
                    );

                    if (completedEvents.length > 0) {
                        // Get the most recent completed event
                        const mostRecentEvent = completedEvents[0];
                        const eventId = mostRecentEvent.event?.event_id;

                        // Check if we've already shown testimonial modal for this event
                        const shownTestimonials = JSON.parse(
                            localStorage.getItem('shownTestimonials') || '[]'
                        );

                        if (eventId && !shownTestimonials.includes(eventId)) {
                            // Show modal for this event
                            setTestimonialEventData({
                                event_id: eventId,
                                title: mostRecentEvent.event?.title
                            });
                            setShowTestimonialModal(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking completed events:', error);
            }
        };

        // Check on mount and periodically (every 5 minutes)
        checkCompletedEvents();
        const interval = setInterval(checkCompletedEvents, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [getAttendanceRecords]);

    const handleTestimonialClose = () => {
        setShowTestimonialModal(false);
        if (testimonialEventData?.event_id) {
            // Mark this event as shown
            const shownTestimonials = JSON.parse(
                localStorage.getItem('shownTestimonials') || '[]'
            );
            if (!shownTestimonials.includes(testimonialEventData.event_id)) {
                shownTestimonials.push(testimonialEventData.event_id);
                localStorage.setItem('shownTestimonials', JSON.stringify(shownTestimonials));
            }
        }
        setTestimonialEventData(null);
    };

    const handleTestimonialSuccess = () => {
        // Modal will close automatically after success
    };

    const handleRefreshMatches = async () => {
        await refreshMatches();
    };

    if (isLoading && allEvents.length === 0) {
        return (
            <div className="bg-gray-30">
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Finding events near you{dots}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-30">
            <div className="flex justify-between">
                <div className="bg-blue-50 flex-col border-r border-gray-300 overflow-hidden">
                    <BeneficiaryRecommendationSidebar 
                        nearYouEvents={nearYouEvents}
                        almostNearYouEvents={almostNearYouEvents}
                        recommendations={recommendations}
                        beneficiaryLocation={beneficiaryLocation}
                        beneficiaryCity={beneficiaryCity}
                    />
                </div>
                
                <div className="flex flex-col p-4">
                    <div className="flex space-x-3.5 items-center pb-4">
                        <BookOpen className='h-12 w-12'/>
                        <h1 className="text-gray-800 text-3xl py-2">
                            Events Near You
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
                            <button
                                onClick={handleRefreshMatches}
                                disabled={isLoading}
                                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors disabled:opacity-50"
                                title="Refresh location-based matches"
                            >
                                <RefreshCw className={`h-4 w-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Matching Progress Indicator */}
                    {matchingProgress && (
                        <div className="mb-4 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-blue-700 text-sm">
                                    {matchingProgress.message}
                                </span>
                            </div>
                        </div>
                    )}

                    <span className='text-xl font-bold pb-2'>Near You Events</span>


                    <div className='flex items-center'>
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {
                            allEvents?.length > 0 ? (
                                allEvents.map((event, index) => (
                                    <div key={event?.event_id || index} className="w-full">
                                        <BeneficiaryEventCard eventData={event} />
                                    </div>
                                ))
                            ) : (
                                <div className='text-gray-500 col-span-full p-4 bg-gray-50 rounded text-center'>
                                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-semibold mb-2">No events found near you</h3>
                                    <p className="text-sm text-gray-600">
                                        We could not see any applicable event that you might be almost near you or can travel to go. Check back later or try refreshing.
                                    </p>
                                </div>
                            )
                        }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col border-l border-gray-200 bg-gradient-to-b from-gray-50 to-white w-[21rem] h-screen pb-16 overflow-y-auto scrollbar-hide">
                    {/* Header Section */}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 z-10">
                        <h3 className="text-lg font-semibold text-gray-800">Location Overview</h3>
                        <p className="text-sm text-gray-500 mt-1">Events & assistance near you</p>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 px-4 py-6 space-y-6">
                        {/* Location Stats Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Location Stats</h4>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <BeneficiaryLocationStats 
                                nearYouCount={nearYouEvents.length}
                                almostNearYouCount={almostNearYouEvents.length}
                                recommendationsCount={recommendations.length}
                                beneficiaryCity={beneficiaryCity}
                            />
                        </div>

                        {/* Event Calendar Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Event Calendar</h4>
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                            <BeneficiaryEventCalendar eventData={allEvents}/>
                        </div>

                        {/* Quick Stats Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-3">Quick Stats</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{nearYouEvents?.length || 0}</div>
                                    <div className="text-xs text-blue-500">Near You</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{almostNearYouEvents?.length || 0}</div>
                                    <div className="text-xs text-green-500">Almost Near</div>
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
                                {isSocketConnected ? 'Real-time location matching active' : 'Using cached data'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonial Modal */}
            <TestimonialSubmissionModal
                isOpen={showTestimonialModal}
                onClose={handleTestimonialClose}
                eventData={testimonialEventData}
                onSuccess={handleTestimonialSuccess}
            />
        </div>
    );
};

export default BeneficiaryHomePage;
