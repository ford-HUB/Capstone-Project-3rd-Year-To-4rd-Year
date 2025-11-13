import { db } from "../../config/db.js";
import models from "../../models/index.js";
import { Op } from "sequelize";

// Get beneficiary evaluation form schema
export const getBeneficiaryEvaluationForm = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { Form, Event } = models;

        console.log(`Looking for beneficiary evaluation form for event_id: ${event_id}`);

        // First, try to find a specific form for this event with beneficiary target_role
        let form = await Form.findOne({
            where: {
                event_id: event_id,
                target_role: 'beneficiary',
                is_active: true
            }
        });

        console.log('Form found with exact criteria:', form ? 'Yes' : 'No');

        // If no beneficiary-specific form found, try to find any active form for this event
        if (!form) {
            console.log('No beneficiary-specific form found, checking for any active form for this event...');
            form = await Form.findOne({
                where: {
                    event_id: event_id,
                    is_active: true
                }
            });
            console.log('Any active form found for event:', form ? 'Yes' : 'No');
        }

        // If still no form found, try hint-based matching with title containing "Beneficiary Event Feedback"
        if (!form) {
            console.log('No form found for this event, trying hint-based matching...');
            form = await Form.findOne({
                where: {
                    event_id: event_id,
                    title: {
                        [Op.iLike]: '%Beneficiary Event Feedback%'
                    },
                    is_active: true
                }
            });
            console.log('Form found with hint-based matching:', form ? 'Yes' : 'No');
        }

        // If still no form found, try to get dynamic forms for reflection (hint-based matching)
        if (!form) {
            console.log('No form found for this event, trying dynamic forms with hint-based matching...');
            
            // Try to get forms using the reflection endpoint logic
            const dynamicForms = await Form.findAll({
                where: {
                    event_id: event_id,
                    is_active: true,
                    is_public: true,
                    [Op.or]: [
                        { target_role: 'beneficiary' },
                        { target_role: 'all' },
                        { 
                            title: {
                                [Op.iLike]: '%Beneficiary Event Feedback%'
                            }
                        }
                    ]
                },
                order: [
                    // Prioritize exact target_role, then hint-based, then general
                    ['target_role', 'ASC NULLS LAST'],
                    ['createdAt', 'DESC']
                ]
            });
            
            console.log('Dynamic forms found with hint-based matching:', dynamicForms.length);
            console.log('Dynamic forms details:', dynamicForms.map(f => ({
                form_id: f.form_id,
                title: f.title,
                event_id: f.event_id,
                target_role: f.target_role,
                is_active: f.is_active
            })));
            
            if (dynamicForms.length > 0) {
                // Return the first matching form
                form = dynamicForms[0];
                console.log('Using dynamic form:', {
                    form_id: form.form_id,
                    title: form.title,
                    target_role: form.target_role
                });
            }
        }

        // If still no form found, check if there are any beneficiary forms at all
        if (!form) {
            console.log('No form found for this event, checking for any beneficiary forms...');
            const beneficiaryForms = await Form.findAll({
                where: {
                    target_role: 'beneficiary',
                    is_active: true
                },
                attributes: ['form_id', 'title', 'event_id', 'target_role', 'is_active']
            });
            console.log('Available beneficiary forms:', beneficiaryForms.length);
            console.log('Beneficiary forms details:', beneficiaryForms.map(f => ({
                form_id: f.form_id,
                title: f.title,
                event_id: f.event_id,
                target_role: f.target_role,
                is_active: f.is_active
            })));
        }

        // If no form found, return a message indicating waiting for director
        if (!form) {
            // Get additional debug information
            const allEventForms = await Form.findAll({
                where: { event_id: event_id },
                attributes: ['form_id', 'title', 'event_id', 'target_role', 'is_active', 'is_public']
            });
            
            const allBeneficiaryForms = await Form.findAll({
                where: { target_role: 'beneficiary' },
                attributes: ['form_id', 'title', 'event_id', 'target_role', 'is_active', 'is_public']
            });
            
            return res.json({
                success: false,
                message: 'Waiting for director to submit the feedback form',
                waitingForDirector: true,
                debug: {
                    event_id: event_id,
                    searched_for: 'beneficiary evaluation form',
                    forms_for_this_event: allEventForms,
                    all_beneficiary_forms: allBeneficiaryForms,
                    total_forms_in_db: await Form.count()
                }
            });
        }

        console.log('Returning form:', {
            form_id: form.form_id,
            title: form.title,
            event_id: form.event_id,
            target_role: form.target_role,
            is_active: form.is_active
        });

        return res.json({
            success: true,
            form: {
                form_id: form.form_id,
                title: form.title,
                description: form.description,
                form_schema: form.form_schema
            }
        });

    } catch (error) {
        console.error('Error in getBeneficiaryEvaluationForm:', error);
        return res.json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get beneficiary evaluation submissions for admin
export const getBeneficiaryEventEvaluations = async (req, res) => {
    try {
        const { BeneficiaryEventEvaluation, Event, Beneficiary, Accounts } = models;
        
        const simpleCount = await BeneficiaryEventEvaluation.count();
        
        if (simpleCount === 0) {
            return res.json({
                success: true,
                evaluations: []
            });
        }
        
        const simpleEvaluations = await BeneficiaryEventEvaluation.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        let evaluations = simpleEvaluations;
        try {
            evaluations = await BeneficiaryEventEvaluation.findAll({
                include: [
                    {
                        model: Event,
                        attributes: ['event_id', 'title', 'status', 'event_ended']
                    },
                    {
                        model: Beneficiary,
                        attributes: ['beneficiary_id'],
                        include: [
                            {
                                model: Accounts,
                                attributes: ['account_id', 'email', 'firstname', 'lastname']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
        } catch (includeError) {
            evaluations = simpleEvaluations;
        }

        return res.json({
            success: true,
            evaluations: evaluations
        });

    } catch (error) {
        return res.json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Get beneficiary evaluation submissions for a specific event
export const getBeneficiaryEventEvaluationsByEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { BeneficiaryEventEvaluation, Event, Beneficiary, Accounts } = models;
        
        const evaluations = await BeneficiaryEventEvaluation.findAll({
            where: { event_id },
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'status', 'event_ended']
                },
                {
                    model: Beneficiary,
                    attributes: ['beneficiary_id'],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['account_id', 'email', 'firstname', 'lastname']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.json({
            success: true,
            evaluations: evaluations
        });

    } catch (error) {
        return res.json({ success: false, message: 'Internal server error' });
    }
};

// Submit beneficiary event evaluation
export const submitBeneficiaryEventEvaluation = async (req, res) => {
    try {
        const { 
            overallRating, 
            eventOrganization, 
            venueQuality, 
            staffSupport, 
            eventContent, 
            mostHelpful, 
            leastHelpful, 
            suggestions, 
            wouldRecommend, 
            futureParticipation, 
            additionalComments, 
            shareTestimonial 
        } = req.validatedBody;
        
        const { BeneficiaryEventEvaluation, Beneficiary, Event, Form, FormResponse } = models;

        const beneficiary = await Beneficiary.findOne({ where: { account_id: req.user.account_id } });
        if (!beneficiary) {
            return res.json({ success: false, message: 'Beneficiary not found' });
        }
        
        const event = await Event.findByPk(req.params.event_id);
        if (!event) { 
            return res.json({ success: false, message: 'Event not found' }); 
        }

        // Check if evaluation already exists
        const existingEvaluation = await BeneficiaryEventEvaluation.findOne({
            where: { 
                beneficiary_id: beneficiary.beneficiary_id,
                event_id: event.event_id
            }
        });

        if (existingEvaluation) {
            return res.json({ success: false, message: 'Evaluation already submitted for this event' });
        }

        const newBeneficiaryEvaluation = await BeneficiaryEventEvaluation.create({
            beneficiary_id: beneficiary.beneficiary_id,
            event_id: event.event_id,
            overall_rating: overallRating,
            event_organization: eventOrganization,
            venue_quality: venueQuality,
            staff_support: staffSupport,
            event_content: eventContent,
            most_helpful: mostHelpful || 'N/A',
            least_helpful: leastHelpful || 'N/A',
            suggestions: suggestions || 'N/A',
            would_recommend: wouldRecommend,
            future_participation: futureParticipation,
            additional_comments: additionalComments || 'N/A',
            share_testimonial: shareTestimonial || false
        });

        if(!newBeneficiaryEvaluation) { 
            return res.json({ success: false, message: 'We couldn\'t save your evaluation. Please try again.' }); 
        }

        // Check if there are dynamic forms for this event
        const dynamicForms = await Form.findAll({ 
            where: { 
                event_id: event.event_id,
                is_active: true
            }
        });

        // If there are dynamic forms, we expect the frontend to submit them separately
        // This is handled by the form submission endpoint
        if (dynamicForms.length > 0) {
            console.log(`Found ${dynamicForms.length} dynamic forms for event ${event.event_id}`);
        }

        return res.json({ success: true, message: 'Thank you! Your evaluation has been submitted successfully.' });

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' });
        console.log('submit beneficiary evaluation failed: ', error.message);
    }
};
