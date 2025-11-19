import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Testimonials extends Model {}

Testimonials.init({
    testimonial_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },

    rating: {
        type: DataTypes.NUMBER,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },

    initials: {
        type: DataTypes.STRING,
        allowNull: true
    },

    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db,
    modelName: 'Testimonials',
    tableName: 'testimonials',
    timestamps: true
})

export default Testimonials