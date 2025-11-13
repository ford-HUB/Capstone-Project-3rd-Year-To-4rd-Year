import React from 'react';
import { Search, MoreVertical, Eye, Calendar, MapPin, Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useBeneficiaryListStore } from '../../store/director/useBeneficiaryListStore.js';
import BeneficiaryDetailsModal from '../../components/modal/v2/director/BeneficiaryDetailsModal.jsx';

const BeneficiaryList = () => {
    const { 
        allRegistrations, 
        getAllRegistrations, 
        getRegistrationsByStatus,
        isLoading 
    } = useBeneficiaryListStore();

    const [selectedRegistration, setSelectedRegistration] = React.useState(null);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('registered');

    React.useEffect(() => {
        if (statusFilter === 'all') {
            getAllRegistrations();
        } else {
            getRegistrationsByStatus(statusFilter);
        }
    }, [getAllRegistrations, getRegistrationsByStatus, statusFilter]);

    const filteredRegistrations = allRegistrations.filter(registration => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            registration.beneficiary?.firstname?.toLowerCase().includes(searchLower) ||
            registration.beneficiary?.lastname?.toLowerCase().includes(searchLower) ||
            registration.event?.title?.toLowerCase().includes(searchLower) ||
            registration.event?.location?.toLowerCase().includes(searchLower)
        );
        
        const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;
        
        return matchesSearch && matchesStatus;
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            'registered': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            'declined': { bg: 'bg-red-100', text: 'text-red-800', label: 'Declined' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
        };
        
        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <span className={`px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'registered':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'declined':
                return <XCircle className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Calendar className="w-4 h-4 text-yellow-600" />;
            default:
                return <Calendar className="w-4 h-4 text-yellow-600" />;
        }
    };

    return (
        <>
            <div className="p-6 h-screen bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">Manage Beneficiary</h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        View approved beneficiary event registrations
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                        >
                                            <option value="registered">Approved</option>
                                            <option value="all">All Status</option>
                                            <option value="declined">Declined</option>
                                            <option value="pending">Pending Review</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search approved beneficiaries..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (statusFilter === 'all') {
                                                getAllRegistrations();
                                            } else {
                                                getRegistrationsByStatus(statusFilter);
                                            }
                                        }}
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
                                                                    {registration.beneficiary?.Account?.email}
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
                                                        <div className="flex items-center gap-2">
                                                            {getStatusIcon(registration.status)}
                                                            {getStatusBadge(registration.status)}
                                                        </div>
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
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users className="w-12 h-12 text-gray-300" />
                                                        <p className="text-lg font-medium">No approved registrations found</p>
                                                        <p className="text-sm">
                                                            {searchTerm || statusFilter !== 'registered' 
                                                                ? 'Try adjusting your search or filter criteria'
                                                                : 'No approved beneficiary registrations found'
                                                            }
                                                        </p>
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

            <BeneficiaryDetailsModal
                open={showDetailsModal}
                setOpen={setShowDetailsModal}
                registration={selectedRegistration}
            />
        </>
    );
};

export default BeneficiaryList;
