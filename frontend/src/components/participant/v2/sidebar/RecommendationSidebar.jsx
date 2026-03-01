import React from 'react';
import dayjs from 'dayjs';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    ChevronRight,
    Filter,
} from 'lucide-react';
import EventRegistrationModal from '../../../modal/v2/participant/EventRegistrationModal';
import { useEventStore } from '../../../../store/event/useEventStore.js';
import { useEventStore as useEventParticipantStore } from '../../../../store/participant/useEventStore.js';
import CancelRegistrationModal from '../../../modal/v2/participant/CancelRegistrationModal';
import '../../../../styles/scrollbar.css';
import EmptyRecommendation from '../EmptyRecommendation.jsx';

const RecommendationSidebar = ({ eventData = [] }) => {
    const { getParticipantRegisterStatus, getParticipantCount } =
        useEventStore();
    const { cancel_registration } = useEventParticipantStore();

    const [selectedEventData, setSelectedEventData] = React.useState(null);
    const [statusMap, setStatusMap] = React.useState({}); // { eventId: 'registered' | 'available' | 'loading' }
    const [participantCounts, setParticipantCounts] = React.useState({}); // { eventId: number }
    const [showRegistrationModal, setShowRegistrationModal] =
        React.useState(false);
    const [showUnregisterModal, setShowUnregisterModal] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    // Fetch registration status + participants for each event
    React.useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!eventData.length) return;

            const newStatusMap = {};
            const newCounts = {};

            for (const event of eventData) {
                try {
                    // registration status
                    const registered = await getParticipantRegisterStatus(
                        event.event_id
                    );
                    newStatusMap[event.event_id] = registered
                        ? 'registered'
                        : 'available';

                    // participant count
                    const response = await getParticipantCount(event.event_id);
                    if (response.success) {
                        newCounts[event.event_id] = response.count;
                    } else {
                        newCounts[event.event_id] = 0;
                    }
                } catch (err) {
                    console.error(
                        `Error fetching event ${event.event_id}:`,
                        err
                    );
                    newStatusMap[event.event_id] = 'available';
                    newCounts[event.event_id] = 0;
                }
            }

            if (isMounted) {
                setStatusMap(newStatusMap);
                setParticipantCounts(newCounts);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [eventData, getParticipantRegisterStatus, getParticipantCount]);

    const handleCardClick = (event) => {
        if (isProcessing) return;

        setSelectedEventData(event);
        const status = statusMap[event.event_id] || 'loading';

        if (status === 'registered') {
            setShowUnregisterModal(true);
        } else {
            setShowRegistrationModal(true);
        }
    };

    const handleRegistrationSuccess = async (eventId) => {
        // fetch updated status
        const registered = await getParticipantRegisterStatus(eventId);
        const response = await getParticipantCount(eventId);

        setStatusMap((prev) => ({
            ...prev,
            [eventId]: registered ? 'registered' : 'available',
        }));

        setParticipantCounts((prev) => ({
            ...prev,
            [eventId]: response.success ? response.count : 0,
        }));
    };

    const handleRegisterCancellation = async () => {
        if (!selectedEventData) return;
        setIsProcessing(true);
        try {
            await cancel_registration(selectedEventData.event_id);
            setShowUnregisterModal(false);
            setStatusMap((prev) => ({
                ...prev,
                [selectedEventData.event_id]: 'available',
            }));
        } catch (err) {
            console.error('Failed to unregister:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    // Smart date formatting
    const formatEventDate = (event) => {
        const start = dayjs(event.event_started);
        const end = dayjs(event.event_ended);
        const now = dayjs();

        if (start.isSame(now, 'day')) return 'Today';
        if (start.isSame(now.add(1, 'day'), 'day')) return 'Tomorrow';
        if (start.isSame(end, 'day')) return start.format('MMM D, YYYY');
        return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
    };

    const categories = React.useMemo(() => {
        const categoryCounts = new Map();

        categoryCounts.set('all', {
            category_id: 'all',
            name: 'All Events',
            count: eventData.length,
        });

        eventData.forEach((event) => {
            (event.Categories || []).forEach((cat) => {
                if (!categoryCounts.has(cat.category_id)) {
                    categoryCounts.set(cat.category_id, {
                        category_id: cat.category_id,
                        name: cat.name,
                        count: 0,
                    });
                }
                categoryCounts.get(cat.category_id).count += 1;
            });
        });

        return Array.from(categoryCounts.values());
    }, [eventData]);

    // Apply category filter
    const filteredEvents =
        selectedCategory === 'all'
            ? eventData
            : eventData.filter((event) =>
                  event.Categories?.some(
                      (cat) => cat.category_id === selectedCategory
                  )
              );

    return (
        <div className="flex bg-gray-50 pb-4 rounded-md h-auto lg:h-screen">
            <div className="w-full lg:w-96 bg-white shadow-2xl overflow-hidden flex flex-col h-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">
                            AI Recommendation
                        </h1>
                        <Filter className="w-5 h-5" />
                    </div>
                    <p className="text-blue-100 text-sm">
                        You might be interested to register and join
                    </p>
                </div>

                {filteredEvents.length > 0 ? (
                    <div>
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.category_id}
                                        onClick={() =>
                                            setSelectedCategory(
                                                category.category_id
                                            )
                                        }
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            selectedCategory ===
                                            category.category_id
                                                ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        {category.name} ({category.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col max-h-[70vh] lg:h-[32rem]">
                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                {filteredEvents.map((event, index) => {
                                    const status =
                                        statusMap[event.event_id] || 'loading';
                                    const isRegistered =
                                        status === 'registered';
                                    const isLoading =
                                        status === 'loading' || isProcessing;
                                    const participantCount =
                                        participantCounts[event.event_id] || 0;

                                    return (
                                        <div
                                            onClick={() =>
                                                handleCardClick(event)
                                            }
                                            key={event.event_id}
                                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                                            style={{
                                                animationDelay: `${
                                                    index * 100
                                                }ms`,
                                            }}>
                                            <div className="relative mb-3 overflow-hidden rounded-lg w-full">
                                                <img
                                                    src={event.event_image}
                                                    alt={event.title}
                                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {event.Categories?.[0] && (
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                                                        {
                                                            event.Categories[0]
                                                                .name
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-start">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {event.title}
                                                </h3>

                                                <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatEventDate(
                                                                event
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {dayjs(
                                                                event.event_started
                                                            ).format('h:mm A')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    participantCount
                                                                }
                                                                /
                                                                {
                                                                    event.max_participants
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <div>
                                                                {isLoading ? (
                                                                    <span className="text-gray-500">
                                                                        Loading...
                                                                    </span>
                                                                ) : isRegistered ? (
                                                                    <span className="text-red-500 font-medium">
                                                                        Tap to
                                                                        leave
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                                                                        Tap to
                                                                        join
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyRecommendation />
                )}
            </div>

            {/* Modals */}
            <EventRegistrationModal
                open={showRegistrationModal}
                setOpen={() => setShowRegistrationModal(false)}
                eventData={selectedEventData}
                onSuccess={handleRegistrationSuccess}
            />

            <CancelRegistrationModal
                isOpen={showUnregisterModal}
                setOpen={() => setShowUnregisterModal(false)}
                onConfirm={handleRegisterCancellation}
                eventData={selectedEventData}
                isProcessing={isProcessing}
            />
        </div>
    );
};

export default RecommendationSidebar;
