import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Payments extends Model { }

Payments.init({
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    donation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'donation_id',
            model: 'donations'
        }
    },

    payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'payment_method_id',
            model: 'payment_method'
        }
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    currency: {
        type: DataTypes.STRING,
        defaultValue: 'PHP'
    },

    payment_status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },

    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },

    external_reference: {
        type: DataTypes.STRING,
        allowNull: true
    },

    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    receipt_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    failure_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'Payments',
    tableName: 'payments',
    timestamps: true,
    paranoid: false
})

export default Payments
