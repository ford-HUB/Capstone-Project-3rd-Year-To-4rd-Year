import express from "express"

// @ Middleware
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { ListUsers, deleteUser } from "../../controllers/director/manage.user.controller.js"

const manageUsersRouter = express.Router()

manageUsersRouter.get('/list-users', guard('director'), ListUsers)
manageUsersRouter.delete('/delete-user/:userId', guard('director'), deleteUser)

manageUsersRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default manageUsersRouter