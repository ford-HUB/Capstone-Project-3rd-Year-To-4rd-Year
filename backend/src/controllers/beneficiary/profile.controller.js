import models from "../../models/index.js";
import { db } from "../../config/db.js";
import { generateUniqueCode } from "../../utils/generateUniqueCode.js";
import { sendMail } from "../../services/mailService.js";
import bcrypt from 'bcrypt';

export const getBeneficiaryProfile = async (req, res) => {
    try {
        const { account_id } = req.user;
        const { Beneficiary, Accounts } = models;

        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            attributes: [
                'beneficiary_id',
                'account_id', 
                'firstname',
                'lastname',
                'middle_initial',
                'gender',
                'phone_number',
                'age',
                'current_address',
                'organization_name',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: Accounts,
                    attributes: ['email', 'is_active', 'createdAt']
                }
            ]
        });

        if (!beneficiary) {
            return res.json({
                success: false,
                message: 'Beneficiary profile not found'
            });
        }

        console.log('Beneficiary profile data:', JSON.stringify(beneficiary, null, 2));
        console.log('Gender field:', beneficiary.gender);
        console.log('Gender type:', typeof beneficiary.gender);
        console.log('Gender length:', beneficiary.gender?.length);

        if (beneficiary.gender) {
            beneficiary.gender = beneficiary.gender.trim().toUpperCase();
            console.log('Cleaned gender:', beneficiary.gender);
        }

        return res.json({
            success: true,
            beneficiaryData: beneficiary
        });

    } catch (error) {
        console.error('getBeneficiaryProfile failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


export const updateBeneficiaryProfile = async (req, res) => {
    const t = await db.transaction();
    try {
        const { account_id } = req.user;
        const updateData = req.validatedBody;
        const { Beneficiary } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            transaction: t
        });

        if (!beneficiary) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Beneficiary profile not found'
            });
        }

        // Update beneficiary profile
        await beneficiary.update(updateData, { transaction: t });

        // Get updated profile
        const updatedBeneficiary = await Beneficiary.findOne({
            where: { account_id },
            attributes: [
                'beneficiary_id',
                'account_id', 
                'firstname',
                'lastname',
                'middle_initial',
                'gender',
                'phone_number',
                'age',
                'current_address',
                'organization_name',
                'createdAt',
                'updatedAt'
            ],
            include: [
                {
                    model: models.Accounts,
                    attributes: ['email', 'is_active', 'createdAt']
                }
            ],
            transaction: t
        });

        // Clean the gender field to ensure it matches dropdown options
        if (updatedBeneficiary.gender) {
            updatedBeneficiary.gender = updatedBeneficiary.gender.trim().toUpperCase();
        }

        await t.commit();

        return res.json({ success: true, message: 'Profile updated successfully', data: updatedBeneficiary });

    } catch (error) {
        await t.rollback();
        console.error('updateBeneficiaryProfile failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


export const uploadBeneficiaryProfileImage = async (req, res) => {
    const t = await db.transaction();
    try {
        const { account_id } = req.user;
        const { Beneficiary } = models;

        
        if (!req.file) {
            await t.rollback();
            return res.json({ success: false, message: 'No image file provided' });
        }

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            transaction: t
        });

        if (!beneficiary) {
            await t.rollback();
            return res.json({
                success: false,
                message: 'Beneficiary profile not found'
            });
        }

        // Update profile image URL
        await beneficiary.update({
            profile_image: req.file.path
        }, { transaction: t });

        await t.commit();

        return res.json({ success: true, message: 'Profile image updated successfully', data: { profile_image: req.file.path } })

    } catch (error) {
        await t.rollback();
        console.error('uploadBeneficiaryProfileImage failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


export const updateBeneficiaryEmail = async (req, res) => {
    try {
        const { newEmail, confirmEmail } = req.validatedBody
        const { account_id, email } = req.user

        const { Accounts, VerificationCodes } = models

        const confirmedEmail = newEmail || confirmEmail
        const isExist = await Accounts.findOne({ where: { email: confirmedEmail } })

        if(isExist) { return res.json({ message: 'This email is already associated with another account' }) }

        const emailValid = await Accounts.findOne({ where: { email } })

        if(!emailValid) { return res.json({ message: 'your account is not found' }) }
        
        const FIVE_MINUTES = new Date(Date.now() + 5 * 60 * 1000) 

        const uniqueCode = await generateUniqueCode()
        const newVerficationCode = await VerificationCodes.update(
            {
                code: uniqueCode,
                expires_at: FIVE_MINUTES,
                used: false
            },
            { where: { account_id: account_id } }
        )

        await sendMail(confirmedEmail, 'Verify Your Account', 'Verify Your Account Fallback', 'mailingTemplate.html', { email: process.env.AUTH_MAILER, code: uniqueCode, company_name: 'uclmcares' })

        await emailValid.update({ email: confirmedEmail })

        // const newEmailUpdated = await Accounts.update({ email: confirmedEmail }, { where: { account_id: account_id } })

        // if(!newEmailUpdated) { return res.json({ message: 'new email not successfully created' }) }

        if(!newVerficationCode) { return res.json({ message: 'verification code failed to process' }) }

        return res.json({ success: true, message: "New OTP sent to your email", otp_expiration: FIVE_MINUTES })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('update email account failed: ', error)
    }
}

/**
 * Change beneficiary password
 */
export const changeBeneficiaryPassword = async (req, res) => {
    const t = await db.transaction();
    try {
        const { account_id } = req.user;
        const { currentPassword, newPassword, confirmPassword } = req.validatedBody;
        const { Accounts } = models;

        console.log('Password change request data:', { 
            account_id, 
            hasCurrentPassword: !!currentPassword, 
            hasNewPassword: !!newPassword, 
            hasConfirmPassword: !!confirmPassword 
        });

        // Find the account
        const account = await Accounts.findOne({
            where: { account_id },
            transaction: t
        });

        if (!account) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password);
        if (!isCurrentPasswordValid) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await account.update({
            password: hashedNewPassword
        }, { transaction: t });

        await t.commit();

        return res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        await t.rollback();
        console.error('changeBeneficiaryPassword failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * Delete beneficiary profile
 */
export const deleteBeneficiaryProfile = async (req, res) => {
    const t = await db.transaction();
    try {
        const { account_id } = req.user;
        const { Beneficiary, Accounts, EventRegistration } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            transaction: t
        });

        if (!beneficiary) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Beneficiary profile not found'
            });
        }

        // Cancel all event registrations
        await EventRegistration.destroy({
            where: {
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            transaction: t
        });

        // Delete beneficiary profile
        await beneficiary.destroy({ transaction: t });

        // Delete account
        await Accounts.destroy({
            where: { account_id },
            transaction: t
        });

        await t.commit();

        return res.json({
            success: true,
            message: 'Beneficiary profile deleted successfully'
        });

    } catch (error) {
        await t.rollback();
        console.error('deleteBeneficiaryProfile failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
