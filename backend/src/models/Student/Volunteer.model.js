import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Volunteer extends Model {}

Volunteer.init({
    volunteer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'student',
            key: 'student_id'
        }
    },

    department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'department',
            key: 'department_id'
        }
    },

    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'course',
            key: 'course_id'
        }
    },

    yl_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'year_level',
            key: 'yl_id'
        }
    },

    interested_events: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },

    total_hours_volunteered: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Volunteer',
    tableName: 'volunteer',
    timestamps: true
})

export default Volunteer

