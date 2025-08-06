import { Sequelize } from "sequelize"
import dotenv from 'dotenv'
dotenv.config()

const db = new Sequelize(
    {
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        host: 'localhost',
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres',
        logging: false, // this will disable the console raw data display
        pool: {
        max: 5,         // Max number of connections allowed at once
        min: 0,         // Min number of connections Sequelize keeps alive (even if idle)
        acquire: 30000, // Max time (ms) Sequelize will try to get a connection before throwing error
        idle: 10000     // How long (ms) a connection can be idle before being released
        }
    }
)

const testConnection = async () => {
    try {
        await db.authenticate()
        console.log('postgres database connected')
    } catch (error) {
        console.log(error.message)
    }
}

const dropTables = async () => {
    try {
        await db.sync({force: true})
        console.log('all tables successfully dropped')
    } catch (error) {
        console.log('drop tables failed:', error.message)
    }
}

export {
    db,
    testConnection,
    dropTables
}
