import express from 'express';
import { 
    getBeneficiaryProfile,
    updateBeneficiaryProfile,
    uploadBeneficiaryProfileImage,
    deleteBeneficiaryProfile,
    updateBeneficiaryEmail,
    changeBeneficiaryPassword
} from '../../controllers/beneficiary/profile.controller.js';
import { guard } from '../../middleware/guard.js';
import { validateRequest } from '../../middleware/validateRequest.middleware.js';
import { beneficiaryProfileUpdateSchema, beneficiaryEmailUpdateSchema, beneficiaryPasswordChangeSchema } from '../../validators/beneficiary.validator.js';
import { upload } from '../../middleware/cloudinaryUpload.js';

const beneficiaryProfileRouter = express.Router();

// Get beneficiary profile
beneficiaryProfileRouter.get('/profile', guard('beneficiary'), getBeneficiaryProfile);

// Update beneficiary profile
beneficiaryProfileRouter.put('/profile', guard('beneficiary'), validateRequest(beneficiaryProfileUpdateSchema), updateBeneficiaryProfile )

// Upload beneficiary profile image
beneficiaryProfileRouter.post('/profile/image', guard('beneficiary'), upload.single('profileImage'), uploadBeneficiaryProfileImage )

// Update beneficiary email
beneficiaryProfileRouter.put('/profile/email', guard('beneficiary'), validateRequest(beneficiaryEmailUpdateSchema), updateBeneficiaryEmail )

// Change beneficiary password
beneficiaryProfileRouter.put('/profile/change-password', guard('beneficiary'), validateRequest(beneficiaryPasswordChangeSchema), changeBeneficiaryPassword )

// Delete beneficiary profile
beneficiaryProfileRouter.delete('/profile', guard('beneficiary'), deleteBeneficiaryProfile);

export default beneficiaryProfileRouter;
