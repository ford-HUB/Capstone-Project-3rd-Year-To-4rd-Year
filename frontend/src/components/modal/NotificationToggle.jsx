import React from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNotifStore } from '../../store/notification/useNotifStore.js';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { showNotification, requestNotificationPermission } from '../../utils/systemNotification.js';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';

const NotificationToggle = ({ isOpen, setOpen }) => {
    const { 
        notificationList, 
        fetchNotifications, 
        markAsRead, 
        loadMoreNotifications,
        hasNextPage,
        isLoading,
        isLoadingMore
    } = useNotifStore();
    const { authenticatedDirector } = useAuthDirectorStore()
    const { authenticatedManagement } = useAuthManagementStore()
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState('all');
    const [showAllNotifications, setShowAllNotifications] = React.useState(false);

    dayjs.extend(relativeTime)

    const droipdownRef = React.useRef(null);
    const roleType = authenticatedDirector?.Role?.name || authenticatedManagement?.Role?.name

    React.useEffect(() => {
        const fetchData = async () => {
            const success = await fetchNotifications(1, false);
            if (!success) return
        };
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, fetchNotifications]);

    React.useMemo(async() => {
        return requestNotificationPermission().then(granted => {
            if(granted) {
                if (notificationList.length > 0) {
                    const latest = notificationList[0]
                    showNotification(latest.header, latest.message)
                }
            }

            console.log('notification is denied')
        })
    })



    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                droipdownRef.current &&
                !droipdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpen]);

    let filteredNotifications = notificationList;

    // Filter by read status if unread tab is selected
    if (activeTab === 'unread') {
        filteredNotifications = notificationList.filter((n) => !n.is_read);
    }

    // Role-based filtering
    switch(roleType) {
        case 'director':
            // Directors see all notifications
            break;
        case 'staff':
        case 'coordinator':
        case 'assistant_coordinator':
            // Staff/coordinators see all notifications except approval requests
            filteredNotifications = filteredNotifications.filter((n) => n.type !== 'event_approval');
            break;
        default:
            // Other roles see all notifications
            break;
    }

    const getAvatarStyle = (type) => {
        switch (type) {
            case 'live':
                return 'bg-red-100';
            case 'safety':
                return 'bg-green-100';
            case 'security':
                return 'bg-blue-100';
            default:
                return 'bg-gray-100';
        }
    };

    const handleMarkAsRead = async (notificationId, link) => {
        const success = await markAsRead(notificationId);
        if (!success) return;
        
        // Navigate to the notification link if provided
        if (link) {
            navigate(link);
        }
        setOpen(false);
    }

    const handleShowAllNotifications = () => {
        setShowAllNotifications(true);
    }

    const handleLoadMore = async () => {
        await loadMoreNotifications();
    }

    if (!isOpen) return null;

    return (
        <div
            ref={droipdownRef}
            className="absolute right-6 mt-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div id="notification-scroll-container" className="space-y-3 h-[450px] overflow-y-auto">
                <div className="p-4 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Notifications
                        </h2>
                        {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button> */}
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                            All
                        </button>

                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeTab === 'unread'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}>
                            Unread
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading notifications...</span>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center text-gray-500 mt-4 p-4">
                            No notifications found.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-0.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {showAllNotifications ? 'All Notifications' : 'Recent'}
                                    </h3>
                                    {!showAllNotifications && (
                                        <button 
                                            onClick={handleShowAllNotifications}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            See all
                                        </button>
                                    )}
                                </div>
                                
                                {showAllNotifications ? (
                                    <InfiniteScroll
                                        dataLength={filteredNotifications.length}
                                        next={handleLoadMore}
                                        hasMore={hasNextPage}
                                        loader={
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                <span className="ml-2 text-sm text-gray-600">Loading more...</span>
                                            </div>
                                        }
                                        endMessage={
                                            <div className="text-center text-gray-500 py-4">
                                                <p>You've reached the end of notifications</p>
                                            </div>
                                        }
                                        scrollableTarget="notification-scroll-container"
                                        className="space-y-0.5">
                                        {filteredNotifications.map((notification) => (
                                            <div onClick={() => handleMarkAsRead(notification.notification_id, notification.link)}
                                                key={notification.notification_id}
                                                className={`flex items-start space-x-3 p-2 ${notification.is_read && 'bg-gray-100'} hover:bg-gray-50 rounded-lg cursor-pointer transition-colors`}>
                                                <div
                                                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl
                                                    ${getAvatarStyle(notification.sender_type)}`}>
                                                    {notification.type === 'event_reminder' ? '⏰' :
                                                     notification.type === 'event_started' ? '🚀' :
                                                     notification.type === 'event_completed' ? '✅' :
                                                     notification.type === 'event_ended' ? '🏁' :
                                                     notification.type === 'certificate_ready' ? '🏆' :
                                                     notification.type === 'event_approval' ? '📋' : 
                                                     notification.avatar ? '' : '📩'}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-md text-gray-900 leading-relaxed font-medium">
                                                        {notification.header}
                                                    </p>

                                                    <p className="text-sm text-gray-900 leading-relaxed">
                                                        {notification.message}
                                                    </p>

                                                    <p className="text-xs text-blue-600 mt-1 font-medium">
                                                        {dayjs(notification.created_at).fromNow()}
                                                    </p>
                                                </div>

                                                {notification.is_read && (
                                                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                                                )}
                                            </div>
                                        ))}
                                    </InfiniteScroll>
                                ) : (
                                    filteredNotifications.slice(0, 3).map((notification) => (
                                        <div onClick={() => handleMarkAsRead(notification.notification_id, notification.link)}
                                            key={notification.notification_id}
                                            className={`flex items-start space-x-3 p-2 ${notification.is_read && 'bg-gray-100'} hover:bg-gray-50 rounded-lg cursor-pointer transition-colors`}>
                                            <div
                                                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl
                                                ${getAvatarStyle(notification.sender_type)}`}>
                                                {notification.type === 'event_reminder' ? '⏰' :
                                                 notification.type === 'event_started' ? '🚀' :
                                                 notification.type === 'event_completed' ? '✅' :
                                                 notification.type === 'event_ended' ? '🏁' :
                                                 notification.type === 'certificate_ready' ? '🏆' :
                                                 notification.type === 'event_approval' ? '📋' : 
                                                 notification.avatar ? '' : '📩'}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-md text-gray-900 leading-relaxed font-medium">
                                                    {notification.header}
                                                </p>

                                                <p className="text-sm text-gray-900 leading-relaxed">
                                                    {notification.message}
                                                </p>

                                                <p className="text-xs text-blue-600 mt-1 font-medium">
                                                    {dayjs(notification.created_at).fromNow()}
                                                </p>
                                            </div>

                                            {notification.is_read && (
                                                <div className="w-3 h-3 bg-blue-600 rounded-full mt-1"></div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {!showAllNotifications && (
                                <button 
                                    onClick={handleShowAllNotifications}
                                    className="w-full mt-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center text-sm font-medium text-gray-700 transition-colors">
                                    See previous notifications
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationToggle;
