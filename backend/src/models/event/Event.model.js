import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Event extends Model {}

Event.init({
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    event_started: {
        type: DataTypes.DATE,
        allowNull: false
    },

    event_ended: {
        type: DataTypes.DATE,
        allowNull: false
    },

    location: {
    type: DataTypes.STRING,
    allowNull: false
    },

    latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
    },

    longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
    },

    participants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    max_participants: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },

    organizer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'organizer',
            key: 'organizer_id'
        }
    },

    funds_donation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    goods_donation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    event_image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },

}, {
    sequelize: db,
    modelName: 'Event',
    tableName: 'event',
    timestamps: true
})

export default  Event