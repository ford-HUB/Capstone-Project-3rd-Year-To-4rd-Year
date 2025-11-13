import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Student extends Model {}

Student.init({
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    student_number : {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    gender: {
        type: DataTypes.CHAR,
        allowNull: false
    },

    middle_initial: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10, 11]
        }
    },

    current_address: {
        type: DataTypes.STRING,
        allowNull: false
    },

    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    disability: {
        type: DataTypes.STRING,
        defaultValue: 'prefer not to say',
        allowNull: true
    },

    disability_specification: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    student_image_id : {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },

    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'course',
            key: 'course_id'
        }
    },

    department_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'department',
            key: 'department_id'
        }
    },

    strand_course_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: 'strand_course_id',
            model: 'strand_course'
        }
    },
    
    yl_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'year_level',
            key: 'yl_id'
        }
    }
}, {
    sequelize: db,
    modelName: 'Student',
    tableName: "student",
    timestamps: true
})

export default Student