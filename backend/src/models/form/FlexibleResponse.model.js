import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class FlexibleResponse extends Model {}

FlexibleResponse.init({
    response_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    form_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    participant_type: {
        type: DataTypes.ENUM('volunteer', 'beneficiary'),
        allowNull: false
    },

    response_data: {
        type: DataTypes.JSON,
        allowNull: false
    },

    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

}, {
    sequelize: db,
    modelName: 'FlexibleResponse',
    tableName: 'response_table',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
})

export default FlexibleResponse
