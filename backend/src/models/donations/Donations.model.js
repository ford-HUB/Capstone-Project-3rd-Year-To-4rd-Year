import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Donations extends Model { }

Donations.init({
    donation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: 'event_id',
            model: 'event'
        }
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: 'account_id',
            model: 'accounts'
        }
    },

    donation_type: {
        type: DataTypes.ENUM('GOODS', 'MONEY')
    },

    status: {
        type: DataTypes.ENUM('PENDING', 'RECEIVED', 'DISTRIBUTED', 'COMPLETED')
    },

    remark: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    mail_reciept: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    
}, {
    sequelize: db,
    modelName: 'Donations',
    tableName: 'donations',
    timestamps: true,
    paranoid: false
})

export default Donations