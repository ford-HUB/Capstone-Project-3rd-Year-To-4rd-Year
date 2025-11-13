import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Event extends Model {}

Event.init({
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    organizer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'organizer',
            key: 'organizer_id'
        }
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

    funds_donation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    goods_donation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    status: {
        type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Cancelled', 'Completed'),
        defaultValue: 'Upcoming',
        allowNull: false
    },

    event_image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },

    certificate_generated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },

    notified_before_starting: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },

    // Beneficiary applicability fields
    beneficiary_applicable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    max_beneficiaries: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1
        }
    }

}, {
    sequelize: db,
    modelName: 'Event',
    tableName: 'event',
    timestamps: true
})

export default  Event