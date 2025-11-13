import React from 'react';
import { Calendar, BookOpen, Timer, Play, MapPin, Users, Landmark, Clock, Check, X, Heart } from 'lucide-react';
import dayjs from 'dayjs';
import BeneficiaryEventRegistrationModal from '../../modal/v2/beneficiary/BeneficiaryEventRegistrationModal';
import { useBeneficiaryEventStore } from '../../../store/beneficiary/useBeneficiaryEventStore.js';
import BeneficiaryCancelRegistrationModal from '../../modal/v2/beneficiary/BeneficiaryCancelRegistrationModal.jsx';

const BeneficiaryEventCard = ({ eventData }) => {
    const { registerForEvent, cancelRegistration } = useBeneficiaryEventStore();
    const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
    const [showUnregisterModal, setShowUnregisterModal] = React.useState(false);


    const [registrationStatus, setRegistrationStatus] = React.useState('available');
    const [totalRegistered, setTotalRegistered] = React.useState(eventData?.participants || 0);
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleCardClick = () => {
        if (isProcessing || registrationStatus === 'loading') return;
        
        if (registrationStatus === 'registered') {
            setShowUnregisterModal(true);
        } else {
            setShowRegistrationModal(true);
        }
    };

    const handleRegisterCancellation = async () => {
        setIsProcessing(true);
        try {
            await cancelRegistration(eventData?.event_id);
            setShowUnregisterModal(false);
            setRegistrationStatus('available');
        } catch (err) {
            console.error('Failed to unregister:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const isRegistered = registrationStatus === 'registered';
    const isLoading = registrationStatus === 'loading' || isProcessing;

    // Smart date formatting
    const formatEventDate = () => {
        const start = dayjs(eventData?.event_started);
        const end = dayjs(eventData?.event_ended);
        const now = dayjs();
      
        if (start.isSame(now, 'day')) return 'Today';
        if (start.isSame(now.add(1, 'day'), 'day')) return 'Tomorrow';
      
        // Check if it's within the same week
        if (start.isSame(now, 'week')) {
          return start.format('dddd'); // e.g. "Friday"
        }
      
        // Check if it's next week
        if (start.isSame(now.add(1, 'week'), 'week')) {
          return 'Next week';
        }
      
        // Check if it's within the same month
        if (start.isSame(now, 'month')) {
          return start.format('MMM D'); // e.g. "Sep 14"
        }
      
        // Check if it's next month
        if (start.isSame(now.add(1, 'month'), 'month')) {
          return 'Next month';
        }
      
        // Fallback: show full date range
        if (start.isSame(end, 'day')) {
          return start.format('MMM D, YYYY');
        }
        return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
    };

    const getStatusIndicator = () => {
        switch (registrationStatus) {
            case 'registered':
                return (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium shadow-md">
                            <Check className="w-4 h-4" />
                            <span>Registered</span>
                        </div>
                    </div>
                );
            case 'loading':
                return (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-600 rounded-lg text-sm">
                            <Clock className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const getHoverAction = () => {
        if (isLoading) {
            return (
                <div className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                    <Clock className="w-5 h-5 animate-spin" />
                    <span className="text-base">Loading...</span>
                </div>
            );
        } else if (isRegistered) {
            return (
                <div className="flex items-center space-x-2 text-white bg-red-500/80 backdrop-blur-sm border border-red-400/30 rounded-xl px-4 py-3 hover:bg-red-500/90 transition-all duration-200">
                    <Heart className="w-5 h-5" />
                    <span className="text-base">Leave</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 hover:bg-white/30 transition-all duration-200">
                    <Play className="w-5 h-5" />
                    <span className="text-base">Join</span>
                </div>
            );
        }
    };

    // Early return if no event data
    if (!eventData) {
        return <div className="text-red-500 p-4 border border-red-300 rounded">No event data</div>;
    }


    return (
        <>
            
            <div 
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg hover:shadow-black/5 transition-all duration-300 w-full max-w-xl cursor-pointer transform hover:-translate-y-0.5"
                onClick={handleCardClick}
            >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-green-500/3 group-hover:via-emerald-500/3 group-hover:to-teal-500/3 transition-all duration-500 pointer-events-none z-10" />
                
                <div className="relative h-48 bg-gradient-to-br from-green-800 via-emerald-600 to-teal-500">
                    <div className="absolute inset-0 bg-black/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black bg-opacity-30"></div>
                    </div>

                    <div className="absolute inset-0">
                        <img
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            src={eventData?.event_image || 'https://via.placeholder.com/600x400?text=Event+Image'}
                            alt={`${eventData?.title || 'Event'}`}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x400?text=Event+Image';
                                e.target.className = 'w-full h-full object-contain bg-white bg-opacity-20 p-4';
                            }}
                        />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        {getHoverAction()}
                    </div>

                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 shadow-sm">
                            {eventData?.Categories?.[0]?.name || 'Assistance'}
                        </span>
                    </div>

                    {getStatusIndicator()}
                </div>

                <div className="relative p-6 group-hover:bg-gray-50/30 transition-colors duration-300">
                    {eventData?.Department && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                            <Landmark className="w-4 h-4 text-gray-400" />
                            <span className="truncate">
                                {eventData?.Departments?.[0]?.department_name}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center text-sm space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md group-hover:bg-gray-200 transition-colors">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-medium">
                                {eventData?.status || 'Unknown'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600 truncate">{eventData?.Organizer?.name || 'UCLMCARES'}</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-3 group-hover:text-gray-800 transition-colors line-clamp-2">
                        {eventData?.title || 'Untitled Event'}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {eventData.description && eventData.description.split(' ').length > 15
                            ? eventData.description
                                  .split(' ')
                                  .slice(0, 15)
                                  .join(' ') + '...'
                            : eventData.description || 'No description available'}
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                            <span className="text-sm truncate">{eventData?.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-600">
                                <Users className="w-4 h-4 mr-3 text-gray-400" />
                                <span className="text-sm">
                                    {totalRegistered} attending
                                </span>
                            </div>
                            {isRegistered && (
                                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                                    <Heart className="w-4 h-4 fill-current" />
                                    Registered
                                </span>
                            )}
                        </div>

                        {/* Beneficiary Capacity Information */}
                        {eventData?.beneficiary_applicable && eventData?.max_beneficiaries && (
                            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-blue-600 font-medium">
                                        Beneficiary Capacity
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {eventData.max_beneficiaries} max
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{formatEventDate()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-gray-400" />
                                <span>
                                    {`${dayjs(eventData?.event_started).format('h:mm A')}`}
                                </span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    {isLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                    ) : isRegistered ? (
                                        <span className="text-red-500 font-medium">Tap to leave</span>
                                    ) : (
                                        <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">Tap to register</span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-700" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-200" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BeneficiaryEventRegistrationModal
                open={showRegistrationModal}
                eventData={eventData}
                setOpen={setShowRegistrationModal}
                onSuccess={async (eventId) => {
                    console.log('Registration successful for event:', eventId);
                    setShowRegistrationModal(false);
                    setRegistrationStatus('registered');
                }}
            />

            <BeneficiaryCancelRegistrationModal
                isOpen={showUnregisterModal}
                setOpen={() => setShowUnregisterModal(false)}
                onConfirm={handleRegisterCancellation}
                eventData={eventData}
                isProcessing={isProcessing}
            />
        </>
    );
};

export default BeneficiaryEventCard;
