import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Organizer extends Model {}

Organizer.init({
    organizer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize: db,
    modelName: 'Organizer',
    tableName: 'organizer',
    timestamps: true
})

export default Organizer