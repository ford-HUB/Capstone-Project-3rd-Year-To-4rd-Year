import React from 'react';
import dayjs from 'dayjs';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    ChevronRight,
    Filter,
    Navigation,
    Heart,
} from 'lucide-react';
import BeneficiaryEventRegistrationModal from '../../../modal/v2/beneficiary/BeneficiaryEventRegistrationModal';
import { useBeneficiaryEventStore } from '../../../../store/beneficiary/useBeneficiaryEventStore.js';
import BeneficiaryCancelRegistrationModal from '../../../modal/v2/beneficiary/BeneficiaryCancelRegistrationModal';
import '../../../../styles/scrollbar.css';
import BeneficiaryEmptyRecommendation from '../BeneficiaryEmptyRecommendation.jsx';

const BeneficiaryRecommendationSidebar = ({ 
    nearYouEvents = [], 
    almostNearYouEvents = [], 
    recommendations = [],
    beneficiaryLocation = '',
    beneficiaryCity = ''
}) => {
    const { registerForEvent, cancelRegistration } = useBeneficiaryEventStore();

    const [selectedEventData, setSelectedEventData] = React.useState(null);
    const [statusMap, setStatusMap] = React.useState({}); // { eventId: 'registered' | 'available' | 'loading' }
    const [participantCounts, setParticipantCounts] = React.useState({}); // { eventId: number }
    const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
    const [showUnregisterModal, setShowUnregisterModal] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    // Only show pure recommendations (not combined with near you events)
    const allEvents = React.useMemo(() => {
        return [
            ...recommendations.map(event => ({ ...event, category: 'recommendations' }))
        ];
    }, [recommendations]);

    // Fetch registration status + participants for each event
    React.useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!allEvents.length) return;

            const newStatusMap = {};
            const newCounts = {};

            for (const event of allEvents) {
                try {
                    // For now, assume all events are available (can be enhanced later)
                    newStatusMap[event.event_id] = 'available';
                    newCounts[event.event_id] = event.participants || 0;
                } catch (err) {
                    console.error(`Error fetching event ${event.event_id}:`, err);
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
    }, [allEvents]);

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
        setStatusMap((prev) => ({
            ...prev,
            [eventId]: 'registered',
        }));
        
        // Refresh matches to remove the registered event from recommendations
        // This will be handled by the parent component through the store
    };

    const handleRegisterCancellation = async () => {
        if (!selectedEventData) return;
        setIsProcessing(true);
        try {
            await cancelRegistration(selectedEventData.event_id);
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
            name: 'All Recommendations',
            count: allEvents.length,
        });

        categoryCounts.set('recommendations', {
            category_id: 'recommendations',
            name: 'Recommendations',
            count: recommendations.length,
        });

        return Array.from(categoryCounts.values());
    }, [allEvents, recommendations]);

    // Apply category filter
    const filteredEvents = selectedCategory === 'all' 
        ? allEvents 
        : allEvents.filter(event => event.category === selectedCategory);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'nearYou':
                return <MapPin className="w-4 h-4" />;
            case 'recommendations':
                return <Heart className="w-4 h-4" />;
            default:
                return <MapPin className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'nearYou':
                return 'text-green-600 bg-green-100';
            case 'recommendations':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="flex bg-gray-50 pb-4 rounded-md h-screen">
            <div className="w-96 bg-white shadow-2xl overflow-hidden flex flex-col h-full">
                <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-4 text-white shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">
                            Recommended Events
                        </h1>
                        <Filter className="w-5 h-5" />
                    </div>
                    <p className="text-green-100 text-sm">
                        AI-curated events for you: <strong>{beneficiaryCity}</strong>
                    </p>
                </div>

                {filteredEvents.length > 0 ? (
                    <div>
                        <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.category_id}
                                        onClick={() => setSelectedCategory(category.category_id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                                            selectedCategory === category.category_id
                                                ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        {category.name} ({category.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col h-[32rem]">
                            <div className="flex-1 overflow-scroll pb-12 scrollbar-hide">
                                {filteredEvents.map((event, index) => {
                                    const status = statusMap[event.event_id] || 'loading';
                                    const isRegistered = status === 'registered';
                                    const isLoading = status === 'loading' || isProcessing;
                                    const participantCount = participantCounts[event.event_id] || 0;

                                    return (
                                        <div
                                            onClick={() => handleCardClick(event)}
                                            key={event.event_id}
                                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                            }}>
                                            <div className="relative mb-3 overflow-hidden rounded-lg w-[20.5rem]">
                                                <img
                                                    src={event.event_image}
                                                    alt={event.title}
                                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/600x400?text=Event+Image';
                                                        e.target.className = 'w-full h-32 object-contain bg-gray-200 p-4';
                                                    }}
                                                />
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                                                        {event.Categories?.[0]?.name || 'Assistance'}
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                                                        {getCategoryIcon(event.category)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-start">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                                    {event.title}
                                                </h3>

                                                <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatEventDate(event)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {dayjs(event.event_started).format('h:mm A')}
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
                                                                {participantCount}/{event.max_participants}
                                                            </span>
                                                        </div>
                                                        {event.beneficiary_applicable && event.max_beneficiaries && (
                                                            <div className="flex items-center space-x-1">
                                                                <span className="text-blue-600 font-medium text-xs">
                                                                    {event.max_beneficiaries} beneficiary slots
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center space-x-1">
                                                            <div>
                                                                {isLoading ? (
                                                                    <span className="text-gray-500">
                                                                        Loading...
                                                                    </span>
                                                                ) : isRegistered ? (
                                                                    <span className="text-red-500 font-medium">
                                                                        Tap to leave
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                                                                        Tap to register
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <BeneficiaryEmptyRecommendation />
                )}
            </div>

            {/* Modals */}
            <BeneficiaryEventRegistrationModal
                open={showRegistrationModal}
                setOpen={() => setShowRegistrationModal(false)}
                eventData={selectedEventData}
                onSuccess={handleRegistrationSuccess}
            />

            <BeneficiaryCancelRegistrationModal
                isOpen={showUnregisterModal}
                setOpen={() => setShowUnregisterModal(false)}
                onConfirm={handleRegisterCancellation}
                eventData={selectedEventData}
                isProcessing={isProcessing}
            />
        </div>
    );
};

export default BeneficiaryRecommendationSidebar;
