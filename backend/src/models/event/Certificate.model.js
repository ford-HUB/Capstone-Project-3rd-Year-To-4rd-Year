import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Certificate extends Model {}

Certificate.init({
    certificate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'volunteer',
        key: 'volunteer_id'
        }
    },

    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'event',
        key: 'event_id'
        }
    },

    ct_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: 'certificate_template',
        key: 'ct_id'
        }
    },

    cert_uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
    },

    pdf_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    issued_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    expiry_date: {
        type: DataTypes.DATE,
        allowNull: true
    },

    series_id: {
        type: DataTypes.STRING,
        allowNull: true
    },

    cert_title: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
  sequelize: db,
  modelName: 'Certificate',
  tableName: 'certificates',
  timestamps: true
});

export default Certificate;
