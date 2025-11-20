import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Testimonials extends Model {}

Testimonials.init({
    testimonial_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },

    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rating: {
        type: DataTypes.NUMBER,
        allowNull: false
    },

    message: {
        type: DataTypes.TEXT,
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