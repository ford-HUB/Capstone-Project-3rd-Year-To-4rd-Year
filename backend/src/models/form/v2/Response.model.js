import { db } from "../../../config/db.js";
import { DataTypes, Model } from "sequelize";

class Response extends Model { }

Response.init({
    response_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    formlink_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'formlink_id',
            model: 'form_link'
        }
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'event_id',
            model: 'event'
        }
    },

    participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    participant_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    answer: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Response',
    tableName: 'response',
    timestamps: true
})

export default Response