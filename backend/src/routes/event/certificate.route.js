import express from "express"

// @ User Schema
import { certificateTemplateSchema } from "../../validators/certificate.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Static
import { allowedRoleManageEvent } from "../../static/allowedStaffRole.js"

// @ upload file
import { certUpload } from "../../middleware/cloudinaryUpload.js"

// @ Controllers
import { createCertificateTemplate } from "../../controllers/certificate/cert.controller.js"

const certificateRouter = express.Router()

certificateRouter.post('/create-template/:category_id', certUpload.fields([
    { name: 'left_logo', maxCount: 1 },
    { name: 'center_logo', maxCount: 1 },
    { name: 'right_logo', maxCount: 1 },
    { name: 'signature_img', maxCount: 1 },
    { name: 'badge_img', maxCount: 1 }
]), validateRequest(certificateTemplateSchema), guard(...allowedRoleManageEvent), createCertificateTemplate)


certificateRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default certificateRouter