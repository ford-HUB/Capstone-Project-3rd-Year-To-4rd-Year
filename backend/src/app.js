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
import donorProfileRouter from './routes/donor/profile.route.js'
import manageUsersRouter from './routes/director/manage.users.route.js'
import donationRouter from './routes/donation/donation.route.js'
import certificateRouter from './routes/certificate/certificate.route.js'
import attendRouter from './routes/attendance/attend.route.js'
import registerEventRouter from './routes/director/event.route.js'
import managementEvent from './routes/management/event.route.js'
import managementOverviewRouter from './routes/management/overview.route.js'
import notificationRouter from './routes/notification/notif.route.js'
import manageVolunteerRouter from './routes/director/manage.volunteer.route.js'
import documentRouter from './routes/document/document.route.js'
import eventEvaluationRouter from './routes/feedback/eventEvaluationRouter.route.js'
import beneficiaryEvaluationRouter from './routes/feedback/beneficiaryEvaluationRouter.route.js'
import formRouter from './routes/form/form.route.js'
import formV2Router from './routes/form/v2/form.route.js'
import requirementsRouter from './routes/requirements/requirements.route.js'
import submissionRouter from './routes/submission/submission.route.js'
import proofUploadRouter from './routes/event/proofUpload.routes.js'
import beneficiaryEventRouter from './routes/beneficiary/event.route.js'
import beneficiaryProfileRouter from './routes/beneficiary/profile.route.js'
import manageBeneficiaryRouter from './routes/director/manage.beneficiary.route.js'
import systemPerformanceRouter from './routes/director/systemPerformance.route.js'
import documentRequestApprovalRouter from './routes/director/documentRequestApproval.route.js'
import paymentRouter from './routes/donation/payment.route.js'
import paymentDirectorRouter from './routes/director/payment.route.js'
import webhookPaymentRouter from './routes/webhook/payment/webhook.payment.route.js'
import donationTrackingRouter from './routes/director/donationTracking.route.js'
import statisticsRouter from './routes/director/statistics.route.js'
import guestEventRouter from './routes/guest/event.route.js'
import testimonialRouter from './routes/testimonial/testimonial.route.js'


// @ Middleware
import { updateUserActivity } from './middleware/updateActivity.js'

import dotenv from 'dotenv'

dotenv.config()


const app = express()

// Trust proxy for secure cookies behind reverse proxies (e.g., Nginx)
app.set('trust proxy', 1)

app.use(cookieParser())

app.use('/api/v1/webhook/payment', webhookPaymentRouter)

app.use(express.json())

app.use(cors({
    origin: process.env.NODE_ENV === 'development'
        ? [process.env.FRONT_END_URL]
        : [process.env.FRONTEND_URL_PROD, process.env.FRONTEND_URL_SEC_PROD].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Trust proxy for secure cookies behind reverse proxies
    name: 'connect.sid', // Session cookie name
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000 // 24 hours (session only used during OAuth flow)
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// Update user activity on every request
app.use(updateUserActivity)


// @ Default Endpoint
app.use('/api/user-auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/participate', participateRouter)

app.use('/api/donor-auth', authDonorRouter)
app.use('/api/donor', donorProfileRouter)

app.use('/api/ai', matchRouter)

app.use('/api/event', eventRouter)

app.use('/api/certificate', certificateRouter)

app.use('/api/document', documentRouter)

app.use('/api/notification', notificationRouter)

app.use('/api/event-evaluation', eventEvaluationRouter)
app.use('/api/beneficiary-evaluation', beneficiaryEvaluationRouter)

app.use('/api/attendance', attendRouter)

app.use('/api/donation', donationRouter)

app.use('/api/management-auth', managementAuthRouter)
app.use('/api/management-profile', managementProfile)
app.use('/api/management-event', managementEvent)
app.use('/api/management', managementOverviewRouter)

app.use('/api/director-auth', authDirectorRouter)
app.use('/api/director-manage', manageApprovalRouter)
app.use('/api/director-manage-user', manageUsersRouter)
app.use('/api/director-manage-volunteer', manageVolunteerRouter)
app.use('/api/director/manage-beneficiary', manageBeneficiaryRouter)
app.use('/api/director-profile', directorProfileRouter)
app.use('/api/director-event', registerEventRouter)
app.use('/api/v1/payment/director', paymentDirectorRouter)
app.use('/api/requirements', requirementsRouter)
app.use('/api/submissions', submissionRouter)

app.use('/api/form', formRouter)
app.use('/api/form/v2', formV2Router)
app.use('/api/event-proof', proofUploadRouter)
app.use('/api/beneficiary-events', beneficiaryEventRouter)
app.use('/api/beneficiary', beneficiaryProfileRouter)
app.use('/api/director/system-performance', systemPerformanceRouter)
app.use('/api/director/document-request-approval', documentRequestApprovalRouter)
app.use('/api/event-donations', donationTrackingRouter)
app.use('/api/director/statistics', statisticsRouter)

app.use('/api/v1/payment', paymentRouter)

app.use('/api/guest', guestEventRouter)
app.use('/api/testimonial', testimonialRouter)

app.get('/health', (req, res) => {
    res.json({ success: true, status: 'Health check is OK', timestamp: new Date() })
})

export default app