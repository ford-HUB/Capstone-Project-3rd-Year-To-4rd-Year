import { create } from "zustand"
import toast from "react-hot-toast"
import { 
    softDeleteUser as softDeleteUserService, 
    deactivateUser as deactivateUserService, 
    restoreUser as restoreUserService, 
    getListUsers, 
    getSoftDeletedUsers, 
    restoreSoftDeletedUser, 
    getActiveUsersCount as getActiveUsersCountService, 
    updateUserActivity as updateUserActivityService 
} from "../../services/director/manageUserService.js"
import { onUserActivityUpdate, offUserActivityUpdate } from "../../api/socket.js"

export const useManageUsersStore = create((set, get) => ({
    listUsers: null,
    trashUsers: null,
    userActivityStatus: new Map(), // Track real-time user activity

    getAllUsers: async () => {
        try {
            const response = await getListUsers()
            if(!response.success) {
                console.log('get all users failed:', response.message)
                set({ listUsers: null })
                return false
            }

            set({ listUsers: response.list })
            return true
        } catch (error) {
            console.log('get all users failed:', error.response?.data?.message || error.message)
            set({ listUsers: null })
            return false
        }
    },

    softDeleteUser: async (userId, reason) => {
        try {
            const response = await softDeleteUserService(userId, reason)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('delete user failed:', error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || error.message || 'Failed to delete user')
            return false
        }
    },

    deactivateUser: async (userId, reason) => {
        try {
            const response = await deactivateUserService(userId, reason)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('deactivate user failed:', error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || error.message || 'Failed to deactivate user')
            return false
        }
    },

    restoreUser: async (userId) => {
        try {
            const response = await restoreUserService(userId)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('restore user failed:', error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || error.message || 'Failed to restore user')
            return false
        }
    }

    ,

    getTrashUsers: async () => {
        try {
            const response = await getSoftDeletedUsers()
            if(!response.success) {
                console.log('get trash users failed:', response.message)
                set({ trashUsers: null })
                return false
            }
            set({ trashUsers: response.list })
            return true
        } catch (error) {
            console.log('get trash users failed:', error.response?.data?.message || error.message)
            set({ trashUsers: null })
            return false
        }
    },

    restoreSoftDeleted: async (userId) => {
        try {
            const response = await restoreSoftDeletedUser(userId)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('restore soft deleted failed:', error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || error.message || 'Failed to restore user')
            return false
        }
    },

    // Real-time activity functions
    initializeActivityTracking: () => {
        const handleUserActivityUpdate = (data) => {
            // Add null check for data
            if (!data) {
                console.log('Received null data in user activity update');
                return;
            }

            const { userId, status, userInfo, timestamp } = data;
            
            // Add validation for required fields
            if (!userId) {
                console.log('Received user activity update without userId:', data);
                return;
            }

            console.log(`Received user activity update: ${userId} is ${status}`);

            set((state) => {
                const newActivityStatus = new Map(state.userActivityStatus);
                newActivityStatus.set(userId, {
                    status: status || 'offline',
                    userInfo: userInfo || null,
                    timestamp: timestamp || new Date(),
                    lastUpdate: new Date()
                });
                return { userActivityStatus: newActivityStatus };
            });
        };

        onUserActivityUpdate(handleUserActivityUpdate);
        return handleUserActivityUpdate;
    },

    stopActivityTracking: (callback) => {
        offUserActivityUpdate(callback);
    },

    getUserActivityStatus: (userId) => {
        const state = get();
        return state.userActivityStatus.get(userId) || { status: 'offline' };
    },

    getAllActiveUsers: () => {
        const state = get();
        const activeUsers = [];
        for (const [userId, activity] of state.userActivityStatus.entries()) {
            if (activity.status === 'online') {
                activeUsers.push({ userId, ...activity });
            }
        }
        return activeUsers;
    },

    // Get active users count from backend
    getActiveUsersCount: async () => {
        try {
            const response = await getActiveUsersCountService();
            if (!response.success) {
                console.log('Get active users count failed:', response.message);
                return 0;
            }
            return response.activeCount;
        } catch (error) {
            console.log('Get active users count failed:', error.response?.data?.message || error.message);
            return 0;
        }
    },

    // Update user activity
    updateUserActivity: async () => {
        try {
            const response = await updateUserActivityService();
            if (!response.success) {
                console.log('Update user activity failed:', response.message);
                return false;
            }
            return true;
        } catch (error) {
            console.log('Update user activity failed:', error.response?.data?.message || error.message);
            return false;
        }
    },

    // Force refresh user list
    refreshUserList: async () => {
        try {
            const success = await get().getAllUsers();
            if (success) {
                console.log('User list refreshed');
            }
            return success;
        } catch (error) {
            console.log('Failed to refresh user list:', error.response?.data?.message || error.message);
            return false;
        }
    }

}))