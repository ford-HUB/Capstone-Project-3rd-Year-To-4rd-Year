import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class EventQRCode extends Model {}

EventQRCode.init({
  qr_id: {
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
    allowNull: false
  },

  qrcode_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  sequelize: db,
  modelName: 'EventQRCode',
  tableName: 'event_qrcodes',
  timestamps: false 
});

export default EventQRCode;
