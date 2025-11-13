import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

class Certificate extends Model {}

Certificate.init({
    certificate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    participant_type: {
        type: DataTypes.ENUM('volunteer', 'staff', 'assistant_coordinator', 'coordinator', 'director'),
        defaultValue: 'volunteer',
        allowNull: false
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

    type: {
        type: DataTypes.ENUM('appreciation', 'recognation'),
        defaultValue: 'appreciation'
    },

    img_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    pdf_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    issued_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    
    director_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'director_id',
            model: 'director'
        }
    },

    additional_signatory_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
