import React from 'react';
import { Eye, Calendar} from 'lucide-react';
import { useVolunteerStore } from '../../store/common/useVolunteerStore.js';
import VolunteerDetailsModal from '../../components/modal/VolunteerDetailsModal';

const VolunteerProfile = () => {
    const { volunteers, fetchVolunteers } = useVolunteerStore();
    const [selectedVolunteer, setSelectedVolunteer] = React.useState(null);
    const [showVolunteerDetailsModal, setShowVolunteerDetailsModal] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            const success = await fetchVolunteers();
            if (!success) return;
        }
        fetchData();
    }, [fetchVolunteers, volunteers.length]);

    const getOnlineStatus = (volunteer) => {
        return Math.random() > 0.5;
    };


    const getActiveEventCount = (volunteer) => {
        return volunteer.eventRegistrations.filter(reg => 
            reg.status === 'confirmed' && 
            (reg.event.status === 'active' || reg.event.status === 'upcoming')
        ).length;
    };

    return (
        <div className="mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Volunteers</h1>
                <p className="text-gray-600">{volunteers.length} volunteers registered</p>
            </div>

            <div className="space-y-0 border-gray-200 rounded-lg overflow-hidden">
                {volunteers.map((volunteer, index) => (
                    <div key={volunteer.id} className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== volunteers.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <img 
                                    src={volunteer.student.avatar} 
                                    alt={`${volunteer.student.firstname} ${volunteer.student.lastname}`}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                {getOnlineStatus(volunteer) && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {volunteer.student.firstname} {volunteer.student.lastname}
                                </h3>
                                <p className="text-sm text-gray-500">{volunteer.student.department}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-8">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {getActiveEventCount(volunteer)} Active Events
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getOnlineStatus(volunteer) ? 'Online' : 'Last seen 3h ago'}
                                </p>
                            </div>
                            
                            <button
                                onClick={() => { 
                                    setSelectedVolunteer(volunteer)
                                    setShowVolunteerDetailsModal(true)
                                 }}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {volunteers.length === 0 && (
                <div className="text-center h-screen py-12 border border-gray-100 rounded-lg">
                    <div className="text-gray-400 mb-4">
                        <Calendar className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
                    <p className="text-gray-500">Start by adding some volunteers to the system.</p>
                </div>
            )}
            
            <VolunteerDetailsModal
            isOpen={showVolunteerDetailsModal}
            setOpen={() => setShowVolunteerDetailsModal(false)}
            selectedVolunteer={selectedVolunteer}
            />
        </div>
    );
};

export default VolunteerProfile;