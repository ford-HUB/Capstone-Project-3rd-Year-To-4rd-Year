import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Certificate_Template extends Model { }

Certificate_Template.init({
    ct_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'category',
            key: 'category_id'
        }
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.ENUM('recognation', 'appreciation'),
        defaultValue: 'appreciation'
    },

    html_raw_template: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    sequelize: db,
    modelName: 'Certificate_Template',
    tableName: 'certificate_template',
    timestamps: true
})

export default Certificate_Template