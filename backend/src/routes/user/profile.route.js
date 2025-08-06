import express from "express"

// @ User Schema
import { add_interestSchema } from "../../validators/event.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRole } from "../../static/allowedStaffRole.js"

// @ Controllers
import { addInterest, checkInterest, updateInterest } from "../../controllers/user/event.controller.js"

const profileRouter = express.Router()

profileRouter.post('/add-interest', guard(...allowedRole), validateRequest(add_interestSchema), addInterest)
profileRouter.put('/update-interest', guard(...allowedRole), validateRequest(add_interestSchema), updateInterest)
profileRouter.get('/check-interest', guard(...allowedRole), checkInterest)


profileRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default profileRouter