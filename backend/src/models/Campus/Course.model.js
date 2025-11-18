import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Course extends Model {}

Course.init({
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    course_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Course',
    tableName: 'course',
    timestamps: true
})

export default Course