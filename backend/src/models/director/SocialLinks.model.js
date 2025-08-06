import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class SocialLinks extends Model { }

SocialLinks.init({
    social_links_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    facebook: {
        type: DataTypes.STRING,
        allowNull: true
    },

    insta: {
        type: DataTypes.STRING,
        allowNull: true
    },

    linkedin: {
        type: DataTypes.STRING,
        allowNull: true
    },

    X: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'SocialLinks',
    tableName: 'social_links',
    timestamps: true
})

export default SocialLinks