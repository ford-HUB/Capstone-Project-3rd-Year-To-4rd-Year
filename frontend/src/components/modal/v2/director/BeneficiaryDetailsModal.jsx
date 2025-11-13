import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText, Shield, Eye, Download } from 'lucide-react';

const BeneficiaryDetailsModal = ({ open, setOpen, registration }) => {
    if (!open || !registration) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Beneficiary Registration Details</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Complete information for {registration.beneficiary?.firstname} {registration.beneficiary?.lastname}
                        </p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">First Name</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                {registration.beneficiary?.firstname || 'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Last Name</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                {registration.beneficiary?.lastname || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Middle Initial</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.beneficiary?.middle_initial || 'Not provided'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Age</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                {registration.beneficiary?.age || 'Not provided'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Gender</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                {registration.beneficiary?.gender === 'M' ? 'Male' : 
                                                 registration.beneficiary?.gender === 'F' ? 'Female' : 
                                                 registration.beneficiary?.gender === 'O' ? 'Other' : 
                                                 registration.beneficiary?.gender || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Mail className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.beneficiary?.Account?.email || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Phone Number</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.beneficiary?.phone_number || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Current Address</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.beneficiary?.current_address || 'Not provided'}
                                        </p>
                                    </div>
                                    {registration.beneficiary?.organization_name && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Organization</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                {registration.beneficiary.organization_name}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Event Information */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Event Name</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.event?.title || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Event Date</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.event?.event_started ? formatDate(registration.event.event_started) : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Location</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {registration.event?.location || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                            {formatDateTime(registration.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Status</p>
                                        <div className="mt-2">
                                            {getStatusBadge(registration.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Needs Assessment */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Needs Assessment</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Current Situation</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm min-h-[80px]">
                                            {registration.current_situation || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Needs</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm min-h-[80px]">
                                            {registration.needs || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">How Can We Help</p>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm min-h-[80px]">
                                            {registration.how_can_we_help || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ID Verification */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="w-5 h-5 text-red-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">ID Verification</h3>
                                    {registration.id_verification_files && registration.id_verification_files.length > 0 && (
                                        <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                            {registration.id_verification_files.length} file(s) uploaded
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-3">Uploaded ID Photos - Click to view full size</p>
                                    {registration.id_verification_files && registration.id_verification_files.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {registration.id_verification_files.map((file, index) => (
                                                <div key={index} className="relative border border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors">
                                                    <div 
                                                        className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2 cursor-pointer hover:shadow-lg transition-shadow"
                                                        onClick={() => window.open(file.url, '_blank')}
                                                        title="Click to view full size"
                                                    >
                                                        <img
                                                            src={file.url}
                                                            alt={`ID Verification ${index + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-gray-600 truncate flex-1">
                                                            {file.filename}
                                                        </p>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => window.open(file.url, '_blank')}
                                                                className="p-1 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-700"
                                                                title="View Full Size"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {/* <button
                                                                onClick={() => {
                                                                    const link = document.createElement('a');
                                                                    link.href = file.url;
                                                                    link.download = file.filename;
                                                                    link.click();
                                                                }}
                                                                className="p-1 hover:bg-green-100 rounded text-green-600 hover:text-green-700"
                                                                title="Download"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                No ID verification files uploaded
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                This registration may need additional verification
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryDetailsModal;
