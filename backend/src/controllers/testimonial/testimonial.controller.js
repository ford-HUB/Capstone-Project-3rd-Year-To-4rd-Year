import models from "../../models/index.js";
import { generateInitials } from "../../utils/generateInitials.js";

const { Testimonials, Beneficiary, Accounts } = models;

// Create testimonial
export const createTestimonial = async (req, res) => {
    try {
        const { rating, role, initials } = req.validatedBody;
        const { account_id } = req.user;

        // Get beneficiary information
        const beneficiary = await Beneficiary.findOne({
            where: { account_id },
            attributes: ['beneficiary_id', 'firstname', 'lastname', 'middle_initial', 'organization_name']
        });

        if (!beneficiary) {
            return res.json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        // Generate name from beneficiary data
        const name = beneficiary.organization_name 
            ? beneficiary.organization_name 
            : `${beneficiary.firstname} ${beneficiary.lastname}`;

        // Generate initials if not provided
        let generatedInitials = initials;
        if (!generatedInitials || generatedInitials.trim() === '') {
            generatedInitials = generateInitials(beneficiary);
        }

        // Create testimonial
        const testimonial = await Testimonials.create({
            rating,
            name,
            role,
            initials: generatedInitials,
            approved: false,
            featured: false
        });

        if (!testimonial) {
            return res.json({
                success: false,
                message: 'Failed to create testimonial. Please try again.'
            });
        }

        return res.json({
            success: true,
            message: 'Thank you! Your testimonial has been submitted successfully.',
            testimonial
        });

    } catch (error) {
        console.error('Create testimonial failed:', error.message);
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Get testimonials (for display)
export const getTestimonials = async (req, res) => {
    try {
        const { approved, featured } = req.query;

        const whereClause = {};
        if (approved !== undefined) {
            whereClause.approved = approved === 'true';
        }
        if (featured !== undefined) {
            whereClause.featured = featured === 'true';
        }

        const testimonials = await Testimonials.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        return res.json({
            success: true,
            testimonials
        });

    } catch (error) {
        console.error('Get testimonials failed:', error.message);
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

