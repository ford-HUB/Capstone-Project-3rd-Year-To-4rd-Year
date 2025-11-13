import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class PaymentMethod extends Model { }

PaymentMethod.init({
    payment_method_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    donation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: 'donation_id',
            model: 'donations'
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

    payment_method: {
        type: DataTypes.JSONB,
        allowNull: false
    },

    provider: {
        type: DataTypes.STRING,
        defaultValue: 'paymongo'
    },

    external_referrence: {
        type: DataTypes.STRING,
    },

    payment_status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED'),
        defaultValue: 'PENDING'
    },

    paid_at: {
        type: DataTypes.DATE
    },

    metadata: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'PaymentMethod',
    tableName: 'payment_method',
    timestamps: true,
    paranoid: false
})

export default PaymentMethod