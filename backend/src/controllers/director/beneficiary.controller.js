import models from "../../models/index.js";
import { db } from "../../config/db.js";
import { sendMail } from "../../services/mailService.js";
import { removeNotification } from "../../socket.js";
import { logDirectorActivity } from "../../services/activityLogService.js";

const { EventRegistration, Event, Beneficiary, Notification, Accounts } = models;

export const getPendingRegistrations = async (req, res) => {
    try {
        
        const pendingRegistrations = await EventRegistration.findAll({
            where: {
                participant_type: 'beneficiary',
                status: 'pending' // Pending review status
            },
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location', 'description']
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const transformedRegistrations = pendingRegistrations.map(registration => {
            const registrationData = {
                event_registration_id: registration.event_registration_id,
                event_id: registration.event_id,
                participant_id: registration.participant_id,
                participant_type: registration.participant_type,
                registration_date: registration.registration_date,
                status: registration.status,
                emergency_fullname: registration.emergency_fullname,
                emergency_number: registration.emergency_number,
                relationship: registration.relationship,
                emergency_contact_email: registration.emergency_contact_email,
                current_situation: registration.current_situation,
                needs: registration.needs,
                how_can_we_help: registration.how_can_we_help,
                id_verification_files: registration.id_verification_files,
                proof_uploaded: registration.proof_uploaded,
                proof_uploaded_at: registration.proof_uploaded_at,
                proof_images: registration.proof_images,
                createdAt: registration.createdAt,
                updatedAt: registration.updatedAt,
                event: null,
                beneficiary: null
            };

            if (registration.Event) {
                registrationData.event = {
                    event_id: registration.Event.event_id,
                    title: registration.Event.title,
                    description: registration.Event.description,
                    event_started: registration.Event.event_started,
                    event_ended: registration.Event.event_ended,
                    location: registration.Event.location
                };
            }

            if (registration.Beneficiary) {
                registrationData.beneficiary = {
                    beneficiary_id: registration.Beneficiary.beneficiary_id,
                    firstname: registration.Beneficiary.firstname,
                    lastname: registration.Beneficiary.lastname,
                    middle_initial: registration.Beneficiary.middle_initial,
                    phone_number: registration.Beneficiary.phone_number,
                    current_address: registration.Beneficiary.current_address,
                    age: registration.Beneficiary.age,
                    gender: registration.Beneficiary.gender,
                    organization_name: registration.Beneficiary.organization_name,
                    account: null
                };

                if (registration.Beneficiary.Account) {
                    registrationData.beneficiary.account = {
                        email: registration.Beneficiary.Account.email
                    };
                }
            }

            return registrationData;
        });

        res.json({
            success: true,
            registrations: transformedRegistrations,
            count: transformedRegistrations.length,
            message: transformedRegistrations.length === 0 ? 'No pending registrations found' : 'Pending registrations retrieved successfully'
        });

    } catch (error) {
        console.error('Get pending registrations failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getAllRegistrations = async (req, res) => {
    try {
        const { status, event_id } = req.query;

        let whereClause = {
            participant_type: 'beneficiary'
        };

        if (status && status !== 'all') {
            whereClause.status = status;
        } else if (!status) {
            whereClause.status = 'registered';
        }

        if (event_id) {
            whereClause.event_id = event_id;
        }

        const allRegistrations = await EventRegistration.findAll({
            where: whereClause,
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location', 'description']
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const transformedRegistrations = allRegistrations.map(registration => {
            const registrationData = {
                event_registration_id: registration.event_registration_id,
                event_id: registration.event_id,
                participant_id: registration.participant_id,
                participant_type: registration.participant_type,
                registration_date: registration.registration_date,
                status: registration.status,
                emergency_fullname: registration.emergency_fullname,
                emergency_number: registration.emergency_number,
                relationship: registration.relationship,
                emergency_contact_email: registration.emergency_contact_email,
                current_situation: registration.current_situation,
                needs: registration.needs,
                how_can_we_help: registration.how_can_we_help,
                id_verification_files: registration.id_verification_files,
                proof_uploaded: registration.proof_uploaded,
                proof_uploaded_at: registration.proof_uploaded_at,
                proof_images: registration.proof_images,
                createdAt: registration.createdAt,
                updatedAt: registration.updatedAt,
                event: null,
                beneficiary: null
            };

            if (registration.Event) {
                registrationData.event = {
                    event_id: registration.Event.event_id,
                    title: registration.Event.title,
                    description: registration.Event.description,
                    event_started: registration.Event.event_started,
                    event_ended: registration.Event.event_ended,
                    location: registration.Event.location
                };
            }

            if (registration.Beneficiary) {
                registrationData.beneficiary = {
                    beneficiary_id: registration.Beneficiary.beneficiary_id,
                    firstname: registration.Beneficiary.firstname,
                    lastname: registration.Beneficiary.lastname,
                    middle_initial: registration.Beneficiary.middle_initial,
                    phone_number: registration.Beneficiary.phone_number,
                    current_address: registration.Beneficiary.current_address,
                    age: registration.Beneficiary.age,
                    gender: registration.Beneficiary.gender,
                    organization_name: registration.Beneficiary.organization_name,
                    account: null
                };

                if (registration.Beneficiary.Account) {
                    registrationData.beneficiary.account = {
                        email: registration.Beneficiary.Account.email
                    };
                }
            }

            return registrationData;
        });

        res.json({
            success: true,
            registrations: transformedRegistrations,
            count: transformedRegistrations.length,
            message: transformedRegistrations.length === 0 ? 'No registrations found' : 'Registrations retrieved successfully'
        });

    } catch (error) {
        console.error('Get all registrations failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


export const approveRegistration = async (req, res) => {
    const t = await db.transaction();
    try {
        const { registrationId } = req.params;

        // Find the registration
        const registration = await EventRegistration.findByPk(registrationId, {
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location']
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            transaction: t
        });

        if (!registration) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Registration is not in pending status'
            });
        }

        // Update registration status to registered (approved)
        await registration.update(
            { status: 'registered' },
            { transaction: t }
        );

        // Remove notification if exists
        await Notification.destroy({
            where: {
                sender_type: 'beneficiary_registration',
                sender_id: registrationId
            },
            transaction: t
        });

        // Send approval email
        try {
            await sendBeneficiaryNotification(
                registration.Beneficiary.Account.email,
                'APPROVED',
                {
                    beneficiaryName: `${registration.Beneficiary.firstname} ${registration.Beneficiary.lastname}`,
                    eventName: registration.Event.title,
                    eventDate: registration.Event.event_started,
                    eventLocation: registration.Event.location
                }
            );
        } catch (emailError) {
            console.error('Approval email failed:', emailError.message);
            // Don't fail the transaction for email errors
        }

        await t.commit();

        // Log activity
        await logDirectorActivity(
            req.user.account_id,
            'update',
            'event',
            `Approved beneficiary registration for event: ${registration.Event.title} - Beneficiary: ${registration.Beneficiary.firstname} ${registration.Beneficiary.lastname}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        );

        res.json({
            success: true,
            message: 'Registration approved successfully'
        });

    } catch (error) {
        await t.rollback();
        console.error('Approve registration failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * Decline a beneficiary registration
 */
export const declineRegistration = async (req, res) => {
    const t = await db.transaction();
    try {
        const { registrationId } = req.params;
        const { reason } = req.body || {};

        // Find the registration
        const registration = await EventRegistration.findByPk(registrationId, {
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location']
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            transaction: t
        });

        if (!registration) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Registration is not in pending status'
            });
        }

        // Update registration status to declined
        await registration.update(
            { 
                status: 'declined',
                rejection_reason: reason || 'No reason provided'
            },
            { transaction: t }
        );

        // Remove notification if exists
        await Notification.destroy({
            where: {
                sender_type: 'beneficiary_registration',
                sender_id: registrationId
            },
            transaction: t
        });

        // Send decline email
        try {
            await sendBeneficiaryNotification(
                registration.Beneficiary.Account.email,
                'DECLINED',
                {
                    beneficiaryName: `${registration.Beneficiary.firstname} ${registration.Beneficiary.lastname}`,
                    eventName: registration.Event.title,
                    eventDate: registration.Event.event_started,
                    eventLocation: registration.Event.location,
                    reason: reason || 'No reason provided'
                }
            );
        } catch (emailError) {
            console.error('Decline email failed:', emailError.message);
            // Don't fail the transaction for email errors
        }

        await t.commit();

        // Log activity
        await logDirectorActivity(
            req.user.account_id,
            'update',
            'event',
            `Declined beneficiary registration for event: ${registration.Event.title} - Beneficiary: ${registration.Beneficiary.firstname} ${registration.Beneficiary.lastname}${reason ? ` (Reason: ${reason})` : ''}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        );

        res.json({
            success: true,
            message: 'Registration declined successfully'
        });

    } catch (error) {
        await t.rollback();
        console.error('Decline registration failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * Get registration details by ID
 */
export const getRegistrationDetails = async (req, res) => {
    try {
        const { registrationId } = req.params;

        const registration = await EventRegistration.findByPk(registrationId, {
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location', 'description']
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ]
        });


        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json({
            success: true,
            registration: registration
        });

    } catch (error) {
        console.error('Get registration details failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

/**
 * Helper function to send beneficiary notifications
 */
const sendBeneficiaryNotification = async (email, action, data) => {
    const actionConfig = {
        'APPROVED': {
            subject: 'Your event registration has been approved',
            title: 'Registration Approved',
            description: `Congratulations! Your registration for ${data.eventName} has been approved.`,
            status_title: 'Registration Status: Approved',
            status_description: 'You are now officially registered for this event.',
            action_title: 'Event Details:',
            action_text: `Event: ${data.eventName}\nDate: ${new Date(data.eventDate).toLocaleDateString()}\nLocation: ${data.eventLocation}\n\nIMPORTANT: Please arrive at the venue 15 minutes before the event starts for smooth check-in and seating arrangements.`
        },
        'DECLINED': {
            subject: 'Your event registration has been declined',
            title: 'Registration Declined',
            description: `We regret to inform you that your registration for ${data.eventName} has been declined.`,
            status_title: 'Registration Status: Declined',
            status_description: 'Your registration has been reviewed and unfortunately cannot be approved at this time.',
            action_title: 'Reason for decline:',
            action_text: data.reason || 'No specific reason provided'
        }
    };

    const config = actionConfig[action] || actionConfig['DECLINED'];
    const template = 'beneficiaryActionNotification.html';
    
    const variables = {
        email: process.env.AUTH_MAILER,
        title: config.title,
        description: config.description,
        status_title: config.status_title,
        status_description: config.status_description,
        reason: data.reason || 'No specific reason provided',
        action_title: config.action_title,
        action_text: config.action_text,
        beneficiaryName: data.beneficiaryName,
        eventName: data.eventName
    };
    
    await sendMail(email, config.subject, config.description, template, variables);
};


export const getBeneficiaryRecords = async (req, res) => {
    try {
        const { event_id, status } = req.query;

        let whereClause = {
            participant_type: 'beneficiary'
        };

        // Filter by event if provided
        if (event_id) {
            whereClause.event_id = parseInt(event_id);
        }

        // Filter by status if provided
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        // Get all beneficiary registrations
        const registrations = await EventRegistration.findAll({
            where: whereClause,
            include: [
                {
                    model: Event,
                    attributes: [
                        'event_id', 'title', 'description', 'event_started', 
                        'event_ended', 'location', 'status', 'event_image',
                        'funds_donation', 'goods_donation'
                    ]
                },
                {
                    model: Beneficiary,
                    attributes: [
                        'beneficiary_id', 'firstname', 'lastname', 'middle_initial', 
                        'phone_number', 'current_address', 'age', 'gender', 'organization_name'
                    ],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Transform registrations
        const transformedRecords = registrations.map(registration => {
            const recordData = {
                event_registration_id: registration.event_registration_id,
                event_id: registration.event_id,
                participant_id: registration.participant_id,
                participant_type: registration.participant_type,
                registration_date: registration.registration_date,
                status: registration.status,
                createdAt: registration.createdAt,
                updatedAt: registration.updatedAt,
                event: null,
                beneficiary: null
            };

            // Add event data
            if (registration.Event) {
                recordData.event = {
                    event_id: registration.Event.event_id,
                    title: registration.Event.title,
                    description: registration.Event.description,
                    event_started: registration.Event.event_started,
                    event_ended: registration.Event.event_ended,
                    location: registration.Event.location,
                    status: registration.Event.status,
                    event_image: registration.Event.event_image,
                    funds_donation: registration.Event.funds_donation,
                    goods_donation: registration.Event.goods_donation
                };
            }

            // Add beneficiary data
            if (registration.Beneficiary) {
                recordData.beneficiary = {
                    beneficiary_id: registration.Beneficiary.beneficiary_id,
                    firstname: registration.Beneficiary.firstname,
                    lastname: registration.Beneficiary.lastname,
                    middle_initial: registration.Beneficiary.middle_initial,
                    phone_number: registration.Beneficiary.phone_number,
                    current_address: registration.Beneficiary.current_address,
                    age: registration.Beneficiary.age,
                    gender: registration.Beneficiary.gender,
                    organization_name: registration.Beneficiary.organization_name,
                    account: null
                };

                if (registration.Beneficiary.Account) {
                    recordData.beneficiary.account = {
                        email: registration.Beneficiary.Account.email
                    };
                }
            }

            return recordData;
        });

        res.json({
            success: true,
            records: transformedRecords,
            count: transformedRecords.length,
            message: transformedRecords.length === 0 ? 'No beneficiary records found' : 'Beneficiary records retrieved successfully'
        });

    } catch (error) {
        console.error('Get beneficiary records failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Log report generation activity
 */
export const logReportGeneration = async (req, res) => {
    try {
        const { reportType, reportDetails } = req.body;
        
        // Validate report type
        if (!reportType) {
            return res.json({
                success: false,
                message: 'Report type is required'
            });
        }

        // Create description based on report type and details
        let description = `Generated ${reportType} report`;
        if (reportDetails) {
            if (reportDetails.eventTitle) {
                description += ` for event: ${reportDetails.eventTitle}`;
            }
            if (reportDetails.recordCount) {
                description += ` (${reportDetails.recordCount} record(s))`;
            }
            if (reportDetails.eventCount) {
                description += ` (${reportDetails.eventCount} event(s))`;
            }
        }

        // Log activity
        await logDirectorActivity(
            req.user.account_id,
            'create',
            'report',
            description,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        );

        return res.json({
            success: true,
            message: 'Report generation logged successfully'
        });

    } catch (error) {
        console.error('logReportGeneration failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};