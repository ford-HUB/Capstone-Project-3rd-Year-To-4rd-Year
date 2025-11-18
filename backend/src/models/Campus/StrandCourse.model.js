import { db } from "../../config/db.js";
import { DataTypes, Model } from "sequelize";

class StrandCourse extends Model { }

StrandCourse.init({
    strand_course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    sequelize: db,
    tableName: 'strand_course',
    modelName: 'StrandCourse',
    timestamps: true
})

export default StrandCourse