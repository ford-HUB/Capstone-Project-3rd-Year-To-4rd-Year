import { DataTypes, Model } from 'sequelize';
import { db } from '../config/db.js';

class Notification extends Model {}

Notification.init(
    {
        notification_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sender_type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'system',
        },

        recipient_id: {
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        recipient_role: {
            type: DataTypes.STRING,
            allowNull: true, 
        },

        type: {
            type: DataTypes.ENUM(
                'event_approval',
                'event_registration_approval',
                'event_reminder',
                'event_started',
                'event_completed',
                'event_ended',
                'certificate_ready',
                'general'
            ),
            defaultValue: 'general',
        },

        header: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        link: {
            type: DataTypes.STRING, 
            allowNull: true,
        },

        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: 'Notification',
        tableName: 'notification',
        timestamps: true,
    }
);

export default Notification;
