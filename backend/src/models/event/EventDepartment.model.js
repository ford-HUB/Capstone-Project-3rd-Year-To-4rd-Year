import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class EventDepartment extends Model {}

EventDepartment.init({
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        references: {
            model: 'event',
            key: 'event_id'
        }
    },

    department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        references: {
            model: 'department',
            key: 'department_id'
        }
    }
}, {
    sequelize: db,
    modelName: 'EventDepartment',
    tableName: 'event_department',
    timestamps: true
})

export default EventDepartment