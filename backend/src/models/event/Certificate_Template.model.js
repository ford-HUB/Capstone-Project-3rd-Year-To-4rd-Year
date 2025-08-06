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

    html_raw_template: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    left_logo: {
        type: DataTypes.STRING,
        allowNull: true
    },

    center_logo: {
        type: DataTypes.STRING,
        allowNull: true
    },

    right_logo: {
        type: DataTypes.STRING,
        allowNull: true
    },

    signature_img: {
        type: DataTypes.STRING,
        allowNull: false
    },

    badge_img: {
        type: DataTypes.STRING,
        allowNull: true
    },

    default_cert_title: {
        type: DataTypes.STRING,
        defaultValue: 'Certificate of Completion',
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'Certificate_Template',
    tableName: 'certificate_template',
    timestamps: true
})

export default Certificate_Template