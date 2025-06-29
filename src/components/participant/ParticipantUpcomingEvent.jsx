import React from 'react';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import EventRegistrationModal from '../modal/EventRegistration';
import { useEvent } from '../../hooks/participant/useEvent.js';

const ParticipantUpcomingEvent = ({ events = [] }) => {
    const { register_event } = useEvent()
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [isRegisterModalShow, setRegisterModal] = React.useState(false);

    // Filter and sort upcoming events
    const upcomingEvents = React.useMemo(() => {
        if (!events || events.length === 0) return [];
        
        const now = new Date();
        return events
            .filter(event => {
                const startDate = new Date(event.event_started);
                return startDate > now;
            })
            .sort((a, b) => new Date(a.event_started) - new Date(b.event_started))
            .slice(0, 5);
    }, [events]);

    const getPriority = (participants, maxParticipants) => {
        const percentage = (participants / maxParticipants) * 100;
        if (percentage > 80) return 'high';
        if (percentage > 50) return 'medium';
        return 'low';
    };

    const handleRegister = async (formData) => {
        try {
            console.log('Registering for event:', selectedEvent.id, formData.thoughts);

            const success = await register_event(selectedEvent.id, { notes: formData.thoughts })
            if(!success) return
            setRegisterModal(false);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    if (upcomingEvents.length === 0) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                    <span className="text-gray-500 text-sm">No upcoming events</span>
                </div>
                <div className="text-center py-8 text-gray-500">
                    You don't have any upcoming events scheduled
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <span className="text-blue-600 text-sm font-medium">
                    {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="space-y-3">
                {upcomingEvents.map((event) => {
                    const priority = getPriority(event.participants, event.max_participants);
                    const primaryCategory = event.Categories?.[0]?.name || 'Event';
                    const eventDate = dayjs(event.event_started);
                    
                    return (
                        <div 
                            key={event.event_id} 
                            className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                        </h4>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            priority === 'high' 
                                                ? 'bg-red-100 text-red-700' 
                                                : priority === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-green-100 text-green-700'
                                        }`}>
                                            {primaryCategory}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{eventDate.format('MMM D')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{eventDate.format('h:mm A')}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>
                                                {event.participants}/{event.max_participants}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-color opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-200"
                                        onClick={() => {
                                            setSelectedEvent({
                                                id: event.event_id,
                                                title: event.title,
                                                date: eventDate.format('MMM D'),
                                                time: eventDate.format('h:mm A'),
                                                location: event.location || 'Main Campus Auditorium'
                                            });
                                            setRegisterModal(true);
                                        }}>
                                        Register Now
                                    </button>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {events.length > 5 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                        <Calendar className="w-4 h-4" />
                        View Full Event Calendar
                    </button>
                </div>
            )}

            <EventRegistrationModal
                isOpen={isRegisterModalShow}
                event={selectedEvent}
                onClose={() => setRegisterModal(false)}
                onRegister={handleRegister}
            />
        </div>
    );
};

export default ParticipantUpcomingEvent;