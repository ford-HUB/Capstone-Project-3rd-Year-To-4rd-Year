import { db } from "../../config/db.js";
import { DataTypes, Model } from "sequelize";

class BeneficiaryEventEvaluation extends Model { }

BeneficiaryEventEvaluation.init({
    beneficiary_evaluation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    beneficiary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'beneficiary_id',
            model: 'beneficiary'
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

    event_organization: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    venue_quality: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    staff_support: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    event_content: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    most_helpful: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    least_helpful: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    suggestions: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A',
        allowNull: true
    },

    would_recommend: {
        type: DataTypes.ENUM("Definitely", "Probably", "Maybe", "Probably Not", "Definitely Not"),
        allowNull: false
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

    share_testimonial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'BeneficiaryEventEvaluation',
    tableName: 'beneficiary_event_evaluation',
    timestamps: true
})

export default BeneficiaryEventEvaluation
