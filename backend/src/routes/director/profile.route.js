import express from "express"

// @ Schema
import { InfoSchema, addressSchema, directorEmailSchema, directorPasswordSchema } from "../../validators/director.validator.js"

// @ Middleware
import { guard } from "../../middleware/guard.js"
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { upload } from "../../middleware/cloudinaryUpload.js"
// @ Controllers
import { getCurrentProfile, createOrUpdateDirectorInformation, createOrUpdateDirectorAddress, updateAccountEmailAvatar, updatePassword, updateSignature } from "../../controllers/director/profile.controller.js"

const directorProfileRouter = express.Router()

directorProfileRouter.get('/get-current-profile', guard('director'), getCurrentProfile)
directorProfileRouter.post('/add-director-info', validateRequest(InfoSchema), guard('director'), createOrUpdateDirectorInformation)
directorProfileRouter.post('/add-director-address', validateRequest(addressSchema), guard('director'), createOrUpdateDirectorAddress)
directorProfileRouter.put('/update-director-signing-email', upload.single('avatar'), validateRequest(directorEmailSchema), guard('director'), updateAccountEmailAvatar)
directorProfileRouter.put('/update-director-password', validateRequest(directorPasswordSchema), guard('director'), updatePassword)
directorProfileRouter.put('/update-director-signature', upload.single('signature'), guard('director'), updateSignature)


directorProfileRouter.get('/testing', (req, res) => {
    res.send("routes working")
})

export default directorProfileRouter