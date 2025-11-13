import express from "express"

// @ User Schema
import { profileInfoSchema, addressSchema, updateEmailSchema, updatePasswordSchema } from "../../validators/management.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"
import { upload } from "../../middleware/cloudinaryUpload.js"


// @ Controllers
import { createOrUpdateInfo, createOrUpdateAddress, updateAccountEmailAvatar, updatePassword, getCurrentProfile, updateSignature } from "../../controllers/management/profile.controller.js"

const managementProfile = express.Router()

managementProfile.get('/current-profile', guard('staff', 'coordinator', 'assistant_coordinator'), getCurrentProfile)
managementProfile.post('/add-profile', guard('staff', 'coordinator', 'assistant_coordinator'), validateRequest(profileInfoSchema), createOrUpdateInfo)
managementProfile.post('/add-address',guard('staff', 'coordinator', 'assistant_coordinator'), validateRequest(addressSchema), createOrUpdateAddress)
managementProfile.put('/update-email-avatar', guard('staff','coordinator', 'assistant_coordinator'), upload.single('avatar'), validateRequest(updateEmailSchema), updateAccountEmailAvatar)
managementProfile.put('/update-password', guard('staff', 'coordinator', 'assistant_coordinator'), validateRequest(updatePasswordSchema), updatePassword)
managementProfile.put('/update-signature', guard('staff', 'coordinator', 'assistant_coordinator'), upload.single('signature'), updateSignature)



managementProfile.get('/testing', (req, res) => {
    res.send("routes working")
})

export default managementProfile