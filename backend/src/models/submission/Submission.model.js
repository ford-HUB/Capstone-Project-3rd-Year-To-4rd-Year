import { Model, DataTypes } from "sequelize";
import { db } from "../../config/db.js";

class Submission extends Model {}

Submission.init({
    submission_id: {
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

    submission_type: {
        type: DataTypes.ENUM('Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance'),
        allowNull: false,
        validate: {
            isIn: [['Annual', 'Monthly', 'Quarterly', 'Special', 'Compliance']]
        }
    },

    file_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    public_url: {
        type: DataTypes.STRING,
        allowNull: false
    },

    file_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    file_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    submitted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
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

    status: {
        type: DataTypes.ENUM('submitted', 'under_review', 'approved', 'rejected'),
        defaultValue: 'submitted',
        allowNull: false,
        validate: {
            isIn: [['submitted', 'under_review', 'approved', 'rejected']]
        }
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Submission',
    tableName: 'submissions',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
        {
            fields: ['submission_type']
        },
        {
            fields: ['department_id']
        },
        {
            fields: ['submitted_by']
        },
        {
            fields: ['status']
        },
        {
            fields: ['is_active']
        }
    ]
});

export default Submission;
