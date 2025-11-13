import { db } from "../../config/db.js";
import { DataTypes, Model } from "sequelize";

class MatchedEvent extends Model { }

MatchedEvent.init({
    matched_event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'volunteer',
            key: 'volunteer_id'
        }
    },

    beneficiary_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'beneficiary',
            key: 'beneficiary_id'
        }
    },

    matched_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        comment: 'Combined array of near_you and almost_near_you event IDs for beneficiaries'
    },

    recommendation_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        defaultValue: [],
        comment: 'Array of recommended event IDs for discovery'
    },

    near_you_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
        comment: 'Event IDs in the same city as beneficiary (beneficiary-specific)'
    },

    almost_near_you_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
        comment: 'Event IDs in nearby cities/provinces (beneficiary-specific)'
    },

    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    cache_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize: db,
    tableName: 'matched_events',
    modelName: 'MatchedEvent',
    timestamps: true,
    indexes: [
        {
            fields: ['volunteer_id']
        },
        {
            fields: ['beneficiary_id']
        },
        {
            fields: ['last_updated']
        },
        {
            fields: ['cache_expires_at']
        }
    ]
})

export default MatchedEvent