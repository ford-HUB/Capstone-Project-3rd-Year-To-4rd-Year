import { DataTypes, Model } from "sequelize";
import { db } from "../config/db.js";

class AccountUpdateLog extends Model { }

AccountUpdateLog.init({
    account_update_log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    old_email: {
        type: DataTypes.STRING,
        allowNull: true
    },

    new_email: {
        type: DataTypes.STRING,
        allowNull: true
    },

    old_password: {
        type: DataTypes.STRING,
        allowNull: true
    },

    new_password: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM('pending', 'verified', 'cancelled'),
        defaultValue: 'pending'
    },

    verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'AccountUpdateLog',
    tableName: 'account_update_log',
    timestamps: true
})

export default AccountUpdateLog