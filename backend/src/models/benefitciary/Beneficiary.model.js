import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Beneficiary extends Model { }

Beneficiary.init({
    beneficiary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        references: {
            key: 'account_id',
            model: 'accounts'
        }
    },

    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },

    gender: {
        type: DataTypes.CHAR,
        allowNull: false
    },

    middle_initial: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10, 11]
        }
    },

    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    current_address: {
        type: DataTypes.STRING,
        allowNull: false
    },

    organization_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'If the beneficiary represents an organization'
    }

}, {
    sequelize: db,
    tableName: 'beneficiary',
    modelName: 'Beneficiary',
    timestamps: true
})

export default Beneficiary