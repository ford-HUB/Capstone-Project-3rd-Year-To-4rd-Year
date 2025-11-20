import models from "../../models/index.js";

const { Testimonials, Beneficiary } = models;

export const createTestimonial = async (req, res) => {
    try {
        const { rating, message } = req.validatedBody;

        const beneficiary = await Beneficiary.findOne({
            where: { account_id: req.user.account_id },
            attributes: ['beneficiary_id', 'firstname', 'lastname', 'middle_initial', 'organization_name']
        });

        if (!beneficiary) {
            return res.status(404).json({
                success: false,
                message: 'Beneficiary not found'
            });
        }

        const newTestimonial = await Testimonials.create({
            sender_id: beneficiary.beneficiary_id,
            rating,
            message,
            approved: false,
            featured: false
        });

        return res.json({
            success: true,
            message: 'Thank you! Your testimonial has been submitted successfully.',
            testimonial: {
                testimonial_id: newTestimonial.testimonial_id,
                rating: newTestimonial.rating,
                message: newTestimonial.message,
                approved: newTestimonial.approved,
                featured: newTestimonial.featured,
                createdAt: newTestimonial.createdAt
            }
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
            include: [
                {
                    model: Beneficiary,
                    attributes: ['beneficiary_id', 'firstname', 'lastname', 'middle_initial', 'organization_name'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedTestimonials = testimonials.map(testimonial => {
            const testimonialData = testimonial.toJSON();
            return {
                testimonial_id: testimonialData.testimonial_id,
                sender_id: testimonialData.sender_id,
                rating: testimonialData.rating,
                message: testimonialData.message,
                approved: testimonialData.approved,
                featured: testimonialData.featured,
                createdAt: testimonialData.createdAt,
                updatedAt: testimonialData.updatedAt,
                Beneficiary: testimonialData.Beneficiary ? {
                    beneficiary_id: testimonialData.Beneficiary.beneficiary_id,
                    firstname: testimonialData.Beneficiary.firstname,
                    lastname: testimonialData.Beneficiary.lastname,
                    middle_initial: testimonialData.Beneficiary.middle_initial,
                    organization_name: testimonialData.Beneficiary.organization_name
                } : null
            };
        });

        return res.json({
            success: true,
            testimonials: formattedTestimonials
        });

    } catch (error) {
        console.error('Get testimonials failed:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

