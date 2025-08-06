import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js";

class EventCategory extends Model {}

EventCategory.init({
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'event',
      key: 'event_id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'category',
      key: 'category_id'
    }
  }
}, {
  sequelize: db,
  modelName: 'EventCategory',
  tableName: 'event_category',
  timestamps: false
});

export default EventCategory