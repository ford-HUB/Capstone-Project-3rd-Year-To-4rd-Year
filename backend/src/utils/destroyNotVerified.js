import cron from 'node-cron'
import { Op } from 'sequelize'
import models from '../models/index.js'

cron.schedule('*/1 * * * *', async () => {
    console.log('every 1 min running to kill unverified Account')

    try {
        const { VerificationCodes, Accounts, Student, StudentDepartment, Department } = models

        const now = new Date()
        const expiredCodes = await VerificationCodes.findAll({ where: { expires_at: { [Op.lt]: now }, used: false } })

        for (const code of expiredCodes) {

            const studentDepartment = await StudentDepartment.findOne({ where: { student_id: code.account_id } })
            await StudentDepartment.destroy({ where: { student_id: code.account_id } })
            await Department.destroy({ where: { department_id: studentDepartment.department_id } })
            await Student.destroy({ where: { account_id: code.account_id } })
            await Accounts.destroy({ where: { account_id: code.account_id }});
            console.log(`cron Deleted account_id: ${code.account_id}`);
        }

        console.log('cron cleanup complete.');

    } catch (error) {
        console.log('cron failed: ', error.message)
    }
})