import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class VerificationCodes extends Model {}

VerificationCodes.init({
    vc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize: db,
    modelName: 'VerificationCodes',
    tableName: 'verification_codes',
    timestamps: true
})

export default VerificationCodes