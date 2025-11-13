import express from "express"

// @ Schema
import { uploadDocumentSchema } from "../../validators/document.validator.js"

// @ Middleware
import { validateRequest } from "../../middleware/validateRequest.middleware.js"
import { fileUploadHandler } from "../../middleware/fileUploadHandler.js"
import { guard } from "../../middleware/guard.js"

// @ Controllers
import { 
    uploadDocument, 
    getAllDocuments, 
    deleteDocuments,
    getMonthlyTodoDocuments
} from "../../controllers/document/document.controller.js"


const documentRouter = express.Router()

documentRouter.post('/upload-documents', fileUploadHandler, validateRequest(uploadDocumentSchema), guard('director', 'staff', 'coordinator', 'assistant_coordinator'), uploadDocument)
documentRouter.get('/documents-list', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), getAllDocuments)
documentRouter.delete('/delete-document/:ids', guard('director', 'staff', 'coordinator', 'assistant_coordinator'), deleteDocuments)
documentRouter.get('/monthly-todo', guard('coordinator', 'assistant_coordinator'), getMonthlyTodoDocuments)

documentRouter.get('/testing', (req, res) => {
    res.send("routes working")
})


export default documentRouter