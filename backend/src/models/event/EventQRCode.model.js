import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class EventQRCode extends Model {}

EventQRCode.init({
  qrcode_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'event', 
      key: 'event_id'
    }
  },

  type: {
    type: DataTypes.ENUM('in', 'out'),
    allowNull: false,
  },

  qrcode_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  token: {
    type: DataTypes.STRING,
    allowNull: true
  },

  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  sequelize: db,
  modelName: 'EventQRCode',
  tableName: 'event_qrcodes',
  timestamps: true 
});

export default EventQRCode;
