import React from 'react';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApprovalStore } from '../../store/director/useApprovalStore';
import Confirmation from './v2/confirmation-modal/Confirmation';

const RejectedRequestsModal = ({ open, setOpen, onComplete }) => {
    const { rejectedRequests, getRejectedRequests, acceptRejectedRequest } = useApprovalStore();
    const [isLoading, setLoading] = React.useState(false);

    // Confirmation modal state
    const [showConfirmationModal, setShowConfirmationModal] = React.useState({
        open: false,
        type: '',
        requestData: null,
        isLoading: false
    });

    const fetchData = React.useCallback(async () => {
        try {
            await getRejectedRequests();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [getRejectedRequests]);

    React.useEffect(() => {
        if (open) fetchData();
    }, [open, fetchData]);

    // Helper function to format role names for display
    const formatRoleName = (role) => {
        const roleMap = {
            'staff': 'Staff',
            'coordinator': 'Coordinator',
            'assistant_coordinator': 'Assistant Coordinator'
        };
        return roleMap[role] || role;
    };

    const handleAcceptAction = (request) => {
        console.log('Accept action - request data:', request);
        console.log('Accept action - ra_id:', request.ra_id);
        setShowConfirmationModal({ 
            open: true, 
            type: 'ACCEPT_REJECTED_REQUEST', 
            requestData: request, 
            isLoading: false 
        });
    };

    const handleAcceptOperation = async ({ action, userData }) => {
        setShowConfirmationModal(prev => ({ ...prev, isLoading: true }));
        
        // Get the ID from various possible field names
        const requestId = userData?.ra_id || userData?.id || userData?.requestId;
        console.log(`action ${action} and id ${requestId}`, userData);
        
        if (!requestId) {
            console.error('No valid ID found in request data:', userData);
            setShowConfirmationModal(prev => ({ ...prev, isLoading: false, open: false }));
            return;
        }
        
        let success = false;

        try {
            switch(action) {
                case 'ACCEPT_REJECTED_REQUEST':
                    success = await acceptRejectedRequest(requestId);
                    break;
                default:
                    console.log('action type is out of our scope');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowConfirmationModal(prev => ({ ...prev, isLoading: false, open: false }));
            if(success) {
                await fetchData();
                onComplete();
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 flex flex-col max-h-[90vh]">
                <header className="inline-flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h1 className="font-semibold text-xl">Rejected Requests</h1>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-500 hover:text-gray-800"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </header>

                <main className="w-full overflow-y-auto">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-semibold text-gray-600">Email</th>
                                    <th className="pb-3 font-semibold text-gray-600">Name</th>
                                    <th className="pb-3 font-semibold text-gray-600">Requested Role</th>
                                    <th className="pb-3 font-semibold text-gray-600">Rejection Reason</th>
                                    <th className="pb-3 font-semibold text-gray-600">Rejected At</th>
                                    <th className="pb-3 pl-19 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rejectedRequests?.length > 0 ? (
                                    rejectedRequests.map((request) => (
                                        <tr key={request.ra_id} className="border-b border-gray-100">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                                        <span className="text-red-600 font-medium">
                                                            {request.email[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{request.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    {request.fullname}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                    {formatRoleName(request.requested_role)}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 max-w-xs">
                                                    <p className="truncate" title={request.rejection_reason}>
                                                        {request.rejection_reason}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(request.updatedAt)}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex justify-end items-center gap-2 transition-all duration-300">
                                                    <button 
                                                        onClick={() => handleAcceptAction(request)}
                                                        disabled={isLoading}
                                                        className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-300 flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Accept
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="w-8 h-8 text-gray-400" />
                                                <p>No rejected requests found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            <Confirmation
                open={showConfirmationModal.open}
                setOpen={(isOpen) => setShowConfirmationModal((prev) => ({ ...prev, open: isOpen }))}
                type={showConfirmationModal.type}
                userData={showConfirmationModal.requestData}
                onConfirm={handleAcceptOperation}
            />
        </div>
    );
};

export default RejectedRequestsModal;
