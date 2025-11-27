import models from "../../models/index.js";
import { db } from "../../config/db.js";
import { Op } from "sequelize";
import { getBeneficiaryLocationEvents, runBeneficiaryMatchingAI } from "../../services/beneficiaryMatchingService.js";
import { logBeneficiaryActivity } from "../../services/activityLogService.js";

const extractCityFromAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',').map(part => part.trim());
    return parts[0]; // For Philippine addresses, city is usually the first part
};


export const getBeneficiaryMatchedEvents = async (req, res) => {
    try {
        const { Beneficiary, Event, Organizer, Category, Department, MatchedEvent } = models;
        const user = req.user;

        // Find beneficiary by account_id
        const beneficiary = await Beneficiary.findOne({ 
            where: { account_id: user.account_id } 
        });

        if (!beneficiary) {
            return res.status(404).json({ 
                success: false, 
                message: 'Beneficiary profile not found' 
            });
        }

		// Use cached location-based matching (refresh only if cache expired)
		const result = await getBeneficiaryLocationEvents(beneficiary.beneficiary_id);

		if (!result?.success) {
			return res.json({
				success: true,
				nearYou: [],
				almostNearYou: [],
				recommendations: [],
				beneficiaryLocation: beneficiary.current_address,
				beneficiaryCity: extractCityFromAddress(beneficiary.current_address)
			});
		}

		return res.json({
			success: true,
			nearYou: result.nearYou || [],
			almostNearYou: result.almostNearYou || [],
			recommendations: result.recommendations || [],
			beneficiaryLocation: beneficiary.current_address,
			beneficiaryCity: extractCityFromAddress(beneficiary.current_address)
		});

    } catch (error) {
        console.error('getBeneficiaryMatchedEvents failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};


export const registerBeneficiaryForEvent = async (req, res) => {
    const t = await db.transaction();
    try {
        const { eventId } = req.params;
        const event_id = eventId; // Keep the variable name for compatibility
        const { account_id } = req.user;
        const { 
            current_situation,
            needs,
            how_can_we_help
        } = req.validatedBody;

        // Process uploaded ID verification files
        const idVerificationFiles = req.files ? req.files.map(file => ({
            filename: file.originalname,
            url: file.path,
            public_id: file.filename,
            uploaded_at: new Date()
        })) : [];

        const { Beneficiary, EventRegistration, Event, Notification } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            await t.rollback();
            return res.json({ message: 'Beneficiary information not found' });
        }

        // Check if event exists and is available
        const event = await Event.findOne({ where: { event_id } });
        if (!event) {
            await t.rollback();
            return res.json({ message: 'Event not found' });
        }

        if (event.status !== 'Upcoming') {
            await t.rollback();
            return res.json({ message: 'Unfortunately event has already started or ended.' });
        }

        // Check if already registered
        const existingRegistration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            transaction: t
        });

        if (existingRegistration) {
            await t.rollback();
            return res.json({ message: 'Already registered for this event' });
        }

        // Register beneficiary for event
        const registerEvent = await EventRegistration.create({
            event_id,
            participant_id: beneficiary.beneficiary_id,
            participant_type: 'beneficiary',
            registration_date: new Date(), // Required field
            status: 'pending',         
            current_situation: current_situation && current_situation.trim() !== '' ? current_situation.trim() : null,
            needs: needs && needs.trim() !== '' ? needs.trim() : null,
            how_can_we_help: how_can_we_help && how_can_we_help.trim() !== '' ? how_can_we_help.trim() : null,
            id_verification_files: idVerificationFiles
        }, { transaction: t });

        if (!registerEvent) {
            await t.rollback();
            return res.json({ message: 'Registration failed' });
        }

        // Update participant count
        await Event.update(
            { participants: db.literal('participants + 1') },
            { where: { event_id: event_id }, transaction: t }
        );

        // Get updated event data
        const updatedEvent = await Event.findByPk(event_id, {
            include: [
                { model: models.Category, through: { attributes: [] } },
                { model: models.Department, through: { attributes: [] } },
                { model: models.Organizer }
            ],
            transaction: t
        });

        // Get current participant count
        const participantCount = await EventRegistration.count({
            where: { event_id: event_id },
            transaction: t
        });

        // Create notification for director about new beneficiary registration
        try {
            await Notification.create({
                sender_type: 'beneficiary_registration',
                sender_id: null, // Remove sender_id to avoid foreign key constraint
                recipient_role: 'director',
                recipient_id: null, // Will be sent to all directors
                header: 'New Beneficiary Registration',
                message: `${beneficiary.firstname} ${beneficiary.lastname} has registered for ${event.title}`,
                type: 'event_registration_approval', // Your custom enum value
                is_read: false
            }, { transaction: t });
            
            console.log(`Notification created for beneficiary registration: ${registerEvent.event_registration_id}`);
        } catch (notificationError) {
            console.error('Failed to create notification for beneficiary registration:', notificationError.message);
            // Don't fail the transaction for notification errors
        }

        await t.commit();

        // Log activity - Register for event
        const eventTitle = event.title || `Event ID: ${event_id}`
        await logBeneficiaryActivity(
            account_id,
            'register',
            'event',
            `Registered for event: ${eventTitle}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            message: 'Registration completed successfully',
            participantCount: participantCount,
            event: updatedEvent
        });

    } catch (error) {
        await t.rollback();
        console.error('registerBeneficiaryForEvent failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const cancelBeneficiaryRegistration = async (req, res) => {
    const t = await db.transaction();
    try {
        const { eventId } = req.params;
        const { account_id } = req.user;

        const { EventRegistration, Event, Beneficiary, Category, Department, Organizer } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            await t.rollback();
            return res.json({ message: 'Beneficiary information not found' });
        }

        // Check if event exists
        const event = await Event.findOne({ where: { event_id: eventId } });
        if (!event) {
            await t.rollback();
            return res.json({ message: 'Event not found' });
        }

        // Validate cancellation timing
        const eventStartTime = new Date(event.event_started);
        const currentTime = new Date();
        if (eventStartTime <= currentTime) {
            await t.rollback();
            return res.json({ message: 'Sorry, you cannot cancel your registration because the event has already started' });
        }

        // Find the registration first to check if it exists
        const existingRegistration = await EventRegistration.findOne({
            where: {
                event_id: eventId,
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            transaction: t
        });

        if (!existingRegistration) {
            await t.rollback();
            return res.json({ message: 'Registration not found' });
        }

        // Check if registration can be cancelled (only pending or registered status)
        if (existingRegistration.status === 'cancelled' || existingRegistration.status === 'declined') {
            await t.rollback();
            return res.json({ message: 'Registration cannot be cancelled as it is already cancelled or declined' });
        }

        // Cancel registration
        const cancelledRegistration = await EventRegistration.destroy({
            where: {
                event_id: eventId,
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            transaction: t
        });

        if (!cancelledRegistration) {
            await t.rollback();
            return res.json({ message: 'Registration cancellation failed' });
        }

        // Get current participant count after cancellation
        const participantCount = await EventRegistration.count({
            where: { 
                event_id: eventId,
                status: 'registered' // Only count approved registrations
            },
            transaction: t
        });

        // Update participant count in event
        await Event.update(
            { participants: participantCount },
            { where: { event_id: eventId }, transaction: t }
        );

        // Get updated event data
        const updatedEvent = await Event.findByPk(eventId, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Department, through: { attributes: [] } },
                { model: Organizer }
            ],
            transaction: t
        });

        await t.commit();

        // Log activity - Cancel event registration
        const eventTitle = event.title || `Event ID: ${eventId}`
        await logBeneficiaryActivity(
            account_id,
            'update',
            'event',
            `Cancelled registration for event: ${eventTitle}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            message: 'Your registration has been successfully cancelled.',
            participantCount: participantCount,
            event: updatedEvent
        });

    } catch (error) {
        await t.rollback();
        console.error('cancelBeneficiaryRegistration failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};


export const getBeneficiaryRegisteredEvents = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const { EventRegistration, Event, Beneficiary, Accounts, Category, Department, Organizer } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.json({ message: 'Beneficiary information not found' });
        }

        const rows = await EventRegistration.findAll({
            where: { 
                participant_id: beneficiary.beneficiary_id, 
                participant_type: 'beneficiary',
                status: 'registered' // Only show approved registrations
            },
            include: [
                {
                    model: Event,
                    where: {
                        beneficiary_applicable: true
                    },
                    required: true
                },
                {
                    model: Beneficiary,
                    include: [
                        {
                            model: Accounts
                        }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const count = await EventRegistration.count({
            where: { 
                participant_id: beneficiary.beneficiary_id, 
                participant_type: 'beneficiary',
                status: 'registered'
            },
            distinct: true,
            col: 'event_registration_id'
        });


        // Format data for frontend
        const formattedData = rows.map(registration => {
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

            // Format Event data
            if (registration.Event) {
                registrationData.event = {
                    event_id: registration.Event.event_id,
                    title: registration.Event.title,
                    description: registration.Event.description,
                    event_started: registration.Event.event_started,
                    event_ended: registration.Event.event_ended,
                    location: registration.Event.location,
                    participants: registration.Event.participants,
                    max_participants: registration.Event.max_participants,
                    beneficiary_applicable: registration.Event.beneficiary_applicable
                };
            }

            // Format Beneficiary data
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

                // Format Account data
                if (registration.Beneficiary.Accounts) {
                    registrationData.beneficiary.account = {
                        email: registration.Beneficiary.Accounts.email
                    };
                }
            }

            return registrationData;
        });

        return res.json({
            success: true,
            data: formattedData,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error('getBeneficiaryRegisteredEvents failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};


export const getBeneficiaryPendingRegistrations = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const { EventRegistration, Event, Beneficiary, Accounts, Category, Department, Organizer } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.json({ message: 'Beneficiary information not found' });
        }

        const rows = await EventRegistration.findAll({
            where: { 
                participant_id: beneficiary.beneficiary_id, 
                participant_type: 'beneficiary',
                status: 'pending' // Only show pending registrations
            },
            include: [
                {
                    model: Event,
                    where: {
                        beneficiary_applicable: true
                    },
                    required: true,
                },
                {
                    model: Beneficiary,
                    include: [
                        {
                            model: Accounts
                        }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const count = await EventRegistration.count({
            where: { 
                participant_id: beneficiary.beneficiary_id, 
                participant_type: 'beneficiary',
                status: 'pending'
            },
            distinct: true,
            col: 'event_registration_id'
        });

        
        // Format data for frontend
        const formattedData = rows.map(registration => {
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

            // Format Event data
            if (registration.Event) {
                registrationData.event = {
                    event_id: registration.Event.event_id,
                    title: registration.Event.title,
                    description: registration.Event.description,
                    event_started: registration.Event.event_started,
                    event_ended: registration.Event.event_ended,
                    location: registration.Event.location,
                    participants: registration.Event.participants,
                    max_participants: registration.Event.max_participants,
                    beneficiary_applicable: registration.Event.beneficiary_applicable
                };
            }

            // Format Beneficiary data
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

                // Format Account data
                if (registration.Beneficiary.Accounts) {
                    registrationData.beneficiary.account = {
                        email: registration.Beneficiary.Accounts.email
                    };
                }
            }

            return registrationData;
        });

        return res.json({
            success: true,
            data: formattedData,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
        });

    } catch (error) {
        console.error('getBeneficiaryPendingRegistrations failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

/**
 * Refresh beneficiary location-based matches
 */
export const refreshBeneficiaryMatches = async (req, res) => {
    try {
        const { account_id } = req.user;
        const { Beneficiary } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.status(404).json({ 
                success: false, 
                message: 'Beneficiary profile not found' 
            });
        }

        // Run fresh matching
        const result = await runBeneficiaryMatchingAI(beneficiary.beneficiary_id);

        if (result) {
            return res.json({
                success: true,
                message: 'Location-based matches refreshed successfully'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to refresh matches'
            });
        }

    } catch (error) {
        console.error('refreshBeneficiaryMatches failed:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};


export const getBeneficiaryAttendanceRecords = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const month = req.query.month; // Optional month filter (YYYY-MM format)
        const year = req.query.year; // Optional year filter

        const { Event, Beneficiary, Category, Department, Organizer, Attendance } = models;

        // Find beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.json({ 
                success: false, 
                message: 'Beneficiary information not found',
                data: [],
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalRecords: 0,
                    totalPages: 0
                }
            });
        }

        // Build date filter for month/year
        let eventDateFilter = {};
        if (month && year) {
            // Both month and year specified
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            eventDateFilter = {
                event_started: {
                    [Op.between]: [startDate, endDate]
                }
            };
        } else if (month && !year) {
            // Only month specified, use current year
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, month - 1, 1);
            const endDate = new Date(currentYear, month, 0, 23, 59, 59);
            eventDateFilter = {
                event_started: {
                    [Op.between]: [startDate, endDate]
                }
            };
        } else if (year && !month) {
            // Only year specified
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            eventDateFilter = {
                event_started: {
                    [Op.between]: [startDate, endDate]
                }
            };
        }

        // Get actual attendance records for the beneficiary
        const { rows, count } = await Attendance.findAndCountAll({
            where: { 
                participant_id: beneficiary.beneficiary_id, 
                participant_type: 'beneficiary'
            },
            include: [
                {
                    model: Event,
                    required: true,
                    where: {
                        ...eventDateFilter,
                        status: { [Op.in]: ['Completed', 'Ongoing'] } // Only completed or ongoing events
                    },
                    include: [
                        {
                            model: Category,
                            attributes: ['name']
                        },
                        {
                            model: Department,
                            through: { attributes: [] },
                        },
                        {
                            model: Organizer,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });


        const transformedData = rows.map(attendance => {
            // Calculate actual hours worked based on time_in and time_out
            let actualHours = 0;
            if (attendance.time_in && attendance.time_out) {
                const startTime = new Date(attendance.time_in);
                const endTime = new Date(attendance.time_out);
                actualHours = Math.round((endTime - startTime) / (1000 * 60 * 60) * 100) / 100; // Round to 2 decimal places
            }

            return {
                attendance_id: attendance.attendance_id,
                event_id: attendance.event_id,
                participant_id: attendance.participant_id,
                participant_type: attendance.participant_type,
                time_in: attendance.time_in,
                time_out: attendance.time_out,
                status: attendance.time_out ? 'completed' : 'in_progress',
                hours_worked: actualHours,
                attendance_date: attendance.time_in || attendance.Event.event_started,
                registration_date: attendance.createdAt,
                event: {
                    event_id: attendance.Event.event_id,
                    title: attendance.Event.title,
                    description: attendance.Event.description,
                    location: attendance.Event.location,
                    event_started: attendance.Event.event_started,
                    event_ended: attendance.Event.event_ended,
                    category: attendance.Event.Categories?.[0]?.name || 'General',
                    department: attendance.Event.Departments?.[0]?.department_name || 'General',
                    organizer: attendance.Event.Organizers?.[0]?.name || 'UCLM CARES',
                    status: attendance.Event.status
                }
            };
        });

        return res.json({
            success: true,
            data: transformedData,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error in getBeneficiaryAttendanceRecords:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const getBeneficiaryCompletedRegisteredAttendanceRecords = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const month = req.query.month;
        const year = req.query.year;

        const { Event, Beneficiary, Category, Department, Organizer, Attendance, EventRegistration } = models;

        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.json({ 
                success: false, 
                message: 'Beneficiary information not found',
                data: [],
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalRecords: 0,
                    totalPages: 0
                }
            });
        }

        // optional month/year filter based on event_started
        let eventDateFilter = {};
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            eventDateFilter = { event_started: { [Op.between]: [startDate, endDate] } };
        } else if (month && !year) {
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, month - 1, 1);
            const endDate = new Date(currentYear, month, 0, 23, 59, 59);
            eventDateFilter = { event_started: { [Op.between]: [startDate, endDate] } };
        } else if (year && !month) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);
            eventDateFilter = { event_started: { [Op.between]: [startDate, endDate] } };
        }

        // get registrations with completed events
        const registrations = await EventRegistration.findAll({
            where: { participant_id: beneficiary.beneficiary_id, status: 'registered' },
            attributes: ['event_id'],
            include: [
                { model: Event, required: true, where: { status: 'Completed', ...eventDateFilter }, attributes: ['event_id'] }
            ]
        });

        const eventIds = registrations.map(r => r.event_id);

        if (eventIds.length === 0) {
            return res.json({
                success: true,
                data: [],
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalRecords: 0,
                    totalPages: 0
                }
            });
        }

        const { rows, count } = await Attendance.findAndCountAll({
            where: {
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary',
                event_id: { [Op.in]: eventIds },
                // consider records where the beneficiary actually checked in
                time_in: { [Op.ne]: null }
            },
            include: [
                {
                    model: Event,
                    required: true,
                    include: [
                        { model: Category, attributes: ['name'] },
                        { model: Department, through: { attributes: [] } },
                        { model: Organizer, attributes: ['name'] }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        const transformedData = rows.map(attendance => {
            let actualHours = 0;
            if (attendance.time_in && attendance.time_out) {
                const startTime = new Date(attendance.time_in);
                const endTime = new Date(attendance.time_out);
                actualHours = Math.round((endTime - startTime) / (1000 * 60 * 60) * 100) / 100;
            }

            return {
                attendance_id: attendance.attendance_id,
                event_id: attendance.event_id,
                participant_id: attendance.participant_id,
                participant_type: attendance.participant_type,
                time_in: attendance.time_in,
                time_out: attendance.time_out,
                status: attendance.time_out ? 'completed' : 'in_progress',
                hours_worked: actualHours,
                attendance_date: attendance.time_in || attendance.Event.event_started,
                registration_date: attendance.createdAt,
                event: {
                    event_id: attendance.Event.event_id,
                    title: attendance.Event.title,
                    description: attendance.Event.description,
                    location: attendance.Event.location,
                    event_started: attendance.Event.event_started,
                    event_ended: attendance.Event.event_ended,
                    category: attendance.Event.Categories?.[0]?.name || 'General',
                    department: attendance.Event.Departments?.[0]?.department_name || 'General',
                    organizer: attendance.Event.Organizers?.[0]?.name || 'UCLM CARES',
                    status: attendance.Event.status
                }
            };
        });

        return res.json({
            success: true,
            data: transformedData,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalRecords: count,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error in getBeneficiaryCompletedRegisteredAttendanceRecords:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export const getBeneficiaryParticipationHistory = async (req, res) => {
    try {
        const { account_id } = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { EventRegistration, Event, Beneficiary, Attendance } = models;

        // Resolve beneficiary
        const beneficiary = await Beneficiary.findOne({ where: { account_id } });
        if (!beneficiary) {
            return res.json({ success: false, message: 'Beneficiary not found' });
        }

        // Completed events where the beneficiary was registered
        const completedRegistrations = await EventRegistration.findAll({
            where: {
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            include: [
                {
                    model: Event,
                    where: { status: 'Completed' },
                    include: [
                        { model: models.Category, through: { attributes: [] } },
                        { model: models.Department, through: { attributes: [] } },
                        { model: models.Organizer }
                    ]
                }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        });

        // Total count for pagination (mirror volunteer logic, count completed with optional proof flag if available)
        const totalCount = await EventRegistration.count({
            where: {
                participant_id: beneficiary.beneficiary_id,
                participant_type: 'beneficiary'
            },
            include: [
                { model: Event, where: { status: 'Completed' } }
            ]
        });

        const participationHistory = await Promise.all(
            completedRegistrations.map(async (registration) => {
                const event = registration.Event;

                // Attendance for this event
                const attendance = await Attendance.findOne({
                    where: {
                        event_id: event.event_id,
                        participant_id: beneficiary.beneficiary_id,
                        participant_type: 'beneficiary'
                    }
                });

                // Determine status and time spent similar to volunteer
                let timeSpent = null;
                let timeSpentFormatted = 'No attendance record';
                let displayStatus;

                if (!attendance || !attendance.time_in) {
                    displayStatus = 'Failed to Attend';
                } else if (!attendance.time_out) {
                    timeSpentFormatted = 'Incomplete attendance';
                    displayStatus = 'Failed';
                } else {
                    // Calculate hours
                    const start = new Date(attendance.time_in);
                    const end = new Date(attendance.time_out);
                    const hours = Math.round(((end - start) / (1000 * 60 * 60)) * 100) / 100;
                    timeSpent = hours;
                    // Simple formatting
                    const whole = Math.floor(hours);
                    const mins = Math.round((hours - whole) * 60);
                    const parts = [];
                    if (whole > 0) parts.push(`${whole}hr${whole > 1 ? 's' : ''}`);
                    if (mins > 0) parts.push(`${mins}min${mins > 1 ? 's' : ''}`);
                    timeSpentFormatted = parts.length ? parts.join(' ') : '0mins';
                    displayStatus = registration.proof_uploaded ? 'Completed Requirements' : 'Completed - Requirements Needed';
                }

                return {
                    registration_id: registration.event_registration_id,
                    event_id: event.event_id,
                    event_title: event.title,
                    event_description: event.description,
                    event_started: event.event_started,
                    event_ended: event.event_ended,
                    location: event.location,
                    registration_date: registration.registration_date,
                    status: displayStatus,
                    proof_uploaded: registration.proof_uploaded,
                    proof_uploaded_at: registration.proof_uploaded_at,
                    proof_images: registration.proof_images || [],
                    time_spent_hours: timeSpent,
                    time_spent_formatted: timeSpentFormatted,
                    attendance: attendance ? {
                        time_in: attendance.time_in,
                        time_out: attendance.time_out,
                        method: attendance.method,
                        status: attendance.status
                    } : null,
                    event_details: {
                        categories: event.Categories || [],
                        departments: event.Departments || [],
                        organizer: event.Organizer || null,
                        participants: event.participants,
                        max_participants: event.max_participants
                    }
                };
            })
        );

        return res.json({
            success: true,
            data: participationHistory,
            summary: {
                total_events_completed: totalCount,
                total_time_spent_hours: participationHistory.reduce((t, r) => t + (r.time_spent_hours || 0), 0)
            },
            pagination: {
                totalRecords: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                pageSize: limit
            }
        });

    } catch (error) {
        console.log('Get beneficiary participation history failed:', error.message);
        return res.json({ success: false, message: 'Internal Server Error' });
    }
};