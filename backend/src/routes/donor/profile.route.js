import express from "express"

// @ Donor Profile Schema
import { updateProfileSchema, changePasswordSchema } from "../../validators/donorProfile.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { getProfile, updateProfile, getDonorStats, changePassword } from "../../controllers/donor/profile.controller.js"

const donorProfileRouter = express.Router()

// Get donor profile
donorProfileRouter.get('/profile', guard('donor'), getProfile)

// Update donor profile
donorProfileRouter.put('/profile', guard('donor'), validateRequest(updateProfileSchema), updateProfile)

// Get donor statistics
donorProfileRouter.get('/stats', guard('donor'), getDonorStats)

// Change password
donorProfileRouter.put('/change-password', guard('donor'), validateRequest(changePasswordSchema), changePassword)

export default donorProfileRouter
