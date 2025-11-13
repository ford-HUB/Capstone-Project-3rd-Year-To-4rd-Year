import express from "express";

// @ Controllers
import {
    getAllDocumentRequestApprovals,
    getDocumentRequestApprovalById,
    createDocumentRequestApproval,
    updateDocumentRequestApprovalStatus,
    deleteDocumentRequestApproval
} from "../../controllers/director/documentRequestApproval.controller.js";

// @ Validators
import {
    createDocumentRequestApprovalSchema,
    updateDocumentRequestApprovalStatusSchema,
    documentRequestApprovalFilterSchema,
    documentRequestApprovalIdSchema
} from "../../validators/documentRequestApproval.validator.js";

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { guard } from "../../middleware/guard.js";

const documentRequestApprovalRouter = express.Router();

// List all document request approvals with filters
documentRequestApprovalRouter.get("/list-request-approvals", guard("director"), getAllDocumentRequestApprovals);

// Get specific document request approval by ID
documentRequestApprovalRouter.get("/get-request-approval/:dra_id", guard("director"), getDocumentRequestApprovalById);

// Create new document request approval
documentRequestApprovalRouter.post("/create-request-approval", validateRequest(createDocumentRequestApprovalSchema), guard("director", "coordinator", "staff"), createDocumentRequestApproval);

// Update document request approval status (approve/reject)
documentRequestApprovalRouter.put("/update-request-status/:dra_id", validateRequest(updateDocumentRequestApprovalStatusSchema), guard("director"), updateDocumentRequestApprovalStatus);

// Delete document request approval
documentRequestApprovalRouter.delete("/delete-request-approval/:dra_id", guard("director"), deleteDocumentRequestApproval);

// Testing route
documentRequestApprovalRouter.get("/testing", (req, res) => {
    res.send("routes working")
});

export default documentRequestApprovalRouter;
