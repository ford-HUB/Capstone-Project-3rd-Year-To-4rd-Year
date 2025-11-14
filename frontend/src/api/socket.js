import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
    if (!socket) {
        const backendUrl = import.meta.env.VITE_SYS_MODE === 'development'
            ? import.meta.env.VITE_BACKEND_URL
            : import.meta.env.VITE_BACKEND_PROD;
            
        console.log('Initializing socket connection to:', backendUrl);
        
        socket = io(backendUrl, {
            transports: ['websocket', 'polling'], // Add polling as fallback
            reconnectionAttempts: 10,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2000,
            timeout: 5000,
            forceNew: true, // Force new connection
        });
        
        // Add connection event listeners for debugging
        socket.on('connect', () => {
            console.log('Socket connected successfully');
        });
        
        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });
        
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
        
        socket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
        });
        
        socket.on('reconnect_error', (error) => {
            console.error('Socket reconnection error:', error);
        });
        
        socket.on('reconnect_failed', () => {
            console.error('Socket reconnection failed');
        });
    }

    return socket;
}

// Start periodic activity tracking for authenticated users
let activityInterval = null;
let currentUserId = null;

export const startActivityTracking = (userId) => {
    if (activityInterval) {
        clearInterval(activityInterval);
    }
    
    currentUserId = userId;
    
    // Emit activity every 30 seconds
    activityInterval = setInterval(() => {
        if (currentUserId && isSocketConnected()) {
            emitUserActivity(currentUserId);
        }
    }, 30000);
    
    console.log('Started activity tracking for user:', userId);
}

export const stopActivityTracking = () => {
    if (activityInterval) {
        clearInterval(activityInterval);
        activityInterval = null;
    }
    
    if (currentUserId) {
        emitUserLogout(currentUserId);
        currentUserId = null;
    }
    
    console.log('Stopped activity tracking');
}

// Wait for socket connection with timeout
export const waitForSocketConnection = (timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const currentSocket = getSocket();
        
        if (currentSocket.connected) {
            resolve(currentSocket);
            return;
        }
        
        const timeoutId = setTimeout(() => {
            reject(new Error('Socket connection timeout'));
        }, timeout);
        
        const onConnect = () => {
            clearTimeout(timeoutId);
            currentSocket.off('connect', onConnect);
            resolve(currentSocket);
        };
        
        currentSocket.on('connect', onConnect);
    });
}

export const getSocket = () => {
    if (!socket) {
        console.log('Socket not initialized, initializing now...');
        return initSocket();
    }
    return socket;
}

export const isSocketConnected = () => {
    return socket ? socket.connected : false;
}

export const getSocketConnectionStatus = () => {
    if (!socket) return 'not_initialized';
    return socket.connected ? 'connected' : 'disconnected';
}

// User activity functions
export const emitUserLogin = (userId, userInfo) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
        console.log('Socket not initialized, cannot emit user_login');
        return;
    }
    
    if (!currentSocket.connected) {
        console.log('Socket not connected, cannot emit user_login');
        return;
    }
    
    if (!userId) {
        console.log('Invalid userId provided for user_login');
        return;
    }
    
    try {
        currentSocket.emit('user_login', { userId, userInfo });
        console.log('Emitted user_login for userId:', userId);
    } catch (error) {
        console.error('Error emitting user_login:', error);
    }
}

export const emitUserLogout = (userId) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
        console.log('Socket not initialized, cannot emit user_logout');
        return;
    }
    
    if (!currentSocket.connected) {
        console.log('Socket not connected, cannot emit user_logout');
        return;
    }
    
    if (!userId) {
        console.log('Invalid userId provided for user_logout');
        return;
    }
    
    try {
        currentSocket.emit('user_logout', { userId });
        console.log('Emitted user_logout for userId:', userId);
    } catch (error) {
        console.error('Error emitting user_logout:', error);
    }
}

export const emitUserActivity = (userId) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
        console.log('Socket not initialized, cannot emit user_activity');
        return;
    }
    
    if (!currentSocket.connected) {
        console.log('Socket not connected, cannot emit user_activity');
        return;
    }
    
    if (!userId) {
        console.log('Invalid userId provided for user_activity');
        return;
    }
    
    try {
        currentSocket.emit('user_activity', { userId });
    } catch (error) {
        console.error('Error emitting user_activity:', error);
    }
}

// Listen for user activity updates
export const onUserActivityUpdate = (callback) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
        console.log('Socket not initialized, cannot add user_activity_update listener');
        return;
    }
    
    if (!callback || typeof callback !== 'function') {
        console.log('Invalid callback provided for user_activity_update listener');
        return;
    }
    
    try {
        currentSocket.on('user_activity_update', callback);
        console.log('Added user_activity_update listener');
    } catch (error) {
        console.error('Error adding user_activity_update listener:', error);
    }
}

// Remove user activity listener
export const offUserActivityUpdate = (callback) => {
    const currentSocket = getSocket();
    if (!currentSocket) {
        console.log('Socket not initialized, cannot remove user_activity_update listener');
        return;
    }
    
    if (!callback || typeof callback !== 'function') {
        console.log('Invalid callback provided for removing user_activity_update listener');
        return;
    }
    
    try {
        currentSocket.off('user_activity_update', callback);
        console.log('Removed user_activity_update listener');
    } catch (error) {
        console.error('Error removing user_activity_update listener:', error);
    }
}