import models from "../../models/index.js";
import { generateInitials } from "../../utils/generateInitials.js";

const { Testimonials, Beneficiary } = models;

export const createTestimonial = async (req, res) => {
    try {
        const { rating, role, initials } = req.validatedBody;
        const { account_id } = req.user;

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

        const name = beneficiary.organization_name 
            || `${beneficiary.firstname} ${beneficiary.lastname}`;

        let generatedInitials = initials;
        if (!generatedInitials || generatedInitials.trim() === '') {
            generatedInitials = generateInitials(beneficiary);
        }

        const testimonial = await Testimonials.create({
            rating,
            name,
            role,
            initials: generatedInitials,
            approved: false,
            featured: false
        });

        return res.json({
            success: true,
            message: 'Thank you! Your testimonial has been submitted successfully.',
            testimonial
        });

    } catch (error) {
        console.error('Create testimonial failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

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
        console.error('Get testimonials failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

