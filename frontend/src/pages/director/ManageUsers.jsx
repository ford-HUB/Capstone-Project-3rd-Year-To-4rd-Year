import React from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, Shield, Users, UserRoundX, ChevronDown, UserPlus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserCheck } from 'lucide-react';
import { useManageUsersStore } from '../../store/director/useManageUsersStore.js';
import Toggles from '../../components/common/Toggles.jsx';
import RequestList from '../../components/modal/RequestList.jsx';
import { useApprovalStore } from '../../store/director/useApprovalStore.js';
import Confirmation from '../../components/modal/v2/confirmation-modal/Confirmation.jsx';
import UserInfoModal from '../../components/modal/UserInfoModal.jsx';
import RejectedRequestsModal from '../../components/modal/RejectedRequestsModal.jsx';
import { initSocket, isSocketConnected } from '../../api/socket.js';

const ManageUsers = () => {
    const { 
        listUsers, 
        getAllUsers, 
        softDeleteUser, 
        deactivateUser, 
        restoreUser, 
        getTrashUsers, 
        trashUsers, 
        restoreSoftDeleted,
        initializeActivityTracking,
        stopActivityTracking,
        getUserActivityStatus,
        getAllActiveUsers,
        getActiveUsersCount,
        updateUserActivity,
        refreshUserList
    } = useManageUsersStore()
    const { getRequestList } = useApprovalStore()

    const [selectedUser, setSelectedUser] = React.useState(null);
    const [showModalToggle, setShowModalToggle] = React.useState(false);
    const [showModalRequestList, setShowModalRequestList] = React.useState(false)
    const [showRejectedRequestsModal, setShowRejectedRequestsModal] = React.useState(false)

    const [modalPosition, setModalPosition] = React.useState({ x: 0, y: 0 });
    const [refreshFlag, setRefreshFlag] = React.useState(false)
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const [showConfirmationModal, setShowConfirmationModal] = React.useState({
        open: false,
        type: '',
        userData: null,
        isLoading: false
    })

    const [showUserInfoModal, setShowUserInfoModal] = React.useState({
        open: false,
        userData: null
    })

    const [showDeactivatedOnly, setShowDeactivatedOnly] = React.useState(false)
    const [showTrash, setShowTrash] = React.useState(false)
    const [activityCallback, setActivityCallback] = React.useState(null)
    const [activeUsersCount, setActiveUsersCount] = React.useState(0)
    
    // New state for improved UI
    const [searchTerm, setSearchTerm] = React.useState('')
    const [roleFilter, setRoleFilter] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState('')
    const [dateFilter, setDateFilter] = React.useState('')
    const [currentPage, setCurrentPage] = React.useState(1)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.filter-dropdown')) {
                setRoleFilter('');
                setStatusFilter('');
                setDateFilter('');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    React.useEffect(() => {
        let isMounted = true


        const checkLatest = async () => {
            try {
                // Initialize socket first
                initSocket();
                
                if (showTrash) {
                    await getTrashUsers()
                } else {
                    await getAllUsers()
                }
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
    }, [showTrash]) // Removed function dependencies and length checks to prevent infinite loops

    React.useEffect(() => {
        const initializeSocketAndTracking = async () => {
            try {
                initSocket();
                
                let attempts = 0;
                while (!isSocketConnected() && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    attempts++;
                }
                
                if (isSocketConnected()) {
                    const callback = initializeActivityTracking();
                    setActivityCallback(callback);
                } else {
                    setTimeout(() => {
                        const callback = initializeActivityTracking();
                        setActivityCallback(callback);
                    }, 2000);
                }
            } catch (error) {
                const callback = initializeActivityTracking();
                setActivityCallback(callback);
            }
        };

        initializeSocketAndTracking();

        return () => {
            if (activityCallback) {
                stopActivityTracking(activityCallback);
            }
        };
    }, []) // Run only once on mount - Zustand functions are stable

    React.useEffect(() => {
        const updateActiveCount = async () => {
            try {
                const count = await getActiveUsersCount();
                setActiveUsersCount(count);
            } catch (error) {
                // Silent fail
            }
        };

        updateActiveCount();
        const interval = setInterval(updateActiveCount, 30000);

        return () => clearInterval(interval);
    }, []) // Run once on mount, then interval handles updates

    React.useEffect(() => {
        const refreshInterval = setInterval(async () => {
            try {
                await refreshUserList();
            } catch (error) {
                // Silent fail
            }
        }, 60000);

        return () => clearInterval(refreshInterval);
    }, []) // Run once on mount, interval handles periodic refresh

    React.useEffect(() => {
        const updateActivity = async () => {
            try {
                await updateUserActivity();
            } catch (error) {
                // Silent fail
            }
        };

        const activityInterval = setInterval(updateActivity, 60000);

        return () => clearInterval(activityInterval);
    }, []) // Run once on mount, interval handles periodic updates
    
    const filteredUsers = (listUsers || [])
        .map(user => {
            let name = user.email.split('@')[0];
            if (user.details && user.details.firstname && user.details.lastname) {
                const middleInitial = user.details.middle_initial ? `${user.details.middle_initial}. ` : '';
                name = `${user.details.firstname} ${middleInitial}${user.details.lastname}`;
            } else if (user.details && user.details.fullname) {
                name = user.details.fullname;
            }
            
            let department = "";
            if (user.departments) {
                    department = user.departments[0]?.department_name || "";
            }
            if (!department && user.type === 'beneficiary' && user.details?.organization_name) {
                department = user.details.organization_name;
            }
            
            let phone = "No phone";
            if (user.details && user.details.phone_number) {
                phone = user.details.phone_number;
            }
            
            const activityStatus = getUserActivityStatus(user.id);
            
            const transformedUser = {
                id: user.id,
                name: name,
                role: user.role.name ? user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1) : user.role.name,
                email: user.email,
                phone: phone,
                status: user.status,
                department: department,
                type: user.type,
                details: user.details,
                activityStatus: user.isOnline ? 'online' : activityStatus.status,
                lastActivity: user.activeAt || activityStatus.timestamp,
                createdAt: user.createdAt || user.created_at,
                updatedAt: user.updatedAt || user.updated_at,
                activeAt: user.activeAt,
                isOnline: user.isOnline || false
            };
            
            return transformedUser;
        })
        .filter(user => {
            if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
                !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            
            if (roleFilter && roleFilter !== 'show' && user.role !== roleFilter) {
                return false;
            }
            
            if (statusFilter && statusFilter !== 'show' && user.status !== statusFilter) {
                return false;
            }
            
            if (dateFilter && dateFilter !== 'show' && user.createdAt) {
                const userDate = new Date(user.createdAt);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                switch (dateFilter) {
                    case 'today':
                        if (userDate < today) return false;
                        break;
                    case 'week':
                        const startOfWeek = new Date(today);
                        const dayOfWeek = today.getDay();
                        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                        startOfWeek.setDate(today.getDate() + daysToMonday);
                        startOfWeek.setHours(0, 0, 0, 0);
                        
                        if (userDate < startOfWeek) return false;
                        break;
                    case 'month':
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        startOfMonth.setHours(0, 0, 0, 0);
                        
                        if (userDate < startOfMonth) return false;
                        break;
                    case 'year':
                        const startOfYear = new Date(now.getFullYear(), 0, 1);
                        startOfYear.setHours(0, 0, 0, 0);
                        
                        if (userDate < startOfYear) return false;
                        break;
                }
            }
            
            if (showDeactivatedOnly && user.status !== 'deactivated') {
                return false;
            }
            
            return true;
        })
        .sort((a, b) => {
            const aIsActive = a.status === 'active' || a.isOnline;
            const bIsActive = b.status === 'active' || b.isOnline;
            
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;
            
            return a.id - b.id;
        });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const transformedTrashUsers = (trashUsers || []).map(user => {
        const name = user?.role?.name ? user.email.split('@')[0] : user.email.split('@')[0]
        const deletedAt = user.deletedAt ? new Date(user.deletedAt) : null
        const now = new Date()
        const diffMs = deletedAt ? now - deletedAt : 0
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const daysLeft = 90 - diffDays
        return {
            id: user.account_id,
            name: name,
            role: user?.Role?.name || user?.role?.name || 'User',
            email: user.email,
            deletedAt: deletedAt,
            daysLeft: daysLeft,
        }
    })


    const handleMoreClick = (event, user) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ x: rect.left, y: rect.bottom + window.scrollY });
        setSelectedUser(user);
        setShowModalToggle(true);
    };

    const handleAction = async({ action, selectedUser }) => {
        switch(action) {
            case 'delete':
                setShowConfirmationModal({ open: true,  type: 'SOFT_DELETE', userData: selectedUser, isLoading: false })
                break
            case 'deactivate':
                setShowConfirmationModal({ open: true, type: 'DEACTIVATE_ACCOUNT', userData: selectedUser, isLoading: false })
                break
            case 'restore':
                setShowConfirmationModal({ open: true, type: 'RESTORE_ACCOUNT', userData: selectedUser, isLoading: false })
                break
            case 'view':
                setShowUserInfoModal({ open: true, userData: selectedUser })
                break
            default:
                break
        }
    }

    const handleToggleOperation = async ({ action, userData, reason }) => {
        setShowConfirmationModal(prev => ({ ...prev, isLoading: true }));
        let success = false;
    
        try {
            switch(action) {
                case 'SOFT_DELETE':
                    success = await softDeleteUser(userData.id, reason);
                    break;
                case 'DEACTIVATE_ACCOUNT':
                    success = await deactivateUser(userData.id, reason);
                    break;
                case 'RESTORE_ACCOUNT':
                    if (showTrash) {
                        success = await restoreSoftDeleted(userData.id);
                    } else {
                        success = await restoreUser(userData.id);
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setShowConfirmationModal(prev => ({ ...prev, isLoading: false, open: false }));
            if(success) {
                if (showTrash) {
                    await getTrashUsers()
                } else {
                    await getAllUsers()
                }
            }
        }
    };
    

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

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (rows) => {
        setRowsPerPage(rows);
        setCurrentPage(1);
    };

    // Get unique roles and statuses for filters
    const uniqueRoles = [...new Set(filteredUsers.map(user => user.role))];
    const uniqueStatuses = [...new Set(filteredUsers.map(user => user.status))];


    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="p-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Title and Stats */}
                            <div className="flex items-center gap-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {filteredUsers.length} of {listUsers?.length || 0} users
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 px-3 py-1.5 rounded-full">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>{activeUsersCount} online</span>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 mt-6">
                            {/* Search Bar */}
                            <div className="flex-1 relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-3">
                                {/* Role Filter */}
                                <div className="relative filter-dropdown">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setRoleFilter(roleFilter === 'show' ? '' : 'show');
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Users className="w-4 h-4" />
                                        {roleFilter && roleFilter !== 'show' ? roleFilter : 'Role'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {roleFilter === 'show' && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <div className="p-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRoleFilter('');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    All Roles
                                                </button>
                                                {uniqueRoles.map(role => (
                                                    <button
                                                        key={role}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRoleFilter(role);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                        {role}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Filter */}
                                <div className="relative filter-dropdown">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStatusFilter(statusFilter === 'show' ? '' : 'show');
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Shield className="w-4 h-4" />
                                        {statusFilter && statusFilter !== 'show' ? statusFilter : 'Status'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {statusFilter === 'show' && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <div className="p-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setStatusFilter('');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    All Status
                                                </button>
                                                {uniqueStatuses.map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setStatusFilter(status);
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Date Filter */}
                                <div className="relative filter-dropdown">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDateFilter(dateFilter === 'show' ? '' : 'show');
                                        }}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Filter className="w-4 h-4" />
                                        {dateFilter && dateFilter !== 'show' ? dateFilter : 'Date'}
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    {dateFilter === 'show' && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <div className="p-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDateFilter('');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    All Dates
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDateFilter('today');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    Today
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDateFilter('week');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    This Week
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDateFilter('month');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    This Month
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDateFilter('year');
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
                                                    This Year
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Special Filters */}
                                <button 
                                    onClick={() => setShowDeactivatedOnly(!showDeactivatedOnly)}
                                    className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                                        showDeactivatedOnly 
                                            ? 'bg-orange-100 border-orange-300 text-orange-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}>
                                    <UserRoundX className="w-4 h-4" />
                                    Deactivated
                                </button>

                                <button 
                                    onClick={() => setShowModalRequestList(true)}
                                    disabled={isRefreshing}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    {isRefreshing ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <Users className="w-4 h-4" />
                                    )}
                                        Request
                                    </button>

                                <button 
                                    onClick={() => setShowRejectedRequestsModal(true)}
                                    disabled={isRefreshing}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    <UserRoundX className="w-4 h-4" />
                                        Rejected
                                    </button>

                                <button 
                                    onClick={() => setShowTrash(prev => !prev)}
                                    className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                                        showTrash 
                                            ? 'bg-red-100 border-red-300 text-red-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}>
                                    <Trash2 className="w-4 h-4" />
                                    Trash
                                </button>
                            </div>
                        </div>
                            </div>

                    {/* Main Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                                        {!showTrash && <th className="px-6 py-4 text-left font-semibold">Email</th>}
                                        {!showTrash && <th className="px-6 py-4 text-left font-semibold">Status</th>}
                                        {!showTrash && <th className="px-6 py-4 text-left font-semibold">Role</th>}
                                        {!showTrash && <th className="px-6 py-4 text-left font-semibold">Joined Date</th>}
                                        {!showTrash && <th className="px-6 py-4 text-left font-semibold">Last Active</th>}
                                        {showTrash && <th className="px-6 py-4 text-left font-semibold">Deleted At</th>}
                                        {showTrash && <th className="px-6 py-4 text-left font-semibold">Days Left</th>}
                                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {!showTrash && paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user, index) => (
                                            <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                                <span className="text-white font-medium text-sm">
                                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            {user.isOnline && (
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                                    {user.isOnline && (
                                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        user.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : user.status === 'deactivated' 
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : user.status === 'banned'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : user.status === 'pending'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            user.role === 'Coordinator' || user.role === 'Event Coordinator' || user.role === 'Director'
                                                                ? 'bg-purple-100 text-purple-800'
                                                            : user.role === 'Admin'
                                                                ? 'bg-red-100 text-red-800'
                                                            : user.role === 'Beneficiary'
                                                                ? 'bg-orange-100 text-orange-800'
                                                            : user.role === 'Donor'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    }) : 'N/A'}
                                                    </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.lastActivity ? (() => {
                                                        const now = new Date();
                                                        const lastActive = new Date(user.lastActivity);
                                                        const diffMs = now - lastActive;
                                                        const diffMins = Math.floor(diffMs / (1000 * 60));
                                                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                                        
                                                        if (diffMins < 1) return 'Just now';
                                                        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
                                                        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                                                        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                                                        return lastActive.toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        });
                                                    })() : 'Never'}
                                                    </td>
                                                <td className="px-6 py-4">
                                                            <button 
                                                        onClick={(e) => handleMoreClick(e, user)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : !showTrash && (
                                            <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="w-12 h-12 text-gray-300" />
                                                    <p className="text-lg font-medium">No users found</p>
                                                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                                                </div>
                                                </td>
                                            </tr>
                                        )}

                                        {showTrash && transformedTrashUsers.length > 0 ? (
                                        transformedTrashUsers.map((user, index) => (
                                            <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-6 py-4">
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
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.daysLeft > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                                            {user.daysLeft > 0 ? `${user.daysLeft} days left` : 'Expired'}
                                                        </span>
                                                    </td>
                                                <td className="px-6 py-4">
                                                    {showTrash ? (
                                                        <button 
                                                            onClick={() => handleAction({ action: 'restore', selectedUser: user })}
                                                            className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                                                            <UserCheck className="w-4 h-4" />
                                                            Restore
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => handleMoreClick(e, user)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                                        </button>
                                                    )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : showTrash && (
                                            <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Trash2 className="w-12 h-12 text-gray-300" />
                                                    <p className="text-lg font-medium">Trash is empty</p>
                                                    <p className="text-sm">No deleted users found</p>
                                                </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                        </div>

                        {/* Pagination */}
                        {!showTrash && filteredUsers.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Rows per page:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-gray-600">
                                        of {filteredUsers.length} rows
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronsLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    {totalPages > 5 && (
                                        <>
                                            <span className="px-2 text-gray-500">...</span>
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronsRight className="w-4 h-4" />
                                    </button>
                            </div>
                        </div>
                        )}
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

            <Confirmation
            open={showConfirmationModal.open}
            setOpen={(isOpen) => setShowConfirmationModal((prev) => ({ ...prev, open: isOpen })) }
            type={showConfirmationModal.type}
            userData={showConfirmationModal.userData}
            onConfirm={handleToggleOperation}
            />

            <UserInfoModal
            open={showUserInfoModal.open}
            setOpen={(isOpen) => setShowUserInfoModal((prev) => ({ ...prev, open: isOpen }))}
            userData={showUserInfoModal.userData}
            />

            <RejectedRequestsModal
            open={showRejectedRequestsModal}
            setOpen={setShowRejectedRequestsModal}
            onComplete={handleRequestComplete}
            />
        </>
    );
};

export default ManageUsers;