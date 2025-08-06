import express from 'express'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'

// @routes
import authRouter from './routes/user/auth.route.js'
import managementAuthRouter from './routes/management/auth.route.js'
import managementProfile from './routes/management/profile.route.js'
import manageApprovalRouter from './routes/director/manage.approval.route.js'
import authDirectorRouter from './routes/director/auth.route.js'
import directorProfileRouter from './routes/director/profile.route.js'
import eventRouter from './routes/event/event.route.js'
import profileRouter from './routes/user/profile.route.js'
import matchRouter from './routes/user/match.route.js'
import participateRouter from './routes/user/participate.route.js'
import authDonorRouter from './routes/donor/auth.route.js'
import manageUsersRouter from './routes/director/manage.users.route.js'
import donationRouter from './routes/donation/donation.route.js'
import certificateRouter from './routes/event/certificate.route.js'
import attendRouter from './routes/attendance/attend.router.js'

import dotenv from 'dotenv'

dotenv.config()


const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: `http://localhost:${process.env.FRONT_END_PORT}`,
    credentials: true
}))

app.use(session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV !=='development'}
}))

app.use(passport.initialize())
app.use(passport.session())


// @ Default Endpoint
app.use('/api/user-auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/participate', participateRouter)

app.use('/api/donor-auth', authDonorRouter)

app.use('/api/ai', matchRouter)

app.use('/api/event', eventRouter)

app.use('/api/certificate', certificateRouter)

app.use('/api/attendance', attendRouter)

app.use('/api/donation', donationRouter)

app.use('/api/management-auth', managementAuthRouter)
app.use('/api/management-profile', managementProfile)

app.use('/api/director-auth', authDirectorRouter)
app.use('/api/director-manage', manageApprovalRouter)
app.use('/api/director-manage-user', manageUsersRouter)
app.use('/api/director-profile', directorProfileRouter)

export default app