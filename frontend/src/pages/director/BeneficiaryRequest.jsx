import React from 'react';
import { Search, MoreVertical, Eye, CheckCircle, XCircle, Calendar, MapPin, Users, Shield } from 'lucide-react';
import { useBeneficiaryRequestStore } from '../../store/director/useBeneficiaryRequestStore.js';
import BeneficiaryActionsToggle from '../../components/common/BeneficiaryActionsToggle.jsx';
import BeneficiaryDetailsModal from '../../components/modal/v2/director/BeneficiaryDetailsModal.jsx';
import ApproveConfirmationModal from '../../components/modal/v2/director/ApproveConfirmationModal.jsx';
import DeclineConfirmationModal from '../../components/modal/v2/director/DeclineConfirmationModal.jsx';

const BeneficiaryRequest = () => {
    const { 
        pendingRegistrations, 
        getAllPendingRegistrations, 
        approveRegistration, 
        declineRegistration,
        isLoading 
    } = useBeneficiaryRequestStore();

    const [selectedRegistration, setSelectedRegistration] = React.useState(null);
    const [showActionsToggle, setShowActionsToggle] = React.useState(false);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [showApproveModal, setShowApproveModal] = React.useState(false);
    const [showDeclineModal, setShowDeclineModal] = React.useState(false);
    const [modalPosition, setModalPosition] = React.useState({ x: 0, y: 0 });
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        getAllPendingRegistrations();
    }, [getAllPendingRegistrations]);

    const handleMoreClick = (event, registration) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ x: rect.left, y: rect.bottom + window.scrollY });
        setSelectedRegistration(registration);
        setShowActionsToggle(true);
    };

    const handleAction = async ({ action, registration, reason }) => {
        switch(action) {
            case 'view':
                setShowDetailsModal(true);
                setShowActionsToggle(false);
                break;
            case 'approve':
                setShowApproveModal(true);
                setShowActionsToggle(false);
                break;
            case 'decline':
                setShowDeclineModal(true);
                setShowActionsToggle(false);
                break;
            default:
                console.log('No matching action found');
        }
    };

    const handleApproveConfirm = async (registration) => {
        await approveRegistration(registration.event_registration_id);
        setShowApproveModal(false);
    };

    const handleDeclineConfirm = async (registration, reason) => {
        await declineRegistration(registration.event_registration_id, reason);
        setShowDeclineModal(false);
    };

    const filteredRegistrations = pendingRegistrations.filter(registration => {
        const searchLower = searchTerm.toLowerCase();
        return (
            registration.beneficiary?.firstname?.toLowerCase().includes(searchLower) ||
            registration.beneficiary?.lastname?.toLowerCase().includes(searchLower) ||
            registration.event?.title?.toLowerCase().includes(searchLower) ||
            registration.event?.location?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="p-6 h-screen bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Beneficiary Requests</h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Review and approve pending beneficiary event registrations
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search requests..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                    <button 
                                        onClick={() => getAllPendingRegistrations()}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
                                        {isLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            <span>Refresh</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200">
                                            <th className="pb-3 font-semibold text-gray-600">Beneficiary</th>
                                            <th className="pb-3 font-semibold text-gray-600">Event</th>
                                            <th className="pb-3 font-semibold text-gray-600">Registration Date</th>
                                            <th className="pb-3 font-semibold text-gray-600">ID Verification</th>
                                            <th className="pb-3 font-semibold text-gray-600">Status</th>
                                            <th className="pb-3 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegistrations.length > 0 ? (
                                            filteredRegistrations.map((registration) => (
                                                <tr key={registration.event_registration_id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-blue-600 font-medium text-sm">
                                                                    {registration.beneficiary?.firstname?.[0]}{registration.beneficiary?.lastname?.[0]}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {registration.beneficiary?.firstname} {registration.beneficiary?.lastname}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {registration.beneficiary?.account?.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {registration.event?.title}
                                                            </p>
                                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {formatDate(registration.event?.event_started)}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <MapPin className="w-4 h-4" />
                                                                {registration.event?.location}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-600">
                                                        {formatDateTime(registration.createdAt)}
                                                    </td>
                                                    <td className="py-4">
                                                        {registration.id_verification_files && registration.id_verification_files.length > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-4 h-4 text-green-600" />
                                                                <span className="text-sm text-green-700 font-medium">
                                                                    {registration.id_verification_files.length} file(s)
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Shield className="w-4 h-4 text-red-600" />
                                                                <span className="text-sm text-red-700 font-medium">
                                                                    No files
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                                            registration.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {registration.status === 'pending' ? 'Pending Review' : registration.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedRegistration(registration);
                                                                    setShowDetailsModal(true);
                                                                }}
                                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                                                title="View Details">
                                                                <Eye className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleMoreClick(e, registration)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                                                title="More Actions">
                                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users className="w-12 h-12 text-gray-300" />
                                                        <p className="text-lg font-medium">No pending requests</p>
                                                        <p className="text-sm">All beneficiary registrations have been reviewed</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BeneficiaryActionsToggle
                open={showActionsToggle}
                setOpen={setShowActionsToggle}
                onComplete={handleAction}
                modalPosition={modalPosition}
                selectedRegistration={selectedRegistration}
            />

            <BeneficiaryDetailsModal
                open={showDetailsModal}
                setOpen={setShowDetailsModal}
                registration={selectedRegistration}
            />

            <ApproveConfirmationModal
                open={showApproveModal}
                setOpen={setShowApproveModal}
                registration={selectedRegistration}
                onConfirm={handleApproveConfirm}
            />

            <DeclineConfirmationModal
                open={showDeclineModal}
                setOpen={setShowDeclineModal}
                registration={selectedRegistration}
                onConfirm={handleDeclineConfirm}
            />
        </>
    );
};

export default BeneficiaryRequest;
