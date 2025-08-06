import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class PaymentInfo extends Model { }

PaymentInfo.init({
    payment_info_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    director_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'director',
            key: 'director_id'
        }
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    number: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'PaymentInfo',
    tableName: 'payment_info',
    timestamps: true
})

export default PaymentInfo