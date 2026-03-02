import { Server } from "socket.io";

let io
// Store active users globally
const activeUsers = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'development' ? process.env.FRONT_END_URL : process.env.FRONTEND_URL_PROD,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected");
        
        // Handle user login activity
        socket.on("user_login", (data) => {
            if (!data || !data.userId) {
                console.log('Invalid user_login data received:', data);
                return;
            }
            
            const { userId, userInfo } = data;
            activeUsers.set(userId, {
                socketId: socket.id,
                userInfo,
                loginTime: new Date(),
                lastActivity: new Date()
            });
            
            // Notify all clients about user activity
            socket.broadcast.emit("user_activity_update", {
                userId,
                status: "online",
                userInfo,
                timestamp: new Date()
            });
            
            console.log(`User ${userId} logged in`);
        });

        // Handle user logout activity
        socket.on("user_logout", (data) => {
            if (!data || !data.userId) {
                console.log('Invalid user_logout data received:', data);
                return;
            }
            
            const { userId } = data;
            if (activeUsers.has(userId)) {
                activeUsers.delete(userId);
                
                // Notify all clients about user going offline
                socket.broadcast.emit("user_activity_update", {
                    userId,
                    status: "offline",
                    timestamp: new Date()
                });
                
                console.log(`User ${userId} logged out`);
            }
        });

        // Handle user activity updates
        socket.on("user_activity", (data) => {
            if (!data || !data.userId) {
                console.log('Invalid user_activity data received:', data);
                return;
            }
            
            const { userId } = data;
            if (activeUsers.has(userId)) {
                const userData = activeUsers.get(userId);
                userData.lastActivity = new Date();
                activeUsers.set(userId, userData);
                
                // Emit activity update to all clients
                socket.broadcast.emit("user_activity_update", {
                    userId,
                    status: "online",
                    timestamp: new Date()
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            
            // Find and remove user from active users
            for (const [userId, userData] of activeUsers.entries()) {
                if (userData.socketId === socket.id) {
                    activeUsers.delete(userId);
                    
                    // Notify all clients about user going offline
                    socket.broadcast.emit("user_activity_update", {
                        userId,
                        status: "offline",
                        timestamp: new Date()
                    });
                    
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
}

export const getSocket = () => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket first.");
    }
    return io;
}

export const updateEventStatus = (eventId, status) => {
    const io = getSocket();
    io.emit("eventStatusUpdate", { eventId, status })
}

export const sendNotification = (notification) => {
    const io = getSocket();
    io.emit("notification", notification);
}

export const removeNotification = (payload) => {
    const io = getSocket();
    io.emit("notification:removed", payload);
}

// Emit to a specific user's socket by account_id (if known); otherwise broadcast
const emitToUserOrBroadcast = (event, payload, accountId) => {
    const io = getSocket();
    if (accountId != null && activeUsers.has(String(accountId))) {
        const { socketId } = activeUsers.get(String(accountId));
        if (socketId) {
            io.to(socketId).emit(event, payload);
            return;
        }
    }
    io.emit(event, payload);
};

// Separate function for volunteer matched events
export const updateVolunteerMatchedEvents = (volunteerId, matchedEvents, recommendations, accountId = null) => {
    const eventData = {
        volunteerId,
        matchedEvents: matchedEvents || [],
        recommendations: recommendations || [],
        timestamp: new Date().toISOString()
    };
    emitToUserOrBroadcast("volunteer_matched_events_updated", eventData, accountId);
}

// Separate function for beneficiary matched events
export const updateBeneficiaryMatchedEvents = (beneficiaryId, nearYouEvents, almostNearYouEvents, recommendations, accountId = null) => {
    const eventData = {
        beneficiaryId,
        nearYou: nearYouEvents || [],
        almostNearYou: almostNearYouEvents || [],
        recommendations: recommendations || [],
        timestamp: new Date().toISOString()
    };
    emitToUserOrBroadcast("beneficiary_matched_events_updated", eventData, accountId);
}

// Legacy function for backward compatibility (deprecated - use specific functions instead)
export const updateMatchedEvents = (volunteerId, nearYouEvents, almostNearYouEvents, recommendations) => {
    console.warn('updateMatchedEvents is deprecated. Use updateVolunteerMatchedEvents or updateBeneficiaryMatchedEvents instead.');
    
    const io = getSocket();
    
    // Handle both beneficiary (3 parameters) and volunteer (2 parameters) cases
    let eventData;
    if (almostNearYouEvents !== undefined) {
        // Beneficiary case: 3 separate categories
        eventData = {
            volunteerId, 
            nearYou: nearYouEvents,
            almostNearYou: almostNearYouEvents,
            recommendations,
            timestamp: new Date().toISOString()
        };
    } else {
        // Volunteer case: 2 categories (matchedEvents, recommendations)
        eventData = {
            volunteerId, 
            matchedEvents: nearYouEvents,
            recommendations: recommendations,
            timestamp: new Date().toISOString()
        };
    }
    
    io.emit("matched_events_updated", eventData);
}

export const notifyEventMatchingProgress = (volunteerIdOrBeneficiaryId, progress, accountId = null) => {
    const payload = {
        volunteerId: volunteerIdOrBeneficiaryId,
        beneficiaryId: volunteerIdOrBeneficiaryId,
        ...progress,
        timestamp: new Date().toISOString()
    };
    emitToUserOrBroadcast("matching_progress", payload, accountId);
}

export const notifyEventDeleted = (eventId, eventTitle) => {
    const io = getSocket();
    io.emit("event_deleted", { 
        eventId, 
        eventTitle,
        timestamp: new Date().toISOString()
    });
}

// Helper function to emit user activity updates
export const emitUserActivityUpdate = (userId, status, userInfo = null) => {
    const io = getSocket();
    io.emit("user_activity_update", {
        userId,
        status,
        userInfo,
        timestamp: new Date()
    });
    console.log(`Emitted user_activity_update: ${userId} is ${status}`);
}

// Helper function to get active users
export const getActiveUsers = () => {
    const io = getSocket();
    // Return the active users from the Map
    return Array.from(activeUsers.entries()).map(([userId, userData]) => ({
        userId,
        ...userData
    }));
}

// Helper function to remove inactive users from active users map
export const removeInactiveUser = (userId) => {
    if (activeUsers.has(userId)) {
        activeUsers.delete(userId);
        console.log(`Removed inactive user ${userId} from active users map`);
    }
}

// Helper function to clean up old connections
export const cleanupInactiveUsers = () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    for (const [userId, userData] of activeUsers.entries()) {
        if (userData.lastActivity && userData.lastActivity < fiveMinutesAgo) {
            activeUsers.delete(userId);
            emitUserActivityUpdate(userId, 'offline');
            console.log(`Cleaned up inactive user ${userId}`);
        }
    }
}

export const emitDonationUpdate = (eventId, donationId, amount, currency) => {
    const io = getSocket();
    if (!io) {
        console.log('Socket not initialized, cannot emit donation update');
        return;
    }
    
    try {
        io.emit('donation_updated', {
            eventId: eventId,
            donationId: donationId,
            amount: amount,
            currency: currency,
            timestamp: new Date().toISOString()
        });
        console.log('Emitted donation update for event:', eventId);
    } catch (error) {
        console.log('Socket emission failed:', error.message);
    }
}

export const notifyEventAvailableForDonations = (eventId, eventData) => {
    const io = getSocket();
    if (!io) {
        console.log('Socket not initialized, cannot emit event available for donations');
        return;
    }
    
    try {
        io.emit('event_available_for_donations', {
            eventId: eventId,
            eventData: eventData || null,
            timestamp: new Date().toISOString()
        });
        console.log('Emitted event_available_for_donations for event:', eventId);
    } catch (error) {
        console.log('Socket emission failed:', error.message);
    }
}

export const notifyNewDonation = (donationData) => {
    const io = getSocket();
    if (!io) {
        console.log('Socket not initialized, cannot emit new donation');
        return;
    }
    
    try {
        io.emit('new_donation', {
            donation_id: donationData.donation_id,
            donation_type: donationData.donation_type,
            amount: donationData.amount || 0,
            status: donationData.status || 'PENDING',
            donor_name: donationData.donor_name || 'Anonymous',
            is_anonymous: donationData.is_anonymous || false,
            event_name: donationData.event_name || 'General Donation',
            goods_description: donationData.goods_description || '',
            goods_quantity: donationData.goods_quantity || '',
            payment_method: donationData.payment_method || '',
            transaction_id: donationData.transaction_id || '',
            timestamp: new Date().toISOString()
        });
        console.log('Emitted new_donation for donation:', donationData.donation_id);
    } catch (error) {
        console.log('Socket emission failed:', error.message);
    }
}

export const updateEventParticipantCount = (eventId, participantCount) => {
    const io = getSocket();
    if (!io) {
        console.log('Socket not initialized, cannot emit participant count update');
        return;
    }
    
    try {
        io.emit('event_participant_count_updated', {
            eventId: eventId,
            participantCount: participantCount,
            timestamp: new Date().toISOString()
        });
        console.log('Emitted participant count update for event:', eventId, 'count:', participantCount);
    } catch (error) {
        console.log('Socket emission failed:', error.message);
    }
}

