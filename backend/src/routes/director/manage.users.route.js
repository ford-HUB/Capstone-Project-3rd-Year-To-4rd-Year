import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ListUsers, deactivateUserAccount, softDeleteUserAccount, restoreUserAccount, listSoftDeletedUsers, restoreSoftDeletedUser, getActiveUsersCount, updateUserActivity } from "../../controllers/director/manage.user.controller.js"

const manageUsersRouter = express.Router()

manageUsersRouter.get('/list-users', guard('director'), ListUsers)
manageUsersRouter.delete('/delete-user/:userId', guard('director'), softDeleteUserAccount)
manageUsersRouter.put('/account/:id/deactivate', guard('director'), deactivateUserAccount)
manageUsersRouter.put('/account/:id/restore', guard('director'), restoreUserAccount)

// Soft-deleted listing and restore
manageUsersRouter.get('/trash', guard('director'), listSoftDeletedUsers)
manageUsersRouter.put('/trash/:id/restore', guard('director'), restoreSoftDeletedUser)

// Active users count
manageUsersRouter.get('/active-users', guard('director'), getActiveUsersCount)

// Update user activity
manageUsersRouter.put('/update-activity', guard('director'), updateUserActivity)

manageUsersRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default manageUsersRouter