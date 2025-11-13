import express from 'express';
import { uploadEventProof, getEventProofStatus } from '../../controllers/event/proofUpload.controller.js';
import { proofUpload } from '../../middleware/cloudinaryUpload.js';
import { guard } from '../../middleware/guard.js';

const router = express.Router();

router.post('/:event_id/upload-proof', guard('student'), proofUpload.array('images', 5), uploadEventProof);

router.get('/:event_id/proof-status', guard('student'), getEventProofStatus);


export default router;
