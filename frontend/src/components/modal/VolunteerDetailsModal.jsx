import React from 'react';
import { Phone, Building, Calendar, MapPin, X } from 'lucide-react';


const VolunteerDetailsModal = ({ selectedVolunteer, isOpen, setOpen }) => {


    const getStatusColor = (status) => {
        const colors = {
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            active: 'bg-blue-100 text-blue-800 border-blue-200',
            upcoming: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <img
                            src={selectedVolunteer.student.avatar}
                            alt={`${selectedVolunteer.student.firstname} ${selectedVolunteer.student.lastname}`}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedVolunteer.student.firstname}{' '}
                                {selectedVolunteer.student.lastname}
                            </h2>
                            <p className="text-gray-600">
                                {selectedVolunteer.student.department}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={setOpen}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Contact Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">
                                    {selectedVolunteer.student.phone_number}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Building className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-700">
                                    {selectedVolunteer.student.department}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Event Registrations */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                            Event Registrations (
                            {selectedVolunteer.eventRegistrations.length})
                        </h3>

                        {selectedVolunteer.eventRegistrations.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">
                                    No event registrations found
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedVolunteer.eventRegistrations.map(
                                    (registration) => (
                                        <div
                                            key={registration.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-semibold text-gray-900">
                                                    {registration.event.title}
                                                </h4>
                                                <div className="flex space-x-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            registration.status
                                                        )}`}>
                                                        {registration.status}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            registration.event.status
                                                        )}`}>
                                                        {
                                                            registration.event.status
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>
                                                        {
                                                            registration.event.location
                                                        }
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50 rounded p-3">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Event Schedule
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div>
                                                            <span className="font-medium">
                                                                Start:
                                                            </span>{' '}
                                                            {formatDate(
                                                                registration.event.event_started
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">
                                                                End:
                                                            </span>{' '}
                                                            {formatDate(registration.event.event_ended
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-gray-500 pt-2 border-t">
                                                    Registration ID:{' '}
                                                    {registration.id} | Event
                                                    ID: {registration.event.id}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDetailsModal;
