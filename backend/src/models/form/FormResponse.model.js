import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class FormResponse extends Model {}

FormResponse.init({
    response_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    form_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'forms',
            key: 'form_id'
        }
    },

    respondent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    response_data: {
        type: DataTypes.JSON,
        allowNull: false
    },

    submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

}, {
    sequelize: db,
    modelName: 'FormResponse',
    tableName: 'form_responses',
    timestamps: true
})

export default FormResponse
