import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Category extends Model {}

Category.init({
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
}, {
    sequelize: db,
    modelName: 'Category',
    tableName: 'category',
    timestamps: true
})

export default Category