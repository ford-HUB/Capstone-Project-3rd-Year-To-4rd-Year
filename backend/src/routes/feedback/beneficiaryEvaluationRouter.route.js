import express from "express"

// @ User Schema
import { beneficiaryEventEvaluationSchema } from "../../validators/beneficiaryEvaluation.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { 
    submitBeneficiaryEventEvaluation, 
    getBeneficiaryEventEvaluations, 
    getBeneficiaryEventEvaluationsByEvent,
    getBeneficiaryEvaluationForm
} from "../../controllers/feedback/beneficiary.evaluation.controller.js"

const beneficiaryEvaluationRouter = express.Router()

// Admin routes for viewing evaluation submissions
beneficiaryEvaluationRouter.get('/admin/all', guard('director'), getBeneficiaryEventEvaluations)
beneficiaryEvaluationRouter.get('/admin/event/:event_id', guard('director'), getBeneficiaryEventEvaluationsByEvent)

// Beneficiary routes
beneficiaryEvaluationRouter.get('/:event_id/form', guard('beneficiary'), getBeneficiaryEvaluationForm)
beneficiaryEvaluationRouter.post('/:event_id/beneficiary/evaluation', guard('beneficiary'), validateRequest(beneficiaryEventEvaluationSchema), submitBeneficiaryEventEvaluation)

export default beneficiaryEvaluationRouter
