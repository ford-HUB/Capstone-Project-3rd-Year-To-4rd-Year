import { create } from "zustand"
import { apiInstance } from "../../api/_base.js"
import toast from "react-hot-toast"
import { softDeleteUser, deactivateUser, restoreUser, getListUsers, getSoftDeletedUsers, restoreSoftDeletedUser, getActiveUsersCount, updateUserActivity } from "../../services/director/manageUserService.js"
import { onUserActivityUpdate, offUserActivityUpdate } from "../../api/socket.js"

export const useManageUsersStore = create((set, get) => ({
    listUsers: null,
    trashUsers: null,
    userActivityStatus: new Map(), // Track real-time user activity

    getAllUsers: async () => {
        try {
            const response = await getListUsers()
            if(!response.success) {
                console.log(response.data.message)
                set({ listUsers: null })
                return false
            }

            set({ listUsers: response.list })
            return true

        } catch (error) {
            console.log('get all users failed:', error.message)
            set({ listUsers: null })
            return false
        }
    },

    softDeleteUser: async (userId, reason) => {
        try {
            const response = await softDeleteUser(userId, reason)
            if(!response.success) {
                toast.error(response.message)
                return false
            }
            toast.success(response.message)
            return true
        } catch (error) {
            console.log('delete user failed:', error.message)
            return false
        }
    },

    deactivateUser: async (userId, reason) => {
        try {
            const response = await deactivateUser(userId, reason)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('deactivate user failed: ', error.message)
        }
    },

    restoreUser: async (userId) => {
        try {
            const response = await restoreUser(userId)
            if(!response.success) {
                toast.error(response.message)
                return false
            }

            toast.success(response.message)
            return true
        } catch (error) {
            console.log('restore user failed: ', error.message)
        }
    }

    ,

    getTrashUsers: async () => {
        try {
            const response = await getSoftDeletedUsers()
            if(!response.success) {
                set({ trashUsers: null })
                return false
            }
            set({ trashUsers: response.list })
            return true
        } catch (error) {
            console.log('get trash users failed:', error.message)
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
            console.log('restore soft deleted failed:', error.message)
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
            const response = await getActiveUsersCount();
            if (!response.success) {
                console.log('Failed to get active users count:', response.message);
                return 0;
            }
            return response.activeCount;
        } catch (error) {
            console.log('Get active users count failed:', error.message);
            return 0;
        }
    },

    // Update user activity
    updateUserActivity: async () => {
        try {
            const response = await updateUserActivity();
            if (!response.success) {
                console.log('Failed to update user activity:', response.message);
                return false;
            }
            return true;
        } catch (error) {
            console.log('Update user activity failed:', error.message);
            return false;
        }
    },

    // Force refresh user list
    refreshUserList: async () => {
        try {
            await getAllUsers();
            console.log('User list refreshed');
            return true;
        } catch (error) {
            console.log('Failed to refresh user list:', error.message);
            return false;
        }
    }

}))