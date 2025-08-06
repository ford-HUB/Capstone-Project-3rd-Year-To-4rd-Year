import app from "./app.js"
import dotenv from 'dotenv'
import { testConnection, dropTables } from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
    testConnection()
    // dropTables()
})