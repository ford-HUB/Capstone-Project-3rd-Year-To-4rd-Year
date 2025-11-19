import app from "./app.js"
import dotenv from 'dotenv'
import http from 'http'
import { initSocket } from './socket.js'
import { testConnection, dropTables, updateSchemaChanges } from './config/db.js'
import fetch from 'node-fetch';

// Import the cron job to start it
import './cron/realtimeStatus.js'
import './cron/notificationPusher.js'
import './cron/certificateGenerator.js'
import './cron/totalHourUpdater.js'
import './cron/eventMatchingProcessor.js'
import './cron/userStatusUpdater.js'
import './cron/formPusher.js'
import './cron/paymentStatusUpdater.js'
import './cron/registrationStatusUpdater.js'
import './cron/donationStatusUpdater.js'
import './cron/upcomingEventEmailer.js'
import './cron/beneficiaryCountUpdater.js'

// checking policies of supabase
import { testPolicies } from "./utils/fileUpdateSupabase.js"

// import { simpleTest, debugEmailSetup } from "./config/transporter.js"


dotenv.config()

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
    testConnection()
    // updateSchemaChanges()
    // dropTables()
    // simpleTest()
    // debugEmailSetup()
})