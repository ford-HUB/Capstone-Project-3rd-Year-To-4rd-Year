import models from "../../models/index.js"
import bcrypt from 'bcrypt'

export const getProfile = async (req, res) => {
    try {
        const { Accounts, Donor, Role } = models
        
        // Get the authenticated donor's profile with account information
        const donorProfile = await Donor.findOne({
            where: { account_id: req.user.account_id },
            include: [
                {
                    model: Accounts,
                    attributes: ['account_id', 'email', 'is_active', 'createdAt'],
                    include: [
                        {
                            model: Role,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            attributes: ['donor_id', 'fullname', 'profile_image', 'is_verified', 'auth_provider', 'provider_id', 'xendit_customer_id']
        })

        if (!donorProfile) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            })
        }

        res.json({
            success: true,
            message: 'Donor profile retrieved successfully',
            data: donorProfile
        })

    } catch (error) {
        console.error('Get donor profile failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname } = req.validatedBody
        const { Donor } = models

        // Update donor profile
        const updatedProfile = await Donor.update(
            {
                fullname: fullname
            },
            {
                where: { account_id: req.user.account_id },
                returning: true
            }
        )

        if (updatedProfile[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            })
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile[1][0]
        })

    } catch (error) {
        console.error('Update donor profile failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getDonorStats = async (req, res) => {
    try {
        const { Donations, Payments, GoodsDonation } = models
        
        // Get donation statistics for the donor
        const totalDonations = await Donations.count({
            where: { account_id: req.user.account_id }
        })

        // Get total money donated by joining Payments through Donations
        const moneyDonations = await Donations.findAll({
            where: { 
                account_id: req.user.account_id,
                donation_type: 'MONEY'
            },
            include: [{
                model: Payments,
                where: {
                    payment_status: 'PAID'
                },
                required: true
            }]
        })

        const totalMoneyDonated = moneyDonations.reduce((sum, donation) => {
            const payment = donation.Payments?.[0];
            const amount = parseFloat(payment?.amount) || 0;
            return sum + amount;
        }, 0)

        const totalGoodsDonations = await GoodsDonation.count({
            include: [
                {
                    model: Donations,
                    where: { account_id: req.user.account_id },
                    attributes: []
                }
            ]
        })

        const campaignsSupported = await Donations.count({
            distinct: true,
            col: 'event_id',
            where: { account_id: req.user.account_id }
        })

        res.json({
            success: true,
            message: 'Donor statistics retrieved successfully',
            data: {
                totalDonations,
                totalMoneyDonated,
                totalGoodsDonations,
                campaignsSupported
            }
        })

    } catch (error) {
        console.error('Get donor stats failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.validatedBody
        const { Accounts, Donor } = models

        // Check if the account is OAuth (not from our system)
        const donorProfile = await Donor.findOne({
            where: { account_id: req.user.account_id },
            attributes: ['auth_provider']
        })

        if (!donorProfile) {
            return res.status(404).json({
                success: false,
                message: 'Donor profile not found'
            })
        }

        // Reject password change for OAuth accounts
        if (donorProfile.auth_provider && donorProfile.auth_provider !== 'local') {
            return res.status(403).json({
                success: false,
                message: 'Password cannot be changed for OAuth accounts. Please change your password through your OAuth provider.'
            })
        }

        // Get the current account
        const account = await Accounts.findOne({
            where: { account_id: req.user.account_id }
        })

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            })
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password)
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        // Check if new password is different from current password
        if (currentPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            })
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)

        // Update the password
        await Accounts.update(
            { password: hashedNewPassword },
            { where: { account_id: req.user.account_id } }
        )

        res.json({
            success: true,
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Change password failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
