import { create } from "zustand";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getNotifications, markNotificationAsRead } from "../../services/notification/notifService.js";
import { initSocket } from "../../api/socket.js";

dayjs.extend(relativeTime);

export const useNotifStore = create((set, get) => {
    const socket = initSocket();

    socket.on("notification", (notification) => {
        const formattedNotif = {
            ...notification,
            notification_id: notification.notification_id || Date.now(), // fallback ID
            created_at: notification.createdAt || new Date(),
            is_read: false,
        };

        set((state) => {
            // Check if this notification should be shown based on current user role
            const shouldShowNotification = !(state.currentUserRole && 
                (state.currentUserRole === 'staff' || state.currentUserRole === 'coordinator' || state.currentUserRole === 'assistant_coordinator') &&
                formattedNotif.type === 'event_approval');

            return {
                notificationList: [formattedNotif, ...state.notificationList],
                unreadCount: shouldShowNotification ? state.unreadCount + 1 : state.unreadCount,
            };
        });
    });

    socket.on("notification:removed", (payload) => {
        set((state) => ({
            notificationList: state.notificationList.filter(
                (notif) => notif.notification_id !== payload.notification_id
            ),
            unreadCount: Math.max(state.unreadCount - 1, 0),
        }));
    });

    return {
        notificationList: [],
        unreadCount: 0,
        currentPage: 1,
        hasNextPage: true,
        isLoading: false,
        isLoadingMore: false,
        currentUserRole: null,

        fetchNotifications: async (page = 1, append = false) => {
            try {
                set({ isLoading: !append, isLoadingMore: append });
                
                const response = await getNotifications(page, 10);
                
                if (!response.success) {
                    console.error("Failed to fetch notifications");
                    return false;
                }

                const formattedList = response.notifications.map((notif) => ({
                    ...notif,
                    created_at: notif.createdAt,
                }));

                set((state) => ({
                    notificationList: append ? [...state.notificationList, ...formattedList] : formattedList,
                    currentPage: page,
                    hasNextPage: response.pagination?.hasNextPage || false,
                    unreadCount: append ? state.unreadCount : formattedList.filter((notif) => !notif.is_read).length
                }));
                
                return true;
            } catch (error) {
                console.error("Error fetching notifications:", error.message);
                return false;
            } finally {
                set({ isLoading: false, isLoadingMore: false });
            }
        },

        loadMoreNotifications: async () => {
            const state = get();
            if (state.hasNextPage && !state.isLoadingMore) {
                return await state.fetchNotifications(state.currentPage + 1, true);
            }
            return false;
        },

        markAsRead: async (notificationId) => {
            try {
                const response = await markNotificationAsRead(notificationId);
                if (!response.success) {
                    console.error("Failed to mark notification as read:", response.message);
                    return false;
                }

                set((state) => ({
                    notificationList: state.notificationList.map((notif) =>
                        notif.notification_id === notificationId
                            ? { ...notif, is_read: true }
                            : notif
                    ),
                    unreadCount: Math.max(state.unreadCount - 1, 0),
                }));

                return true;
            } catch (error) {
                console.error("Error marking notification as read:", error.message);
                return false;
            }
        },

        incrementUnreadCount: () =>
            set((state) => ({ unreadCount: state.unreadCount + 1 })),

        decrementUnreadCount: () =>
            set((state) => ({ unreadCount: Math.max(state.unreadCount - 1, 0) })),

        // Set current user role for notification filtering
        setCurrentUserRole: (role) => {
            set({ currentUserRole: role });
        },

        // Initialize notification count on app start
        initializeNotificationCount: async (userRole = null) => {
            try {
                // Set the user role in the store
                if (userRole) {
                    set({ currentUserRole: userRole });
                }

                const response = await getNotifications(1, 50); // Fetch first 50 notifications to get count
                
                if (!response.success) {
                    console.error("Failed to initialize notification count");
                    return false;
                }

                // Filter notifications based on user role
                let filteredNotifications = response.notifications;
                if (userRole && (userRole === 'staff' || userRole === 'coordinator' || userRole === 'assistant_coordinator')) {
                    // Management users should not see event approval notifications
                    filteredNotifications = response.notifications.filter((notif) => notif.type !== 'event_approval');
                }

                // Count unread notifications from the filtered response
                const unreadCount = filteredNotifications.filter((notif) => !notif.is_read).length;
                
                set({ unreadCount });
                return true;
            } catch (error) {
                console.error("Error initializing notification count:", error.message);
                return false;
            }
        },
    };
});
