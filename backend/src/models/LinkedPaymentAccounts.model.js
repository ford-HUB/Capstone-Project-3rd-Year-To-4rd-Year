import { DataTypes, Model } from "sequelize";
import { db } from "../config/db.js";

class LinkedPaymentAccounts extends Model { }

LinkedPaymentAccounts.init({
    linked_payment_account_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        references: {
            key: 'account_id',
            model: 'accounts'
        }
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true
    },

    payment_method_types: {
        type: DataTypes.JSONB,
        allowNull: false
    },

    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },

    checkout_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE')
    },

}, {
    sequelize: db,
    modelName: 'LinkedPaymentAccounts',
    tableName: 'linked_payment_accounts',
    timestamps: true
})

export default LinkedPaymentAccounts