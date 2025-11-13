import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"

class ResetPassword extends Model {}

ResetPassword.init({
    reset_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    reset_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    used_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'ResetPassword',
    tableName: 'reset_passwords',
    timestamps: true,
    paranoid: false // not to soft delete reset tokens
})

export default ResetPassword
