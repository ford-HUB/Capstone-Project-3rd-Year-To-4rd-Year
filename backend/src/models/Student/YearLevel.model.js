import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class YearLevel extends Model {}

YearLevel.init({
    yl_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    year_level: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize: db,
    modelName: 'YearLevel',
    tableName: 'year_level',
    timestamps: true
})

export default YearLevel