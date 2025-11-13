import { db } from "../../config/db.js";
import models from "../../models/index.js";

// Get evaluation submissions for admin
export const getEventEvaluations = async (req, res) => {
    try {
        const { EventEvaluation, Event, Volunteer, Student, Accounts } = models;
        
        const simpleCount = await EventEvaluation.count();
        
        if (simpleCount === 0) {
            return res.json({
                success: true,
                evaluations: []
            });
        }
        
        const simpleEvaluations = await EventEvaluation.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        let evaluations = simpleEvaluations;
        try {
            evaluations = await EventEvaluation.findAll({
                include: [
                    {
                        model: Event,
                        attributes: ['event_id', 'title', 'status', 'event_ended']
                    },
                    {
                        model: Volunteer,
                        attributes: ['volunteer_id'],
                        include: [
                            {
                                model: Student,
                                attributes: ['student_id', 'firstname', 'lastname', 'email'],
                                include: [
                                    {
                                        model: Accounts,
                                        attributes: ['account_id', 'email']
                                    }
                                ]
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

// Get evaluation submissions for a specific event
export const getEventEvaluationsByEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { EventEvaluation, Event, Volunteer, Student, Accounts } = models;
        
        const evaluations = await EventEvaluation.findAll({
            where: { event_id },
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'status', 'event_ended']
                },
                {
                    model: Volunteer,
                    attributes: ['volunteer_id'],
                    include: [
                        {
                            model: Student,
                            attributes: ['student_id', 'firstname', 'lastname', 'email'],
                            include: [
                                {
                                    model: Accounts,
                                    attributes: ['account_id', 'email']
                                }
                            ]
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

export const submitEventEvaluation = async (req, res) => {
    try {
        const { overallRating, contentQuality, organizationRating, venueRating, mostValuable, leastValuable, suggestions, guidanceDuringEvent, communicationRating, recommendEvent, futureTopics, futureParticipation, additionalComments, shareTestimonial } = req.validatedBody
        
        const { EventEvaluation, Student, Volunteer, Event } = models

        const student = await Student.findOne({ where: { account_id: req.user.account_id } })
        const volunteer = await Volunteer.findOne({ where: { student_id: student.student_id } })
        
        const event = await Event.findByPk(req.params.event_id)
        if(!event) { return res.json({ message: 'event not found' }) }

        const newEventEvaluation = await EventEvaluation.create({
            volunteer_id: volunteer.volunteer_id,
            event_id: event.event_id,
            overall_rating: overallRating,
            content_quality: contentQuality,
            organization_rating: organizationRating,
            venue_rating: venueRating,
            most_valuable: mostValuable,
            least_valuable: leastValuable,
            suggestions: suggestions,
            gs_rating: guidanceDuringEvent,
            communication_rating: communicationRating,
            recommendEvent: recommendEvent,
            futureTopics: futureTopics,
            future_participation: futureParticipation,
            additional_comments: additionalComments,
            agree_share_testimonial: shareTestimonial
        })

        if(!newEventEvaluation) { return res.json({ message: 'We couldn’t save your event evaluation. Please try again.' }) }

        return res.json({ success: true, message: 'Thank you! Your evaluation has been submitted successfully.' })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('submit evaluation failed: ', error.message)
    }
}