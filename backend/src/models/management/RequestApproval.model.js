import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class RequestApproval extends Model {}

RequestApproval.init({
    ra_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    requested_role: {
        type: DataTypes.STRING,
        allowNull: false
    },

    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM,
        values: ['requesting', 'approved', 'rejected'],
        allowNull: true
    },

    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'RequestApproval',
    tableName: 'request_approval',
    timestamps: true,
    paranoid: true // Enable soft delete
})

export default RequestApproval