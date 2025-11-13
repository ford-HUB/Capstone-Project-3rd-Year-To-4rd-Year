import express from 'express';

// @ Controllers
import {
    createRequirement,
    getAllRequirements,
    getRequirementsForRole,
    updateRequirement,
    deleteRequirement,
    getRequirementById,
} from '../../controllers/requirements/requirements.controller.js';

// @ Validators
import {
    createRequirementSchema,
    requirementIdSchema,
    updateRequirementSchema,
    roleSchema,
} from '../../validators/requirements.validator.js';

// @ Middleware
import { validateRequest } from '../../middleware/validateRequest.middleware.js';
import { guard } from '../../middleware/guard.js';

const requirementsRouter = express.Router();

// Director routes (create, read, update, delete)
requirementsRouter.post(
    '/create',
    guard('director'),
    validateRequest(createRequirementSchema),
    createRequirement
);

requirementsRouter.get('/all', guard('director'), getAllRequirements);

requirementsRouter.get('/:id', guard('director'), getRequirementById);

requirementsRouter.put('/:id', guard('director'), validateRequest(updateRequirementSchema), updateRequirement);

requirementsRouter.delete('/:id', guard('director'), deleteRequirement);

// Staff/Coordinator routes (read only)
requirementsRouter.get('/role/:role', guard('staff', 'coordinator', 'director', 'assistant_coordinator'), validateRequest(roleSchema), getRequirementsForRole);

export default requirementsRouter;
