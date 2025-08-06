import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"

class Department extends Model {}

Department.init({
    department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    department_name: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: db,
    modelName: 'Department',
    tableName: 'department',
    timestamps: true
})

export default Department