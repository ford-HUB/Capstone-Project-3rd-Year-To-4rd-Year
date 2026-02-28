import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Donor extends Model { }

Donor.init({
    donor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    xendit_customer_id: {
        type: DataTypes.STRING,
        allowNull: true
    },

    fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },

    provider_id: {
        type: DataTypes.STRING,
        allowNull: false
    },

    auth_provider: {
        type: DataTypes.STRING,
        allowNull: false
    },

    profile_image: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

}, {
    sequelize: db,
    tableName: 'donor',
    modelName: 'Donor',
    timestamps: true
})

export default Donor
