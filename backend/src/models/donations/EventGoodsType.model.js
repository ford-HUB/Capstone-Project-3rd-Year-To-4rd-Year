import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class EventGoodsType extends Model { }

EventGoodsType.init({
    event_goods_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'event_id',
            model: 'event'
        },
        onDelete: 'CASCADE'
    },

    goods_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['ready_to_eat_food', 'hygiene_kits', 'baby_needs', 'bottled_water', 'blankets_towels', 'emergency_kits', 'medicine']],
                msg: 'Invalid goods type'
            }
        }
    }
}, {
    sequelize: db,
    modelName: 'EventGoodsType',
    tableName: 'event_goods_type',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['event_id', 'goods_type']
        }
    ]
})

export default EventGoodsType

