import express from "express"

// @ User Schema
import { eventEvaluationSchema } from "../../validators/feedback.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { submitEventEvaluation, getEventEvaluations, getEventEvaluationsByEvent } from "../../controllers/feedback/event.evaluation.controller.js"

const eventEvaluationRouter = express.Router()

// Admin routes for viewing evaluation submissions
eventEvaluationRouter.get('/admin/all', guard('director'), getEventEvaluations)
eventEvaluationRouter.get('/admin/event/:event_id', guard('director'), getEventEvaluationsByEvent)

// Student route for submitting evaluation
eventEvaluationRouter.post('/:event_id/volunteer/feedback', guard('student'), validateRequest(eventEvaluationSchema), submitEventEvaluation)

export default eventEvaluationRouter