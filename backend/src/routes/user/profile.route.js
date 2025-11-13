import express from "express"

// @ User Schema
import { add_interestSchema } from "../../validators/event.validator.js"
import { updateProfileSchema, emailUpdateSchema, participantPasswordChangeSchema } from "../../validators/user.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { addInterest, checkInterest, updateInterest } from "../../controllers/user/event.controller.js"
import { currentUserProfile, updateUserProfile, updateEmailAccount, undoEmailChanges, changeParticipantPassword } from "../../controllers/user/profile.controller.js"

const profileRouter = express.Router()

profileRouter.post('/add-interest', guard('student'), validateRequest(add_interestSchema), addInterest)
profileRouter.put('/update-interest', guard('student'), validateRequest(add_interestSchema), updateInterest)
profileRouter.get('/check-interest', guard('student'), checkInterest)

profileRouter.get('/current-profile', guard('student'), currentUserProfile)
profileRouter.put('/update-profile', guard('student'), validateRequest(updateProfileSchema), updateUserProfile)
profileRouter.put('/update-account-email', guard('student'), validateRequest(emailUpdateSchema), updateEmailAccount)
profileRouter.put('/undo-email-changes', guard('student'), undoEmailChanges)
profileRouter.put('/change-password', guard('student'), validateRequest(participantPasswordChangeSchema), changeParticipantPassword)

profileRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default profileRouter