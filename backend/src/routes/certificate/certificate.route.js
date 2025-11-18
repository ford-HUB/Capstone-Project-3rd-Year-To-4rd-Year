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
import { getCertificateTemplates, createCertificateTemplate, getDeployedCertificateTemplate, getUserCertificates, getCertificateCountAndEvent, deleteCertificateTemplate } from "../../controllers/certificate/cert.controller.js"

const certificateRouter = express.Router()


certificateRouter.get('/get-certificate-templates',  guard(...allowedRoleManageEvent), getCertificateTemplates)
certificateRouter.post('/assign-certificate-template', guard(...allowedRoleManageEvent), validateRequest(certificateTemplateSchema), createCertificateTemplate)
certificateRouter.get('/get-deployed-template-certificates', guard(...allowedRoleManageEvent), getDeployedCertificateTemplate)
certificateRouter.delete('/delete-certificate-template/:ct_id', guard(...allowedRoleManageEvent), deleteCertificateTemplate)
certificateRouter.get('/get-your-certificates', guard('volunteer', 'director', 'staff', 'coordinator', 'assistant_coordinator'), getUserCertificates)
certificateRouter.get('/get-user-certificate-count-and-event-completed-count', guard('volunteer', 'director', 'staff', 'coordinator'), getCertificateCountAndEvent)


certificateRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default certificateRouter