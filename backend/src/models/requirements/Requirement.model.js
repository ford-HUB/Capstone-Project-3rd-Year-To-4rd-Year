import { Model, DataTypes } from "sequelize";
import { db } from "../../config/db.js";

class Requirement extends Model {}

Requirement.init({
    requirement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 1000]
        }
    },

    due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfterToday(value) {
                if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                    throw new Error('Due date must be today or in the future');
                }
            }
        }
    },

    category: {
        type: DataTypes.ENUM('Annual Report', 'Monthly Report', 'Financial Statement', 'Compliance Document', 'Special'),
        allowNull: false,
        validate: {
            isIn: [['Annual Report', 'Monthly Report', 'Financial Statement', 'Compliance Document', 'Special']]
        }
    },

    is_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'director',
            key: 'director_id'
        }
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Requirement',
    tableName: 'requirements',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
        {
            fields: ['category']
        },
        {
            fields: ['due_date']
        },
        {
            fields: ['created_by']
        },
        {
            fields: ['is_active']
        }
    ]
});

export default Requirement;
