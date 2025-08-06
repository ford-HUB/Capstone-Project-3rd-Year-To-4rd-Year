import React from 'react';
import { Mail } from 'lucide-react';
import { useApprovalStore } from '../../store/director/useApprovalStore';
import ApprovalModal from './ApprovalModal';

const RequestList = ({ open, setOpen, flag, onComplete }) => {
    const { requestList, getRequestList, approve, deleteRequest } = useApprovalStore();
    const [isLoading, setLoading] = React.useState(false)

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
    
    const handleApproval = async (requestId, newStatus) => {
        setLoading(true);
        try {
            let success = false;
            
            switch (newStatus) {
                case 'confirm':
                    success = await approve(requestId)
                    break;
                case 'delete':
                    success = await deleteRequest(requestId)
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
                                    <th className="pb-3 font-semibold text-gray-600">Details</th>
                                    <th className="pb-3 font-semibold text-gray-600">Actions</th>
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
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 transition-all duration-300">
                                                    <button onClick={() => openModal(user.email, 'confirm', user.ra_id)}
                                                    disabled={isLoading}
                                                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                                                        Confirm
                                                    </button>
                                                    <button onClick={() => openModal(user.email, 'delete', user.ra_id)}
                                                    disabled={isLoading}
                                                    className="p-2 bg-gray-300 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-300">
                                                        Delete
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
        </div>
    );
};

export default RequestList;
