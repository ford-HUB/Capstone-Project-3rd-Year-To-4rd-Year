import express from 'express';
import { guard } from '../../middleware/guard.js';

import { getPendingRegistrations, getAllRegistrations, approveRegistration, declineRegistration, getRegistrationDetails } from '../../controllers/director/beneficiary.controller.js';

const manageBeneficiaryRouter = express.Router();


manageBeneficiaryRouter.get('/beneficiary-requests', guard('director'), getPendingRegistrations);

manageBeneficiaryRouter.get('/beneficiary-list', guard('director'), getAllRegistrations);

manageBeneficiaryRouter.get('/beneficiary-requests/:registrationId', guard('director'), getRegistrationDetails);

manageBeneficiaryRouter.post('/beneficiary-requests/:registrationId/approve', guard('director'), approveRegistration);

manageBeneficiaryRouter.post('/beneficiary-requests/:registrationId/decline', guard('director'), declineRegistration);

export default manageBeneficiaryRouter;
