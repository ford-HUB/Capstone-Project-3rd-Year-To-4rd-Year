import { DataTypes, Model } from "sequelize";
import { db } from "../config/db.js";

class ActivityLog extends Model { }

ActivityLog.init({
    activity_log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },

    action: {
        type: DataTypes.STRING,
        allowNull: false
    },

    module: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    user_agent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'ActivityLog',
    tableName: 'activity_log',
    timestamps: true
})

export default ActivityLog