import { db } from "../../../config/db.js";
import { DataTypes, Model } from "sequelize";

class FormLink extends Model { }

FormLink.init({
    formlink_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    event_id: {
        type: DataTypes.INTEGER,
        references: {
            key: 'event_id',
            model: 'event'
        }
    },

    target_role: {
        type: DataTypes.ENUM('volunteer', 'beneficiary'),
        defaultValue: 'volunteer',
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    form_link: {
        type: DataTypes.STRING,
        allowNull: false
    },

    sheet_link: {
        type: DataTypes.STRING,
        allowNull: true
    },

    form_mail_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            key: 'account_id',
            model: 'accounts'
        }
    }
}, {
    sequelize: db,
    modelName: 'FormLink',
    tableName: 'form_link',
    timestamps: true
})

export default FormLink