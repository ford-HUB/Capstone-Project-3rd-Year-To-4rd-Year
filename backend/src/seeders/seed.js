import models from "../models/index.js"
import { db } from "../config/db.js"
import bcrypt from 'bcrypt'


const accountDirector = async () => {
    const t = await db.transaction()
    try {
        const { 
            Accounts,
            Role,
            AuditLog
        } = models

        let salt = await bcrypt.genSalt(10)
        const hashPassword = bcrypt.hash(process.env.DIRECTOR_PASS_ACCESS, salt)

        const director = await Accounts.create({
            email: process.env.DIRECTOR_EMAIL_ACCESS,
            password: hashPassword

        }, { transaction: t })

        await Role.create({
            account_id: director.account_id,
            name: 'director',
            description: 'This Role Have Internal Access Of Confidentials Information And Have Access Control To Manage'
        }, { transaction: t })

        await AuditLog.create({
            account_id: director.account_id,
            action: 'Seeding Director Account',
            target_id: director.account_id,
            details: {
                explain: 'we created an account of director using manually method seeding it'
            }
        }, { transaction: t })

        await t.commit()
        console.log('Director Account Access Has Created!')

    } catch (error) {
        await t.rollback()
        console.log('seed admin failed to add: ', error.message)
    }
}

accountDirector()