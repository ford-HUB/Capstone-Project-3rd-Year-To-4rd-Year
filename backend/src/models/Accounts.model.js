import { DataTypes, Model } from "sequelize"
import { db } from "../config/db.js"
import AccountUpdateLog from "./AccountUpdateLog.model.js"

class Accounts extends Model {}

Accounts.init({
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    is_deactivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    activeAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },

}, {
    sequelize: db,
    modelName: 'Accounts',
    tableName: 'accounts',
    timestamps: true,
    paranoid: true // allow us to soft delete the data
})

// this is auto audit every updates of account they made
Accounts.addHook('afterUpdate', async (account, options) => {
    if(account.changed('email')) {
        const oldEmail = account.previous('email')
        const newEmail = account.get('email')

        await AccountUpdateLog.create({
            account_id: account.account_id,
            old_email: oldEmail,
            new_email: newEmail,
            status: 'pending'
        })
    }else if(account.changed('password')) {
        const oldPassword = account.previous('password')
        const newPassword = account.get('password')

        await AccountUpdateLog.create({
            account_id: account.account_id,
            old_password: oldPassword,
            new_password: newPassword,
            status: 'pending'
        })
    }
})


export default Accounts