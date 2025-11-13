import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Form extends Model {}

Form.init({
    form_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'category',
            key: 'category_id'
        }
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'event',
            key: 'event_id'
        }
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    form_schema: {
        type: DataTypes.JSON,
        allowNull: false
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    target_role: {
        type: DataTypes.ENUM('volunteer', 'beneficiary'),
        defaultValue: 'volunteer',
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Form',
    tableName: 'forms',
    timestamps: true
})

export default Form
