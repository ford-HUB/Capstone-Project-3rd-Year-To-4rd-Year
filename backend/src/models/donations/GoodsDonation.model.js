import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class GoodsDonation extends Model { }

GoodsDonation.init({
    goods_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    donation_id: {
        type: DataTypes.INTEGER,
        references: {
            key: 'donation_id',
            model: 'donations'
        }
    },


    type_goods: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    
    detailed_description: {
        type: DataTypes.STRING,
        allowNull: false
    },

    quantity: {
        type: DataTypes.STRING,
        allowNull: false
    },

    condition: {
        type: DataTypes.STRING,
        allowNull: true
    },

    drop_off_location: {
        type: DataTypes.STRING,
        defaultValue: 'UCLM Front Gate 1'
    },

    preferred_date: {
        type: DataTypes.STRING,
        allowNull: false
    },

    preferred_time: {
        type: DataTypes.STRING,
        allowNull : false
    }
}, {
    sequelize: db,
    modelName: 'GoodsDonation',
    tableName: 'goods_donation',
    timestamps: true
})

export default GoodsDonation