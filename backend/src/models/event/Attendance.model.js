import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Attendance extends Model {}

Attendance.init({
    attendance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'volunteer',
            key: 'volunteer_id'
        }
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'event',
            key: 'event_id'
        }
    },

    time_in: {
        type: DataTypes.DATE,
        allowNull: true
    },

    time_out: {
        type: DataTypes.DATE,
        allowNull: true
    },

    method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'qr'
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Attendance',
    tableName: 'attendance',
    timestamps: true
})

export default Attendance