import React from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Shield, Users } from 'lucide-react';
import { useManageUsersStore } from '../../store/director/useManageUsersStore.js';
import Toggles from '../../components/common/Toggles.jsx';
import RequestList from '../../components/modal/RequestList.jsx';
import { useApprovalStore } from '../../store/director/useApprovalStore.js';

const ManageUsers = () => {
    const { listUsers, getAllUsers } = useManageUsersStore()
    const { getRequestList } = useApprovalStore()
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [showModalToggle, setShowModalToggle] = React.useState(false);
    const [showModalRequestList, setShowModalRequestList] = React.useState(false)
    const [modalPosition, setModalPosition] = React.useState({ x: 0, y: 0 });
    const [refreshFlag, setRefreshFlag] = React.useState(false)
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    React.useEffect(() => {
        let isMounted = true

        if(getAllUsers.length > 0 ) return

        const checkLatest = async () => {
            try {
                await getAllUsers()
            } catch (error) {
                if(isMounted) {
                    console.error("Fetch error:", error);
                }
            }
        }

        checkLatest()

        return () => {
            isMounted = false;
        };
    }, [getAllUsers, listUsers?.length])
    
    const transformedUsers = (listUsers || []).map(user => {
        // Get first and last name from details if available, otherwise kay gamiton ang email prefix
        let name = user.email.split('@')[0];
        if (user.details && user.details.firstname && user.details.lastname) {
            name = `${user.details.firstname} ${user.details.lastname}`;
        }
        
        // Get department if available
        let department = "No department";
        if (user.departments && user.departments.length > 0) {
            department = user.departments[0].department_name;
        }
        
        // Get phone number if available
        let phone = "No phone";
        if (user.details && user.details.phone_number) {
            phone = user.details.phone_number;
        }
        
        return {
            id: user.id,
            name: name,
            role: user.role.name,
            email: user.email,
            phone: phone,
            status: user.is_active ? "active" : "inactive",
            department: department
        };
    });


    const handleMoreClick = (event, user) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ x: rect.left, y: rect.bottom + window.scrollY });
        setSelectedUser(user);
        setShowModalToggle(true);
    };

    const handleAction = async() => {
        await getAllUsers()
        setShowModalToggle(false)
    }

    const handleRequestComplete = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([getRequestList(), getAllUsers()]);
        } catch (error) {
            console.error("Refresh error:", error);
        } finally {
            setIsRefreshing(false);
            setShowModalRequestList(false);
            setRefreshFlag(prev => !prev);
        }
    };


    return (
        <>
            <div className="p-6 h-screen bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                        <Filter className="w-5 h-5" />
                                        Filter
                                    </button>
                                    <button onClick={() => setShowModalRequestList(true)}
                                    disabled={isRefreshing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                        {
                                            isRefreshing ? (<span className='loading loading-spinner loading-xl'></span>): <Users className="w-5 h-5 text-white" />
                                        }
                                        Request
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200">
                                            <th className="pb-3 font-semibold text-gray-600">Name</th>
                                            <th className="pb-3 font-semibold text-gray-600">Role</th>
                                            <th className="pb-3 font-semibold text-gray-600">Contact</th>
                                            <th className="pb-3 font-semibold text-gray-600">Department</th>
                                            <th className="pb-3 font-semibold text-gray-600">Status</th>
                                            <th className="pb-3 font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transformedUsers.length > 0 ? (
                                            transformedUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-gray-100">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-600 font-medium">
                                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                                            user.role === 'Coordinator' || user.role === 'Event Coordinator' || user.role === 'Director'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail className="w-4 h-4" />
                                                                {user.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="w-4 h-4" />
                                                                {user.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-gray-600">{user.department}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                                            user.status === 'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                className="p-2 hover:bg-gray-100 rounded-lg">
                                                                <Shield className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                            <button onClick={(e) => handleMoreClick(e, user.id)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg">
                                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-4 text-center text-gray-500">
                                                    No users found
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
            <Toggles 
                open={showModalToggle} 
                setOpen={setShowModalToggle} 
                onComplete={handleAction}
                modalPosition={modalPosition}
                selectedUser={selectedUser}
            />

            <RequestList
            open={showModalRequestList}
            setOpen={setShowModalRequestList}
            flag={refreshFlag}
            onComplete={handleRequestComplete}
            />
        </>
    );
};

export default ManageUsers;