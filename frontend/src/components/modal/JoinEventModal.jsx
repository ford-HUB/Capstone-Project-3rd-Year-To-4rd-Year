import React from 'react';
import {
    X,
    MapPin,
    Trash2,
    Users,
    Calendar,
    Clock,
    Building,
    Mail,
    Download,
    Shield,
    Search,
    FileCheck,
} from 'lucide-react';
import EventRegistrationModal from './EventRegistrationModal';
import { useAuthStore as useAuthManagamentStore } from '../../store/management/useAuthStore.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { useEventStore } from '../../store/event/useEventStore';
import { useEventStore as useEventManagementStore } from '../../store/management/useEventStore.js';
import { useEventStore as useEventDirectorStore } from '../../store/director/useEventStore.js';
import CancelModal from './CancelModal.jsx';
import RemoveParticipantModal from './RemoveParticipantModal.jsx';

const JoinEventModal = ({ event, onClose }) => {
    const { authenticatedManagement } = useAuthManagamentStore()
    const { authenticatedDirector } = useAuthDirectorStore()

    const {
        getListParticipants,
        listParticipants,
        getParticipantRegisterStatus,
        isRegistered,
        removeEventRegistration,
    } = useEventStore();
    const { registerManagementEvent, unRegisterEventManagement } =
        useEventManagementStore();
    const { registerEventDirector, unRegisterEventDirector } =
        useEventDirectorStore();

    const [showEventRegistrationModal, setShowEventRegistrationModal] =
        React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showCancelRegistrationModal, setShowCancelRegistrationModal] =
        React.useState({
            isOpen: false,
            title: '',
            action: null,
            event_id: null,
        });
    const [showRemoveParticipantModal, setShowRemoveParticipantModal] =
        React.useState({
            isOpen: false,
            registrationId: null,
            participantName: '',
            eventTitle: '',
        });
    const [isRemoving, setIsRemoving] = React.useState(false);

    // fetch participants
    React.useEffect(() => {
        let isMounted = true;
        const fetchParticipants = async () => {
            setLoading(true);
            try {
                await getListParticipants(event?.id);
            } catch (err) {
                console.error('Failed to fetch participants:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchParticipants();
        return () => {
            isMounted = false;
        };
    }, [event?.id, getListParticipants]);

    React.useEffect(() => {
        let isMounted = true;
        const fetchStatus = async () => {
            try {
                await getParticipantRegisterStatus(event?.id);
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to fetch status:', err);
                }
            }
        };
        fetchStatus();
        return () => {
            isMounted = false;
        };
    }, [event?.id, getParticipantRegisterStatus]);

    const handleEventRegistration = async ({ role, event_id }) => {
        let success;
        switch (role) {
            case 'director':
                success = await registerEventDirector(event_id);
                break;
            case 'staff':
            case 'coordinator':
            case 'assistant_coordinator':
                success = await registerManagementEvent(event_id);
                break;
            default:
                console.log('role is out of our scope');
                return;
        }
        if (!success) return;
        setShowEventRegistrationModal(false);
        await getParticipantRegisterStatus(event_id);
        await getListParticipants(event_id);
    };

    // handle cancellation
    const handleCancellation = async ({ role, event_id }) => {
        let success;
        switch (role) {
            case 'director':
                success = await unRegisterEventDirector(event_id);
                break;
            case 'staff':
            case 'coordinator':
            case 'assistant_coordinator':
                success = await unRegisterEventManagement(event_id);
                break;
            default:
                console.log('role type is out of our scope');
                return;
        }
        if (!success) return;
        await getParticipantRegisterStatus(event_id);
        await getListParticipants(event_id);
        setShowCancelRegistrationModal((prev) => ({ ...prev, isOpen: false }));
    };

    const handleRemoveParticipant = async (reason) => {
        setIsRemoving(true);
        try {
            const success = await removeEventRegistration(showRemoveParticipantModal.registrationId, reason);
            if (success) {
                // Refresh the participants list after successful removal
                await getListParticipants(event?.id);
                setShowRemoveParticipantModal({
                    isOpen: false,
                    registrationId: null,
                    participantName: '',
                    eventTitle: '',
                });
            }
        } finally {
            setIsRemoving(false);
        }
    };

    const openRemoveParticipantModal = (registration_id, participantName) => {
        setShowRemoveParticipantModal({
            isOpen: true,
            registrationId: registration_id,
            participantName: participantName,
            eventTitle: event.title,
        });
    };

    const filteredParticipants = listParticipants.filter(({ participant }) => {
        const first = participant?.details?.firstname || '';
        const last = participant?.details?.lastname || '';
        return `${first} ${last}`.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'director':
                return 'bg-purple-100 text-purple-800';
            case 'staff':
                return 'bg-blue-100 text-blue-800';
            case 'coordinator':
                return 'bg-green-100 text-green-800';
            case 'assistant_coordinator':
                return 'bg-emerald-100 text-emerald-800';
            case 'volunteer':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            {/* Modal  */}
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] shadow-xl animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Building className="w-4 h-4" /> Event Board
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {event.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> {event.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {event.startTime} - {event.endTime}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {event.location}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Event Info */}
                    <div className="p-6 border-b border-gray-200">
                        <p className="text-gray-700 text-sm mb-4">{event.description}</p>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        {listParticipants?.length}/{event.maxParticipants}
                                    </span>
                                    <span className="text-gray-600 text-sm">Registered</span>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                    Registration Open
                                </span>
                            </div>
                            {isRegistered ? (
                                <button
                                    onClick={() =>
                                        setShowCancelRegistrationModal({
                                            isOpen: true,
                                            title: event.title,
                                            action: 'yes',
                                            event_id: event?.id,
                                        })
                                    }
                                    className="inline-flex items-center text-green-800 justify-between btn rounded-2xl text-gray-900">
                                    <FileCheck className="w-5 h-5" /> Cancel Registration
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowEventRegistrationModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    <Shield className="w-4 h-4" /> Join Event
                                </button>
                            )}
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(listParticipants.length / event.maxParticipants) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Participants List */}
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-900">
                                Registered Participants ({filteredParticipants?.length})
                            </h3>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search participants..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-48"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredParticipants?.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">
                                        {searchTerm
                                            ? 'No participants match your search'
                                            : 'No participants registered yet'}
                                    </p>
                                </div>
                            ) : (
                                filteredParticipants.map(({ registration, participant }) => (
                                    <div
                                        key={registration.event_registration_id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                                alt={participant?.details?.firstname}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {participant?.details?.firstname} {participant?.details?.lastname}
                                                    </p>
                                                    <span
                                                        className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                                                            registration.participant_type
                                                        )}`}>
                                                        {registration.participant_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                                    {participant?.details?.email && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {participant.details.email}
                                                        </div>
                                                    )}
                                                    {participant?.academic_info?.department && (
                                                        <div className="flex items-center gap-1">
                                                            <Building className="w-3 h-3" />{' '}
                                                            {participant.academic_info.department}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            (authenticatedDirector?.Role.name === 'director' || authenticatedManagement?.Role.name === 'staff' || authenticatedManagement?.Role.name === 'coordinator') 
                                            && (
                                                <button
                                                    onClick={() => openRemoveParticipantModal(
                                                        registration.event_registration_id,
                                                        `${participant?.details?.firstname} ${participant?.details?.lastname}`
                                                    )}
                                                    className="p-2 text-gray-800 hover:text-red-600 rounded-lg hover:bg-red-50 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )
                                        }
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Organizer:</span> {event.organizer}
                            </div>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EventRegistrationModal
                isOpen={showEventRegistrationModal}
                onClose={() => setShowEventRegistrationModal(false)}
                event={event}
                onRegister={handleEventRegistration}
            />
            <CancelModal
                isOpen={showCancelRegistrationModal.isOpen}
                onClose={() =>
                    setShowCancelRegistrationModal({
                        isOpen: false,
                        title: '',
                        action: null,
                        event_id: null,
                    })
                }
                title={showCancelRegistrationModal.title}
                event_id={showCancelRegistrationModal.event_id}
                action={showCancelRegistrationModal.action}
                onConfirm={handleCancellation}
            />
            <RemoveParticipantModal
                isOpen={showRemoveParticipantModal.isOpen}
                onClose={() =>
                    setShowRemoveParticipantModal({
                        isOpen: false,
                        registrationId: null,
                        participantName: '',
                        eventTitle: '',
                    })
                }
                onConfirm={handleRemoveParticipant}
                participantName={showRemoveParticipantModal.participantName}
                eventTitle={showRemoveParticipantModal.eventTitle}
                loading={isRemoving}
            />
        </>
    );
};

export default JoinEventModal;
