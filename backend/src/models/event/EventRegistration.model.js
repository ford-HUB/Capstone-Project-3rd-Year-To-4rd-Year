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

    participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    participant_type: {
        type: DataTypes.ENUM('volunteer', 'staff', 'coordinator', 'director', 'assistant_coordinator', 'beneficiary'),
        allowNull: false
    },

    registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    emergency_fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },

    emergency_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isValidLength(value) {
                if (value && value.trim() !== '' && (value.length < 10 || value.length > 11)) {
                    throw new Error('Emergency contact number must be 10-11 digits');
                }
            }
        }
    },

    relationship: {
        type: DataTypes.STRING,
        allowNull: true
    },

    emergency_contact_email: {
        type: DataTypes.STRING,
        allowNull: true
    },

    current_situation: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    needs: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    how_can_we_help: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    id_verification_files: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },

    proof_uploaded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    proof_uploaded_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    proof_images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }

}, {
    sequelize: db,
    modelName: 'EventRegistration',
    tableName: 'event_registration',
    timestamps: true
})

export default EventRegistration