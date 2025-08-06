import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class EventRegistration extends Model {}

EventRegistration.init({
    event_registration_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'event',
            key: 'event_id'
        }
    },

    volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'volunteer',
            key: 'volunteer_id'
        }
    },

    registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'EventRegistration',
    tableName: 'event_registration',
    timestamps: true
})

export default EventRegistration