import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class DocumentRequestApproval extends Model {}

DocumentRequestApproval.init({
    dra_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'documents',
            key: 'document_id'
        }
    },

    requested_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    request_type: {
        type: DataTypes.ENUM,
        values: ['approval', 'revision', 'publication'],
        allowNull: false,
        defaultValue: 'approval'
    },

    request_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'rejected', 'needs_revision'],
        allowNull: false,
        defaultValue: 'pending'
    },

    reviewed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    review_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    priority: {
        type: DataTypes.ENUM,
        values: ['low', 'medium', 'high', 'urgent'],
        allowNull: false,
        defaultValue: 'medium'
    },

    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    sequelize: db,
    modelName: 'DocumentRequestApproval',
    tableName: 'document_request_approvals',
    timestamps: true,
    paranoid: true // Enable soft delete
})

export default DocumentRequestApproval
