import { Model, DataTypes } from "sequelize";
import { db } from "../../config/db.js";

class RequirementVisibility extends Model {}

RequirementVisibility.init({
    visibility_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    requirement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'requirements',
            key: 'requirement_id'
        }
    },

    role: {
        type: DataTypes.ENUM('staff', 'coordinator', 'management'),
        allowNull: false,
        validate: {
            isIn: [['staff', 'coordinator', 'management']]
        }
    }

}, {
    sequelize: db,
    modelName: 'RequirementVisibility',
    tableName: 'requirements_visibility',
    timestamps: true,
    indexes: [
        {
            fields: ['requirement_id']
        },
        {
            fields: ['role']
        },
        {
            unique: true,
            fields: ['requirement_id', 'role'],
            name: 'unique_requirement_role'
        }
    ]
});

export default RequirementVisibility;
