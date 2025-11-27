import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { Op } from "sequelize"
import { runMatchingAIForEvent } from "../../services/matchingService.js"
import { runBeneficiaryMatchingForAllBeneficiaries } from "../../services/beneficiaryMatchingService.js"
import { sendMail } from "../../services/mailService.js"
import { capitalizeFirstLetter } from "../../utils/eventUtils.js"
import { notifyEventDeleted, notifyEventAvailableForDonations } from "../../socket.js"
import { logDirectorActivity, logManagementActivity } from "../../services/activityLogService.js"
import dayjs from "dayjs"


export const addEvent = async (req, res) => {
    const t = await db.transaction()
    try {
        const {
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            organizer_name,
            category,
            specified_category,
            department,
            beneficiary_applicable,
            max_beneficiaries,
        } = req.validatedBody

        const event_image = req.file.path

        if (!req.file) { return res.json({ message: 'Event image is required' }) }

        const {
            Event,
            Category,
            Department,
            EventDepartment,
            EventCategory,
            Organizer
        } = models


        const organizer = await Organizer.create({
            name: organizer_name
        }, { transaction: t })

        const newEvent = await Event.create({
            title: title,
            description: description,
            event_started: event_started,
            event_ended: event_ended,
            location: location,
            latitude: null,
            longitude: null,
            max_participants: max_participants,
            organizer_id: organizer.organizer_id,
            event_image: event_image,
            beneficiary_applicable: beneficiary_applicable || false,
            max_beneficiaries: beneficiary_applicable ? max_beneficiaries : null
        }, { transaction: t })

        const category_name = category === 'Others' ? capitalizeFirstLetter(specified_category.trim()) : category.trim()

        const [newCategory] = await Category.findOrCreate({
            where: { name: category_name },
            defaults: { name: category_name },
            transaction: t
        })

        await EventCategory.create({
            event_id: newEvent.event_id,
            category_id: newCategory.category_id
        }, { transaction: t })

        // if the the category is school then it will insert department
        if(category === 'School')
        {
            const [newDepartment] = await Department.findOrCreate({
                where: { department_name: department },
                defaults: { department_name: department },
                transaction: t
            })

            await EventDepartment.create({
                event_id: newEvent.event_id,
                department_id: newDepartment.department_id
            }, { transaction: t })
        }

        await t.commit()
        
        // Log activity - Event created
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const shortTitle = title.length > 40 ? title.substring(0, 37) + '...' : title
        const startTime = dayjs(event_started).format('MMM D, h:mm A')
        const endTime = dayjs(event_ended).format('MMM D, h:mm A')
        const eventDetails = `"${shortTitle}" | ${category_name} | Start: ${startTime} | End: ${endTime} | Max: ${max_participants}`
        const logDescription = `Created event: ${eventDetails}`
        
        if (roleType === 'director') {
            await logDirectorActivity(accountId, 'create', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        } else {
            await logManagementActivity(accountId, roleType.toLowerCase(), 'create', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        }
        
        // Process matching in background (non-blocking)
        setImmediate(async () => {
            try {
                // Run volunteer matching
                const refreshed = await runMatchingAIForEvent(newEvent.event_id)
                
                // Run beneficiary matching if the event is applicable to beneficiaries
                if (beneficiary_applicable) {
                    const beneficiaryResult = await runBeneficiaryMatchingForAllBeneficiaries(newEvent.event_id)
                    // Log only if there were issues
                    if (beneficiaryResult.failed > 0) {
                        console.warn(`[Event Creation] Beneficiary matching had ${beneficiaryResult.failed} failures out of ${beneficiaryResult.total} beneficiaries`)
                    }
                }
            } catch (error) {
                console.error('Background matching failed:', error.message)
            }
        })
        
        res.json({ success: true, message: 'Event Successfully Created' })

        
    } catch (error) {
        await t.rollback()
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('Add Event controller failed :', error.message)
    }
}

export const updateEvent = async (req, res) => {
    const t = await db.transaction(); 

    try {
        const id = req.params.id;
        const {
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            organizer_name,
            category,
            specified_category,
            department,
            existing_image,
            beneficiary_applicable,
            max_beneficiaries,
        } = req.validatedBody;


        let event_image;

        // If a new file was uploaded via multer
        if (req.file) {
        event_image = req.file.path; // CloudinaryStorage sets this
        } else if (existing_image) {
        // Existing image URL from frontend
        event_image = existing_image;
        } else {
        // No image
        event_image = null;
        }

        const {
            Event,
            Category,
            Department,
            EventDepartment,
            EventCategory,
            Organizer
        } = models;

        const eventExist = await Event.findOne({
            where: { event_id: id },
            attributes: [
                'event_id', 'title', 'description', 'event_started', 'event_ended', 
                'location', 'participants', 'max_participants',
                'funds_donation', 'goods_donation', 'status', 'event_image', 
                'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                'max_beneficiaries', 'createdAt', 'updatedAt'
            ],
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                },
                {
                    model: Department,
                    through: { attributes: [] }
                },
                {
                    model: Organizer
                }
            ]
        });

        if (!eventExist) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const handleFallback_event_image = event_image === null ? eventExist.event_image : event_image

        await Organizer.update(
            { name: organizer_name },
            {
                where: { organizer_id: eventExist.Organizer?.organizer_id },
                transaction: t
            }
        );

        const now = new Date();

        let status

        if (event_started > now) {
            status = 'Upcoming'
        } else if (event_started <= now && event_ended >= now) {
            status = 'Ongoing'
        } else if (event_ended < now) {
            status = 'Completed'
        }

        await Event.update({
            title,
            description,
            event_started,
            event_ended,
            location,
            max_participants,
            status,
            event_image : handleFallback_event_image,
            beneficiary_applicable: beneficiary_applicable || false,
            max_beneficiaries: beneficiary_applicable ? max_beneficiaries : null
        }, {
            where: { event_id: eventExist.event_id },
            transaction: t
        });
        const category_name = category === 'Others' ? capitalizeFirstLetter(specified_category.trim()) : category.trim()

        // Update first Category if exist
        const currentCategory = eventExist.Categories?.[0];
        if (currentCategory) {
            await Category.update(
                { name: category_name },
                {
                    where: { category_id: currentCategory.category_id },
                    transaction: t
                }
            );

            await EventCategory.update(
                {
                    event_id: eventExist.event_id,
                    category_id: currentCategory.category_id
                },
                {
                    where: {
                        event_id: eventExist.event_id,
                        category_id: currentCategory.category_id
                    },
                    transaction: t
                }
            );
        }

        if (category === 'School') {
            const currentDept = eventExist.Departments?.[0];
            if (currentDept) {
                await Department.update(
                    { department_name: department },
                    {
                        where: { department_id: currentDept.department_id },
                        transaction: t
                    }
                );

                await EventDepartment.update(
                    {
                        event_id: eventExist.event_id,
                        department_id: currentDept.department_id
                    },
                    {
                        where: {
                            event_id: eventExist.event_id,
                            department_id: currentDept.department_id
                        },
                        transaction: t
                    }
                );
            }
        }

        await t.commit();
        
        // Log activity - Event updated
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const shortTitle = title.length > 35 ? title.substring(0, 32) + '...' : title
        const startTime = dayjs(event_started).format('MMM D, h:mm A')
        const endTime = dayjs(event_ended).format('MMM D, h:mm A')
        const eventDetails = `"${shortTitle}" | ${category_name} | Start: ${startTime} | End: ${endTime} | Status: ${status}`
        const logDescription = `Updated event: ${eventDetails}`
        
        if (roleType === 'director') {
            await logDirectorActivity(accountId, 'update', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        } else {
            await logManagementActivity(accountId, roleType.toLowerCase(), 'update', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        }
        
        // Process matching in background (non-blocking)
        setImmediate(async () => {
            try {
                // Run volunteer matching
                const refreshed = await runMatchingAIForEvent(eventExist.event_id)
                
                // Run beneficiary matching if the event is applicable to beneficiaries
                if (beneficiary_applicable) {
                    const beneficiaryResult = await runBeneficiaryMatchingForAllBeneficiaries(eventExist.event_id)
                    // Log only if there were issues
                    if (beneficiaryResult.failed > 0) {
                        console.warn(`[Event Update] Beneficiary matching had ${beneficiaryResult.failed} failures out of ${beneficiaryResult.total} beneficiaries`)
                    }
                }
            } catch (error) {
                console.error('Background matching failed:', error.message)
            }
        })
        
        return res.json({ success: true, message: 'Event Successfully Updated' });

    } catch (error) {
        await t.rollback();
        console.error('Update Event controller failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const listEvent = async (req, res) => {
    try {
        const {
            Event,
            Category,
            Department,
            Organizer,
            Accounts,
            Coordinator,
            Role
        } = models

        let events = []

        switch(req.user.Role.name) {
            case 'director':
            case 'staff':
                events = await Event.findAll({
                    attributes: [
                        'event_id', 'title', 'description', 'event_started', 'event_ended', 
                        'location', 'participants', 'max_participants',
                        'funds_donation', 'goods_donation', 'status', 'event_image', 
                        'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                        'max_beneficiaries', 'createdAt', 'updatedAt'
                    ],
                    include: [
                    {
                        model: Category,
                        through: { attributes: [] }
                    },
                    {
                        model: Department,
                        through: { attributes: [] }
                    },
                    {
                        model: Organizer
                    },
                ] })
                break
            
            case 'coordinator':
            case 'assistant_coordinator':
                events = await Event.findAll({
                    attributes: [
                        'event_id', 'title', 'description', 'event_started', 'event_ended', 
                        'location', 'participants', 'max_participants',
                        'funds_donation', 'goods_donation', 'status', 'event_image', 
                        'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                        'max_beneficiaries', 'createdAt', 'updatedAt'
                    ],
                    include: [
                    {
                        model: Category,
                        through: { attributes: [] }
                    },
                    {
                        model: Department,
                        through: { attributes: [] }
                    },
                    {
                        model: Organizer
                    },
                ] })
                break
            
            default:
                console.log('role is out of the scope')
                break
        }

        if(!events) { return res.json({ message: 'event list not empty' }) }
        
        res.json({ success: true, message: 'list of events', list: events })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.error('Get Event controller failed :', error.message)
    }
}

export const getParticipantEvent = async (req, res) => {
    try {
        const { event_id } = req.params;

        const { EventRegistration, Volunteer, Department, CampusUsers, Staff, Coordinator, Director, Accounts } = models;

        const registrations = await EventRegistration.findAll({
            where: { event_id }
        });

        const detailedRegistrations = await Promise.all(
            registrations.map(async reg => {
                let participantData = null;
                let participantType = reg.participant_type;

                switch (participantType) {
                    case 'volunteer': {
                        const volunteer = await Volunteer.findByPk(reg.participant_id, {
                            include: { 
                                model: CampusUsers,
                                include: [
                                    { model: Department },
                                ]
                            }
                        });

                        if (volunteer) {
                            participantData = {
                                volunteer_id: volunteer.volunteer_id,
                                type: volunteer.CampusUser?.type || "student",
                                details: volunteer.CampusUser
                                    ? {
                                        campus_user_id: volunteer.CampusUser.campus_user_id,
                                        school_number: volunteer.CampusUser.school_number,
                                        firstname: volunteer.CampusUser.firstname,
                                        lastname: volunteer.CampusUser.lastname,
                                        gender: volunteer.CampusUser.gender?.trim(),
                                        middle_initial: volunteer.CampusUser.middle_initial,
                                        age: volunteer.CampusUser.age,
                                        disability: volunteer.CampusUser.disability,
                                        phone_number: volunteer.CampusUser.phone_number,
                                        current_address: volunteer.CampusUser.current_address,
                                        image_url: volunteer.profile_image
                                    }
                                    : {},
                                academic_info: {
                                    department: volunteer?.CampusUser?.Department?.department_name,
                                },
                                volunteer_info: {
                                    interested_events: volunteer.interested_events,
                                    total_hours_volunteered: volunteer.total_hours_volunteered,
                                    is_subscribed: volunteer.is_subscribed
                                }
                            };
                        }
                        break;
                    }
                    case 'staff': {
                        const staff = await Staff.findByPk(reg.participant_id);
                        if (staff) {
                            participantData = {
                                type: "staff",
                                details: {
                                    staff_id: staff.staff_id,
                                    firstname: staff.firstname,
                                    lastname: staff.lastname,
                                    email: staff.email,
                                    phone_number: staff.phone_number
                                }
                            };
                        }
                        break;
                    }
                    case 'coordinator':
                        const coordinator = await Coordinator.findByPk(reg.participant_id, {
                            include: [
                                { model: Department },
                                { 
                                    model: Accounts,
                                    attributes: ['email']
                                }
                            ]
                        });
                        if (coordinator) {
                            participantData = {
                                type: "coordinator",
                                details: {
                                    coordinator_id: coordinator.coordinator_id,
                                    firstname: coordinator.firstname,
                                    lastname: coordinator.lastname,
                                    email: coordinator.Account?.email,
                                    phone_number: coordinator.phone_number
                                },
                                department: coordinator.Department
                                    ? {
                                        department_id: coordinator.Department.department_id,
                                        department_name: coordinator.Department.department_name
                                    }
                                    : null
                            };
                        break;
                    }

                    case 'assistant_coordinator':
                        const assistant_coordinator = await Coordinator.findByPk(reg.participant_id, {
                            include: [
                                { model: Department },
                                { 
                                    model: Accounts,
                                    attributes: ['email']
                                }
                            ]
                        });
                        if (assistant_coordinator) {
                            participantData = {
                                type: "assistant_coordinator",
                                details: {
                                    coordinator_id: assistant_coordinator.coordinator_id,
                                    firstname: assistant_coordinator.firstname,
                                    lastname: assistant_coordinator.lastname,
                                    email: assistant_coordinator.Account?.email,
                                    phone_number: assistant_coordinator.phone_number
                                },
                                department: assistant_coordinator.Department
                                    ? {
                                        department_id: assistant_coordinator.Department.department_id,
                                        department_name: assistant_coordinator.Department.department_name
                                    }
                                    : null
                            };
                        }
                        break;

                    case 'director':
                        const director = await Director.findByPk(reg.participant_id);
                        if (director) {
                            participantData = {
                                type: "director",
                                details: {
                                    director_id: director.director_id,
                                    firstname: director.firstname,
                                    lastname: director.lastname,
                                    email: director.email,
                                    phone_number: director.phone_number
                                }
                            };
                        }
                        break;
                    default:
                        console.log('participant type is out of our scope');
                }

                return {
                    registration: {
                        event_registration_id: reg.event_registration_id,
                        event_id: reg.event_id,
                        participant_type: reg.participant_type,
                        registration_date: reg.registration_date,
                        status: reg.status
                    },
                    emergency_contact: {
                        fullname: reg.emergency_fullname,
                        number: reg.emergency_number,
                        relationship: reg.relationship,
                        email: reg.emergency_contact_email
                    },
                    participant: participantData
                }
            })
        )

        return res.json({ success: true, participants: detailedRegistrations });
    } catch (error) {
        console.log('get participants registered event failed: ', error.message);
        return res.json({ success: false, message: "Internal Server Error" });
    }
};

export const getEventUserStatus = async (req, res) => {
    try {
        const { event_id } = req.params;
        const roleType = req.user.Role.name

        const { Director, Staff, Coordinator, EventRegistration, CampusUsers, Department, Volunteer } = models

        let payload = {}
        let participant_id
        let participant_type

        switch(roleType) {
            case 'director':
                payload = await Director.findOne({ where: { account_id: req.user.account_id } })
                participant_type = 'director'
                participant_id = payload.director_id
                break;
            case 'staff':
                payload = await Staff.findOne({ where: { account_id: req.user.account_id } })
                participant_type = 'staff'
                participant_id = payload.staff_id
                break;
            case 'coordinator':
                payload = await Coordinator.findOne({ where: { account_id: req.user.account_id },
                    include: { model: Department } })
                    participant_type = 'coordinator'
                participant_id = payload.coordinator_id
                break;
            case 'assistant_coordinator':
                payload = await Coordinator.findOne({ where: { account_id: req.user.account_id },
                    include: { model: Department } })
                    participant_type = 'assistant_coordinator'
                    participant_id = payload.coordinator_id
                break;
            case 'volunteer':
                const campusUserData = await CampusUsers.findOne({ where: { account_id: req.user.account_id } })
                payload = await Volunteer.findOne({ where: { campus_user_id: campusUserData.campus_user_id }})
                participant_type = 'volunteer'
                participant_id = payload.volunteer_id
                break;
            default:
                console.log('get event user status failed: ', error.message);
                break;
        }

        const registered = await EventRegistration.findOne({
            where: { participant_id: participant_id, participant_type: participant_type , event_id: event_id, status: 'registered' },
        })


        return res.json({ user: req.user, status: !!registered })
        
    } catch (error) {
        res.json({ success: false, message: "Internal Server Error" });
        console.log('get registered event status failed: ', error.message);
    }
}

export const getRegisteredParticipantCount = async (req, res) => {
    try {
        const { event_id } = req.params

        const { EventRegistration, Event } = models

        const eventValidated = await Event.findOne({ where: { event_id: event_id } })
        if(!eventValidated) { return res.json({ message: 'event not found' }) }

        const { count } = await EventRegistration.findAndCountAll({ where: { event_id: eventValidated.event_id } })
        if(count.length === 0 ) { return res.json({ message: 'no one register yet' }) }

        return res.json({ success: true, count: count })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('get registered participant count failed: ', error)
    }
}

export const destroyEventId = async (req, res) => {
    const t = await db.transaction()
    try {
        const id = req.params.id
        const { Event, Category } = models

        const event = await Event.findOne({ where: { event_id: id },
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                }
            ],
            transaction: t
        })

        if(!event) { t.rollback(); return res.json({ message: 'event id not found' }) }

        // Store event details before deletion for socket notification
        const eventTitle = event.title
        const eventId = event.event_id
        const eventCategory = event.Categories?.[0]?.name || 'N/A'
        const eventStartTime = event.event_started ? dayjs(event.event_started).format('MMM D, h:mm A') : 'N/A'
        const eventEndTime = event.event_ended ? dayjs(event.event_ended).format('MMM D, h:mm A') : 'N/A'

        await Event.destroy({ where: { event_id: event.event_id }, transaction: t })
        
        await t.commit()
        
        // Log activity - Event deleted
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const shortTitle = eventTitle.length > 40 ? eventTitle.substring(0, 37) + '...' : eventTitle
        const eventDetails = `"${shortTitle}" | ${eventCategory} | Start: ${eventStartTime} | End: ${eventEndTime}`
        const logDescription = `Deleted event: ${eventDetails}`
        
        if (roleType === 'director') {
            await logDirectorActivity(accountId, 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        } else {
            await logManagementActivity(accountId, roleType.toLowerCase(), 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        }
        
        // Emit socket event to notify all connected clients about the deletion
        try {
            notifyEventDeleted(eventId, eventTitle)
        } catch (socketError) {
            console.error('Failed to emit event deletion socket event:', socketError.message)
            // Don't fail the deletion if socket emission fails
        }
        
        res.json({ success: true, message: 'select event successfully deleted' })

    } catch (error) {
        await t.rollback()
        console.error('Delete Event By Id controller failed:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const destroyEvents = async (req, res) => {
    try {
        const { Event, EventCategory } = models

        // Get count of events before deletion for logging
        const eventCount = await Event.count()

        await Event.destroy({ where: {}, truncate: false })
        await EventCategory.destroy({ where: {}, truncate: false })

        // Log activity - All events deleted
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const logDescription = `Deleted all events (${eventCount} total)`

        if (roleType === 'director') {
            await logDirectorActivity(accountId, 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        } else {
            await logManagementActivity(accountId, roleType.toLowerCase(), 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        }

        res.json({ success: true, message: 'All Events Successfully Destroyed' })

    } catch (error) {
        console.error('Delete All Events controller failed:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const removeEventRegistration = async (req, res) => {
    const t = await db.transaction()
    try {
        const { registration_id } = req.params
        const { reason } = req.body
        const { EventRegistration, Event, Volunteer, CampusUsers, Staff, Coordinator, Director, Accounts } = models

        // Find the registration with participant details
        const registration = await EventRegistration.findByPk(registration_id, { 
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'event_started', 'event_ended', 'location']
                }
            ],
            transaction: t 
        })
        
        if (!registration) { 
            await t.rollback()
            return res.json({ success: false, message: 'Registration not found' }) 
        }

        // Get participant details for email notification
        let participantData = null
        let participantEmail = null
        let participantName = 'Participant'

        switch (registration.participant_type) {
            case 'volunteer': {
                const volunteer = await Volunteer.findByPk(registration.participant_id, {
                    include: { 
                        model: CampusUsers,
                        include: [{ model: Accounts, attributes: ['email'] }]
                    },
                    transaction: t
                })
                if (volunteer?.CampusUser) {
                    participantData = volunteer.CampusUser
                    participantEmail = volunteer.CampusUser.Account?.email
                    participantName = `${volunteer.CampusUser.firstname} ${volunteer.CampusUser.lastname}`
                }
                break
            }
            case 'staff': {
                const staff = await Staff.findByPk(registration.participant_id, {
                    include: [{ model: Accounts, attributes: ['email'] }],
                    transaction: t
                })
                if (staff) {
                    participantData = staff
                    participantEmail = staff.Account?.email
                    participantName = `${staff.firstname} ${staff.lastname}`
                }
                break
            }
            case 'coordinator':
            case 'assistant_coordinator': {
                const coordinator = await Coordinator.findByPk(registration.participant_id, {
                    include: [{ model: Accounts, attributes: ['email'] }],
                    transaction: t
                })
                if (coordinator) {
                    participantData = coordinator
                    participantEmail = coordinator.Account?.email
                    participantName = `${coordinator.firstname} ${coordinator.lastname}`
                }
                break
            }
            case 'director': {
                const director = await Director.findByPk(registration.participant_id, {
                    include: [{ model: Accounts, attributes: ['email'] }],
                    transaction: t
                })
                if (director) {
                    participantData = director
                    participantEmail = director.Account?.email
                    participantName = `${director.firstname} ${director.lastname}`
                }
                break
            }
        }

        // Delete the registration
        await EventRegistration.destroy({ 
            where: { event_registration_id: registration_id }, 
            transaction: t 
        })
        
        await t.commit()

        // Log activity - Event registration removed
        const accountId = req.user.account_id
        const roleType = req.user.Role.name
        const shortEventTitle = registration.Event.title.length > 40 ? registration.Event.title.substring(0, 37) + '...' : registration.Event.title
        const shortParticipantName = participantName.length > 30 ? participantName.substring(0, 27) + '...' : participantName
        const shortReason = reason && reason.length > 30 ? reason.substring(0, 27) + '...' : reason
        const eventDetails = `"${shortEventTitle}" | ${shortParticipantName} (${registration.participant_type})${shortReason ? ` | ${shortReason}` : ''}`
        const logDescription = `Removed registration: ${eventDetails}`

        if (roleType === 'director') {
            await logDirectorActivity(accountId, 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        } else {
            await logManagementActivity(accountId, roleType.toLowerCase(), 'delete', 'event', logDescription.substring(0, 255), req.ip || req.connection.remoteAddress, req.get('user-agent'))
        }

        // Send email notification if participant email exists
        if (participantEmail && reason) {
            try {
                const eventDate = new Date(registration.Event.event_started).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                
                const eventTime = new Date(registration.Event.event_started).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })

                const emailVariables = {
                    email: process.env.AUTH_MAILER,
                    title: 'Event Registration Removed',
                    description: 'Your registration for an upcoming event has been removed by the event organizers.',
                    status_title: 'Registration Status: Removed',
                    status_description: 'You are no longer registered for this event.',
                    event_title: registration.Event.title,
                    event_date: eventDate,
                    event_time: eventTime,
                    event_location: registration.Event.location,
                    reason: reason,
                    action_title: 'What this means:',
                    action_text: 'You will not be able to attend this event. If you believe this was done in error or have any questions, please contact the event organizers or our support team.'
                }

                await sendMail(
                    participantEmail,
                    'Event Registration Removed - UCLM CARES',
                    'Your event registration has been removed',
                    'participantRemovalNotification.html',
                    emailVariables
                )

                console.log(`Email notification sent to ${participantName} (${participantEmail}) for registration removal`)
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError.message)
                // Don't fail the main operation if email fails
            }
        }
        
        res.json({ success: true, message: 'Registration successfully removed' })

    } catch (error) {
        await t.rollback()
        console.error('Remove Event Registration controller failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

/**
 * Get all upcoming and ongoing events
 * Public endpoint - used by forms and other services
 */
export const getEvents = async (req, res) => {
    try {
        const { Event } = models;
        
        const events = await Event.findAll({
            attributes: ['event_id', 'title', 'status', 'event_started', 'event_ended', 'location'],
            where: {
                status: {
                    [Op.in]: ['Upcoming', 'Ongoing']
                }
            },
            order: [['event_started', 'ASC']]
        });

        return res.status(200).json({
            success: true,
            message: "Events retrieved successfully",
            events
        });

    } catch (error) {
        console.error("Get events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
