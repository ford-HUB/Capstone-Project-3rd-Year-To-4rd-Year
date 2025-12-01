import { DataTypes,Model } from "sequelize";
import { db } from "../../config/db.js";

class GraduatedYear extends Model { }

GraduatedYear.init({
    gy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    year: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }

}, {
    sequelize: db,
    modelName: 'GraduatedYear',
    tableName: 'graduated_year',
    timestamps: true
})

export default GraduatedYear