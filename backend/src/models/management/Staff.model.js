import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Staff extends Model {}

Staff.init({
    staff_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    firstname: {
        type: DataTypes.STRING,
        allowNull: true
    },

    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },

    middle_initial: {
        type: DataTypes.STRING,
        allowNull: true
    },

    gender: {
        type: DataTypes.CHAR,
        allowNull: true
    },

    email_address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [10, 11]
        }
    },

    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },

    province: {
        type: DataTypes.STRING,
        allowNull: true
    },

    city: {
        type: DataTypes.STRING,
        allowNull: true
    },

    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    brgy: {
        type: DataTypes.STRING,
        allowNull: true
    },

    profile_image: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },

    signature_img: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: 'Staff',
    tableName: 'staff',
    timestamps: true
})

export default Staff