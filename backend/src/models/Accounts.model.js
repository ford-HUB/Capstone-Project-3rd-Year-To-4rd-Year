import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"

class Accounts extends Model {}

Accounts.init({
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    is_whitelisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    sequelize: db,
    modelName: 'Accounts',
    tableName: 'accounts',
    timestamps: true
})

export default Accounts