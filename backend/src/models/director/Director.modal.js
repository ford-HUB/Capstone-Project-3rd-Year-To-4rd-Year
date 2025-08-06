import { DataTypes, Model } from "sequelize"
import { db } from "../../config/db.js"

class Director extends Model { }

Director.init({
    director_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'accounts',
            key: 'account_id'
        }
    },

    social_links_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'social_links',
            key: 'social_links_id'
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

    email_address: {
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

    role_bio: {
        type: DataTypes.STRING,
        allowNull: false
    },

    school: {
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
    }
}, {
    sequelize: db,
    modelName: 'Director',
    tableName: 'director',
    timestamps: true
})

export default Director