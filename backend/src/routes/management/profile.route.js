import express from "express"

// @ User Schema
import { profileInfoSchema, addressSchema, updateEmailSchema, updatePasswordSchema } from "../../validators/management.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"
import { upload } from "../../middleware/cloudinaryUpload.js"


// @ Controllers
import { createOrUpdateInfo, createOrUpdateAddress, updateAccountEmailAvatar, updatePassword } from "../../controllers/management/profile.controller.js"

const managementProfile = express.Router()

managementProfile.post('/add-profile', validateRequest(profileInfoSchema), guard('staff', 'coordinator'), createOrUpdateInfo)
managementProfile.post('/add-address', validateRequest(addressSchema), guard('staff', 'coordinator'), createOrUpdateAddress)
managementProfile.put('/update-email-avatar', validateRequest(updateEmailSchema), guard('staff','coordinator'), upload.single('avatar'), updateAccountEmailAvatar)
managementProfile.put('/update-password', validateRequest(updatePasswordSchema), guard('staff', 'coordinator'), updatePassword)



managementProfile.get('/testing', (req, res) => {
    res.send("routes working")
})

export default managementProfile