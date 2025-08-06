import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class AuditLog extends Model {}

AuditLog.init({
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },

    target_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    details: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'AuditLog',
    tableName: 'audit_log',
    timestamps: true
})

export default AuditLog