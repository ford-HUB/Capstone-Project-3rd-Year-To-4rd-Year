import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"

class Role extends Model {}

Role.init({
    role_id: {
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

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Role',
    tableName: 'role',
    timestamps: true
})

export default Role