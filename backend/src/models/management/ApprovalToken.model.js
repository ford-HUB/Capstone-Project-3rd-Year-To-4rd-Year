import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class ApprovalToken extends Model {}

ApprovalToken.init({
    at_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    ra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'request_approval',
            key: 'ra_id'
        }
    },

    token: {
        type: DataTypes.STRING,
        allowNull: false
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

    used: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: 'ApprovalToken',
    tableName: 'approval_token',
    timestamps: true
})

export default ApprovalToken
