import models from '../models/index.js';
import { sendNotification } from '../socket.js';

const { Notification } = models;

/**
 * Create a notification and send it via socket
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.header - Notification header
 * @param {string} notificationData.message - Notification message
 * @param {string} [notificationData.link] - Optional link
 * @param {number} [notificationData.recipient_id] - Specific recipient ID
 * @param {string} [notificationData.recipient_role] - Specific recipient role
 * @param {number} [notificationData.sender_id] - Sender ID
 * @param {string} [notificationData.sender_type] - Sender type (default: 'system')
 * @returns {Promise<Object>} Created notification
 */

export const createNotification = async (notificationData) => {
    try {
        const {
            type,
            header,
            message,
            link = null,
            recipient_id = null,
            recipient_role = null,
            sender_id = null,
            sender_type = 'system'
        } = notificationData;

        const notification = await Notification.create({
            type,
            header,
            message,
            link,
            recipient_id,
            recipient_role,
            sender_id,
            sender_type
        });

        sendNotification({
            type,
            header,
            message,
            link,
            notification_id: notification.notification_id,
            createdAt: notification.createdAt
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error.message);
        throw error;
    }
};

/**
 * Create event-related notifications
 * @param {string} eventType - Type of event notification
 * @param {Object} event - Event object
 * @param {Object} [options] - Additional options
 * @returns {Promise<Object>} Created notification
 */
export const createEventNotification = async (eventType, event, options = {}) => {
    const baseData = {
        type: eventType,
        link: null,
        sender_type: 'system'
    };

    switch (eventType) {
        case 'event_reminder':
            return await createNotification({
                ...baseData,
                header: 'Upcoming Event Reminder',
                message: `Reminder: "${event.title}" will start at ${event.event_started.toLocaleString()}`,
                ...options
            });

        case 'event_started':
            return await createNotification({
                ...baseData,
                header: 'Event Started',
                message: `"${event.title}" has started!`,
                ...options
            });

        case 'event_completed':
            return await createNotification({
                ...baseData,
                header: 'Event Completed',
                message: `"${event.title}" has been completed!`,
                ...options
            });

        case 'event_ended':
            return await createNotification({
                ...baseData,
                header: 'Event Ended',
                message: `"${event.title}" has ended!`,
                ...options
            });

        default:
            throw new Error(`Unknown event notification type: ${eventType}`);
    }
};

/**
 * Create certificate-related notifications
 * @param {Object} certificate - Certificate object
 * @param {Object} [options] - Additional options
 * @returns {Promise<Object>} Created notification
 */
export const createCertificateNotification = async (certificate, options = {}) => {
    return await createNotification({
        type: 'certificate_ready',
        header: 'Certificate Ready',
        message: `Your certificate for "${certificate.event_title}" is ready for download`,
        link: `/certificates/${certificate.certificate_id}`,
        recipient_id: certificate.participant_id,
        sender_type: 'system',
        ...options
    });
};

/**
 * Create general system notifications
 * @param {string} header - Notification header
 * @param {string} message - Notification message
 * @param {Object} [options] - Additional options
 * @returns {Promise<Object>} Created notification
 */
export const createGeneralNotification = async (header, message, options = {}) => {
    return await createNotification({
        type: 'general',
        header,
        message,
        sender_type: 'system',
        ...options
    });
};
