import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"

class Document extends Model {}

Document.init({
    document_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    author_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    file_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    file_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    tags: {
        type: DataTypes.STRING,
        allowNull: true
    },

    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    sequelize: db,
    modelName: "Document",
    tableName: "documents",
    timestamps: true
})

export default Document