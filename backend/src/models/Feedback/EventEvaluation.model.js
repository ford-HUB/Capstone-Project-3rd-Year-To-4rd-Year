import { db } from "../../config/db.js";
import { DataTypes, Model } from "sequelize";

class EventEvaluation extends Model { }

EventEvaluation.init({
    event_evaluation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    volunteer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'volunteer_id',
            model: 'volunteer'
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

    overall_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    content_quality: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    organization_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    venue_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    most_valuable: {
        type: DataTypes.STRING,
        defaultValue: 'N/A',
        allowNull: true
    },

    least_valuable: {
        type: DataTypes.STRING,
        defaultValue: 'N/A',
        allowNull: true
    },

    suggestions: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    gs_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    communication_rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    recommendEvent: {
        type: DataTypes.ENUM("Definitely", "Probably", "Maybe", "Probably Not", "Definitely Not"),
        allowNull: false
    },

    futureTopics: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    future_participation: {
        type: DataTypes.ENUM("Yes, definitely", "Yes, probably", "Maybe", "Probably not", "No"),
        allowNull: false
    },

    additional_comments: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    agree_share_testimonial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'EventEvaluation',
    tableName: 'event_evaluation',
    timestamps: true
})

export default EventEvaluation