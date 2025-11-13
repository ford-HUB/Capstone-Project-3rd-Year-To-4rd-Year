import React from 'react';
import { Mail, CircleUser } from 'lucide-react';
import { useApprovalStore } from '../../store/director/useApprovalStore';
import ApprovalModal from './ApprovalModal';
import Confirmation from './v2/confirmation-modal/Confirmation';

const RequestList = ({ open, setOpen, flag, onComplete }) => {
    const { requestList, getRequestList, approve, rejectRequest } = useApprovalStore();
    const [isLoading, setLoading] = React.useState(false)

    // Helper function to format role names for display
    const formatRoleName = (role) => {
        const roleMap = {
            'staff': 'Staff',
            'coordinator': 'Coordinator',
            'assistant_coordinator': 'Assistant Coordinator'
        };
        return roleMap[role] || role;
    };

    const fetchData = React.useCallback(async () => {
        try {
            await getRequestList();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, [getRequestList]);

    React.useEffect(() => {
        if (open) fetchData()
    }, [open, flag, fetchData]);
    
      // Modal state
    const [modalState, setModalState] = React.useState({
        isOpen: false,
        email: '',
        action: null,
        requestId: null
    });

    // Confirmation modal state
    const [showConfirmationModal, setShowConfirmationModal] = React.useState({
        open: false,
        type: '',
        requestData: null,
        isLoading: false
    });
    
    const handleApproval = async (requestId, newStatus) => {
        setLoading(true);
        try {
            let success = false;
            
            switch (newStatus) {
                case 'confirm':
                    success = await approve(requestId)
                    break;
                default:
                    throw new Error('Invalid action')
            }

            if (!success) return

            await fetchData();
            onComplete();  // Notify parent
        } catch (error) {
            console.error("Approval error:", error);
        } finally {
            setLoading(false);
            setModalState({ isOpen: false, email: '', action: null, requestId: null });
        }
    };
    
    
    const openModal = (email, action, requestId) => {
        setModalState({
          isOpen: true,
          email: email,
          action: action,
          requestId: requestId
        });
    };

    const handleRejectAction = (request) => {
        console.log('Reject action - request data:', request);
        console.log('Reject action - ra_id:', request.ra_id);
        setShowConfirmationModal({ 
            open: true, 
            type: 'REJECT_REQUEST', 
            requestData: request, 
            isLoading: false 
        });
    };

    const handleRejectOperation = async ({ action, userData, reason }) => {
        setShowConfirmationModal(prev => ({ ...prev, isLoading: true }));
        
        // Get the ID from various possible field names
        const requestId = userData?.ra_id || userData?.id || userData?.requestId;
        console.log(`action ${action} and id ${requestId}`, userData, reason);
        
        if (!requestId) {
            console.error('No valid ID found in request data:', userData);
            setShowConfirmationModal(prev => ({ ...prev, isLoading: false, open: false }));
            return;
        }
        
        let success = false;

        try {
            switch(action) {
                case 'REJECT_REQUEST':
                    success = await rejectRequest(requestId, reason);
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

    if (!open) return null;


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 flex flex-col">
                <header className="inline-flex items-center justify-between mb-4">
                    <h1 className="font-semibold text-xl">Request Approval</h1>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-500 hover:text-gray-800"
                        disabled={isLoading}
                    >
                        Close
                    </button>
                </header>

                <main className="w-full">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-200">
                                    <th className="pb-3 font-semibold text-gray-600">Email</th>
                                    <th className="pb-3 font-semibold text-gray-600">Name</th>
                                    <th className="pb-3 font-semibold text-gray-600">Reason</th>
                                    <th className="pb-3 font-semibold text-gray-600">Requested</th>
                                    <th className="pb-3 pl-19 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requestList?.length > 0 ? (
                                    requestList.map((user) => (
                                        <tr key={user.ra_id} className="border-b border-gray-100">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">
                                                            {user.email[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    {user.fullname}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    {user.reason.split(' ').length > 4
                                                    ? user.reason.split(' ').slice(0, 4).join(' ') + '...'
                                                    : user.reason}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    {formatRoleName(user.requested_role)}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex justify-end items-center gap-2 transition-all duration-300">
                                                    <button onClick={() => openModal(user.email, 'confirm', user.ra_id)}
                                                    disabled={isLoading}
                                                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                                                        Confirm
                                                    </button>
                                                    <button onClick={() => handleRejectAction(user)}
                                                    disabled={isLoading}
                                                    className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-300">
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            <ApprovalModal
            isOpen={modalState.isOpen}
            onClose={() => setModalState({ isOpen: false, email: '', action: null, requestId: null })}
            onConfirm={() => handleApproval(modalState.requestId, modalState.action)}
            email={modalState.email}
            action={modalState.action}
        />

        <Confirmation
            open={showConfirmationModal.open}
            setOpen={(isOpen) => setShowConfirmationModal((prev) => ({ ...prev, open: isOpen }))}
            type={showConfirmationModal.type}
            userData={showConfirmationModal.requestData}
            onConfirm={handleRejectOperation}
        />
        </div>
    );
};

export default RequestList;
