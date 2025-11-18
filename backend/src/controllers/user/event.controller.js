import models from "../../models/index.js"
import { db } from "../../config/db.js"
import { Op } from "sequelize"
import { runMatchingAI } from "../../services/matchingService.js"

export const addInterest = async (req, res) => {
    const t = await db.transaction()
    try {
        const account = req.user

        const { interest } = req.validatedBody

        const { CampusUsers, Volunteer } = models

        const campusUserValid = await CampusUsers.findOne({ where: { account_id: account.account_id } })

        if (!campusUserValid) { return t.rollback(), res.json({ message: 'campus user not found' }) }

        const existingVolunteer = await Volunteer.findOne({ where: { campus_user_id: campusUserValid.campus_user_id } })

        let volunteerInstance
        if (existingVolunteer) {
            await existingVolunteer.update({ interested_events: interest }, { transaction: t })
            volunteerInstance = existingVolunteer
        } else {
            volunteerInstance = await Volunteer.create({
                campus_user_id: campusUserValid.campus_user_id,
                department_id: campusUserValid.department_id,
                course_id: campusUserValid.course_id,
                strand_course_id: campusUserValid.strand_course_id,
                yl_id: campusUserValid.yl_id,
                interested_events: interest,
                is_beneficiary: false
            }, { transaction: t })
        }

        // load the matching ai
        const runMatching = await runMatchingAI(volunteerInstance.volunteer_id)
        if(runMatching) console.log('check interests is refreshed && matched refreshed as well ;>')

        await t.commit()
        res.json({ success: true, message: 'Successfully Added Interests' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}

export const updateInterest = async (req, res) => {
    const t = await db.transaction()
    try {
        const account = req.user

        const { interest } = req.validatedBody

        const { CampusUsers, Volunteer, Course, YearLevel } = models

        const campusUserValid = await CampusUsers.findOne({
            where: { account_id: account.account_id },
            include: [
                { model: Course },
                { model: YearLevel },
            ]
        })

        if (!campusUserValid) { return t.rollback(), res.json({ message: 'campus user not found' }) }

        const existingVolunteer = await Volunteer.findOne({ where: { campus_user_id: campusUserValid.campus_user_id } })

        let volunteerInstance
        if (existingVolunteer) {
            await existingVolunteer.update({ interested_events: interest }, { transaction: t })
            volunteerInstance = existingVolunteer
        } else {
            volunteerInstance = await Volunteer.create({
                campus_user_id: campusUserValid.campus_user_id,
                department_id: campusUserValid.department_id,
                course_id: campusUserValid.Course?.course_id || campusUserValid.course_id,
                yl_id: campusUserValid.YearLevel?.yl_id || campusUserValid.yl_id,
                interested_events: interest,
                is_beneficiary: false
            }, { transaction: t })
        }

        // load the matching ai
        const runMatching = await runMatchingAI(volunteerInstance.volunteer_id)
        if(runMatching) console.log('check interests is refreshed && matched refreshed as well ;>')

        await t.commit()
        res.json({ success: true, message: 'Successfully Added Interests' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}

export const checkInterest = async (req, res) => {
    try {
        const user = req.user;

        const { CampusUsers, Volunteer } = models;
        const campusUser = await CampusUsers.findOne({
            where: { account_id: user.account_id }
        });

        if (!campusUser) {
            return res.status(404).json({ success: false, message: 'Campus user not found', hasInterests: false });
        }

        const volunteer = await Volunteer.findOne({
            where: { campus_user_id: campusUser.campus_user_id },
            attributes: ['volunteer_id', 'interested_events']
        });

        if (!volunteer) {
            return res.json({ success: true, hasInterests: false, interests: [] })
        }

        // Check if interests exist and are not empty
        const hasInterests = volunteer.interested_events && volunteer.interested_events.length > 0

        // load the matching ai
        // const runMatching = await runMatchingAI(volunteer.volunteer_id)
        // if(runMatching) console.log('check interests is refreshed && matched refreshed as well ;>')

        return res.json({ success: true, hasInterest: hasInterests, interest: volunteer.interested_events || [] });

    } catch (error) {
        console.log('check interest controller failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error', hasInterests: false });
    }
}

export const getMatchedEvents = async (req, res) => {
  try {
    const { CampusUsers, Volunteer, Organizer, Category, Event, Department, MatchedEvent } = models
    const user = req.user;

    const campusUser = await CampusUsers.findOne({ where: { account_id: user.account_id } })
    if (!campusUser) return res.json({ message: 'campus user not found' })

    const volunteer = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })
    if (!volunteer) return res.json({ message: 'Must complete your profile info' })

    const record = await MatchedEvent.findOne({ where: { volunteer_id: volunteer.volunteer_id } })

    if (!record) {
      return res.json({
        success: true,
        events: [],
        recommendations: [],
        message: 'No matches yet. Update interests or wait for new events.'
      })
    }

    const matchedIds = record.matched_ids || []
    const recoIds = record.recommendation_ids || []

    const [fetchMatchedEvents, fetchRecommendationEvents] = await Promise.all([
      matchedIds.length
        ? Event.findAll({
            where: {
              event_id: { [Op.in]: matchedIds },
              status: { [Op.ne]: 'Completed' }
            },
            attributes: [
                'event_id', 'title', 'description', 'event_started', 'event_ended', 
                'location', 'participants', 'max_participants',
                'funds_donation', 'goods_donation', 'status', 'event_image', 
                'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                'max_beneficiaries', 'createdAt', 'updatedAt'
            ],
            include: [
              { model: Department, through: { attributes: [] } },
              { model: Category, through: { attributes: [] } },
              { model: Organizer }
            ]
          })
        : Promise.resolve([]),

      recoIds.length
        ? Event.findAll({
            where: {
              event_id: { [Op.in]: recoIds },
              status: { [Op.ne]: 'Completed' } // exclude completed
            },
            attributes: [
                'event_id', 'title', 'description', 'event_started', 'event_ended', 
                'location', 'participants', 'max_participants',
                'funds_donation', 'goods_donation', 'status', 'event_image', 
                'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                'max_beneficiaries', 'createdAt', 'updatedAt'
            ],
            include: [
              { model: Department, through: { attributes: [] } },
              { model: Category, through: { attributes: [] } },
              { model: Organizer }
            ]
          })
        : Promise.resolve([])
    ])

    console.log('get match is triggered', fetchMatchedEvents)

    return res.json({
      success: true,
      events: fetchMatchedEvents,
      recommendations: fetchRecommendationEvents
    })

  } catch (error) {
    res.json({ message: 'Internal Server Error' })
    console.log('getMatchedEvents failed:', error.message)
  }
}

export const register_event = async (req, res) => {
    const t = await db.transaction()
    try {
        const event_id = req.params.eventId
        const user = req.user

        const { notes } = req.validatedBody

        console.log(notes)

        if (event_id === 0 || event_id === null) { return res.json({ message: 'event id is not provided' }) }

        const { Volunteer, CampusUsers, EventRegistration, Event } = models

        const isCampusUserExist = await CampusUsers.findOne({ where: { account_id: user.account_id } })
        if (!isCampusUserExist) { await t.rollback(); return res.json({ message: 'campus user not found' }) }


        const isVolunteerExist = await Volunteer.findOne({ where: { campus_user_id: isCampusUserExist.campus_user_id } })
        if (!isVolunteerExist) { await t.rollback(); return res.json({ message: 'your volunteer info is not found' }) }

        const existingRegistration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                participant_id: isVolunteerExist.volunteer_id,
                participant_type: 'volunteer'
            },
            transaction: t
        })

        if (existingRegistration) {
            await t.rollback()
            return res.json({ message: 'Already registered for this event' })
        }

        await EventRegistration.create({
            event_id: event_id,
            participant_id: isVolunteerExist.volunteer_id,
            participant_type: 'volunteer',
            registration_date: new Date(),
            status: 'registered',
            notes: notes
        }, { transaction: t })

        await Event.update(
            { participants: db.literal('participants + 1') },
            { where: { event_id: event_id }, transaction: t }
        )

        await t.commit()

        res.json({ success: true, message: 'You Successfully Registered an Event' })

    } catch (error) {
        await t.rollback()
        res.json({ message: 'Interval Server Error' })
        console.log('add interest controller failed: ', error.message)
    }
}

export const event_registration = async (req, res) => {
    const t = await db.transaction()
    try {
        const { emergency_contact_fullname, emergency_contact_number, relationship, emergency_contact_email } = req.validatedBody
        const { event_id } = req.params
        const { account_id } = req.user

        const { CampusUsers, Volunteer, EventRegistration, Event } = models

        const campusUser = await CampusUsers.findOne({ where: { account_id } })
        if(!campusUser) { 
            await t.rollback()
            return res.json({ message: 'information not found' }) 
        }

        const volunterData = await Volunteer.findOne({ where: {campus_user_id: campusUser.campus_user_id}, 
            include: [
                { model: CampusUsers }
            ]
        })

        if(!volunterData) {
            await t.rollback()
            return res.json({ message: 'volunteer information not found' })
        }

        const isStatusValid = await Event.findOne({ where: { event_id } })
        if(!isStatusValid) {
            await t.rollback()
            return res.json({ message: 'event not found' })
        }
        
        if(isStatusValid.status !== 'Upcoming') { 
            await t.rollback()
            return res.json({ message: 'Unfortunately event has already started or ended.' }) 
        }

        // Check if already registered
        const existingRegistration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                participant_id: volunterData.volunteer_id,
                participant_type: 'volunteer'
            },
            transaction: t
        })

        if (existingRegistration) {
            await t.rollback()
            return res.json({ message: 'Already registered for this event' })
        }

        // Convert empty strings to null for optional fields
        const registerEvent = await EventRegistration.create({
            event_id,
            participant_id: volunterData.volunteer_id,
            participant_type: 'volunteer',
            registration_date: new Date(),
            status: 'registered',
            emergency_fullname: emergency_contact_fullname && emergency_contact_fullname.trim() !== '' ? emergency_contact_fullname : null,
            emergency_number: emergency_contact_number && emergency_contact_number.trim() !== '' ? emergency_contact_number : null,
            relationship: relationship && relationship.trim() !== '' ? relationship : null,
            emergency_contact_email: emergency_contact_email && emergency_contact_email.trim() !== '' ? emergency_contact_email : null
        }, { transaction: t })

        if(!registerEvent) { 
            await t.rollback()
            return res.json({ message: 'registration failed' }) 
        }

        // Update participant count
        await Event.update(
            { participants: db.literal('participants + 1') },
            { where: { event_id: event_id }, transaction: t }
        )

        // Get updated event data for real-time update
        const updatedEvent = await Event.findByPk(event_id, {
            include: [
                { model: models.Category, through: { attributes: [] } },
                { model: models.Department, through: { attributes: [] } },
                { model: models.Organizer }
            ],
            transaction: t
        })

        // Get current participant count
        const participantCount = await EventRegistration.count({
            where: { event_id: event_id },
            transaction: t
        })

        await t.commit()

        return res.json({ 
            success: true, 
            message: 'Registration completed',
            participantCount: participantCount,
            event: updatedEvent
        })

    } catch (error) {
        await t.rollback()
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('event registration failed: ', error.message)
    }
}

export const cancel_registration = async (req, res) => {
    const t = await db.transaction()
    try {
        const { event_id } = req.params
        const { account_id } = req.user

        const { EventRegistration, Event, CampusUsers, Volunteer } = models
        const eventValid = await Event.findOne({ where: { event_id } })
        const userValid = await CampusUsers.findOne({ where: { account_id } })

        if(!eventValid) { 
            await t.rollback()
            return res.json({ message: 'event is not found' }) 
        }
        if(!userValid) { 
            await t.rollback()
            return res.json({ message: 'user is not found' }) 
        }

        const volunteer = await Volunteer.findOne({ where: { campus_user_id: userValid.campus_user_id } })
        if(!volunteer) { 
            await t.rollback()
            return res.json({ message: 'student info to proceed to volunteer is not found' }) 
        }

        // validate the cancellation if it is already started then it won't proceed
        if(eventValid.event_started <= Date.now()) {
            await t.rollback()
            return res.json({ message: 'Sorry, you cannot cancel your registration because the event has already started' })
        }

        const cancelledRegistrationData = await EventRegistration.destroy({ 
            where: { 
                event_id: eventValid.event_id,
                participant_id: volunteer.volunteer_id,
                participant_type: 'volunteer' 
            },
            transaction: t
        })

        if(!cancelledRegistrationData) { 
            await t.rollback()
            return res.json({ message: 'cancellation of registration is not successfully cancelled' }) 
        }

        // Update participant count
        await Event.update(
            { participants: db.literal('participants - 1') },
            { where: { event_id: event_id }, transaction: t }
        )

        // Get updated event data for real-time update
        const updatedEvent = await Event.findByPk(event_id, {
            include: [
                { model: models.Category, through: { attributes: [] } },
                { model: models.Department, through: { attributes: [] } },
                { model: models.Organizer }
            ],
            transaction: t
        })

        // Get current participant count
        const participantCount = await EventRegistration.count({
            where: { event_id: event_id },
            transaction: t
        })

        await t.commit()
        
        return res.json({ 
            success: true, 
            message: 'Your registration has been successfully cancelled.',
            participantCount: participantCount,
            event: updatedEvent
        })

    } catch (error) {
        await t.rollback()
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('cancel registration failed: ', error)
    }
}

export const get_all_registered_events = async (req, res) => {
    try {
        const { account_id } = req.user

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const offset = (page - 1) * limit

        const { EventRegistration, Event, Volunteer, CampusUsers } = models
        const userValid = await CampusUsers.findOne({ where: { account_id } })

        if(!userValid) { return res.json({ message: 'user is not found' }) }

        const volunteer = await Volunteer.findOne({ where: { campus_user_id: userValid.campus_user_id } })
        if(!volunteer) { return res.json({ message: 'student info to proceed to volunteer is not found' }) }

        const rows = await EventRegistration.findAll({
            where: { participant_id: volunteer.volunteer_id, participant_type: 'volunteer' },
            include: [
                { 
                    model: Event,
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
        })

        // Process each registration to add certificate requirement status
        const processedRows = rows.map(registration => {
            const event = registration.Event;
            
            // Determine status based on event completion and proof upload
            let displayStatus = registration.status;
            
            if (event && event.status === 'Completed') {
                if (registration.proof_uploaded) {
                    displayStatus = 'Completed Requirements';
                } else {
                    displayStatus = 'Completed - Requirements Needed';
                }
            }

            return {
                ...registration.toJSON(),
                display_status: displayStatus,
                certificate_requirement_status: {
                    proof_uploaded: registration.proof_uploaded,
                    proof_uploaded_at: registration.proof_uploaded_at,
                    proof_images: registration.proof_images || []
                }
            };
        })

        const count = await EventRegistration.count({
            where: { participant_id: volunteer.volunteer_id, participant_type: 'volunteer' },
            distinct: true,   // ensures unique counting
            col: 'event_registration_id'
        });

        res.json({
            success: true,
            data: processedRows,
            pagination: {
              totalRecords: count,
              totalPages: Math.ceil(count / limit),
              currentPage: page,
              pageSize: limit,
            },
        }) 

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('get all registered events failed: ', error)
    }
}

export const get_all_events_calendar = async (req, res) => {
    try {
        console.log('Calendar request received for user:', req.user?.account_id)
        const { Event, Category, MatchedEvent, Volunteer, CampusUsers, Accounts } = models
        
        // Check if user is authenticated
        if (!req.user || !req.user.account_id) {
            console.log('No authenticated user found')
            return res.json({ success: false, message: 'Authentication required' })
        }
        
        // Get the current user's volunteer ID
        const account = await Accounts.findByPk(req.user.account_id)
        console.log('Account found:', !!account)
        if (!account) {
            return res.json({ success: false, message: 'Account not found' })
        }

        const campusUser = await CampusUsers.findOne({ where: { account_id: account.account_id } })
        console.log('Campus user found:', !!campusUser, campusUser?.campus_user_id)
        if (!campusUser) {
            return res.json({ success: false, message: 'Campus user profile not found' })
        }

        const volunteer = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })
        console.log('Volunteer found:', !!volunteer, volunteer?.volunteer_id)
        if (!volunteer) {
            return res.json({ success: false, message: 'Volunteer profile not found' })
        }

        // First, get the matched event IDs
        const matchedEvents = await MatchedEvent.findAll({
            where: { volunteer_id: volunteer.volunteer_id },
            attributes: ['matched_ids', 'recommendation_ids']
        })
        console.log('Matched events count:', matchedEvents.length)

        if (matchedEvents.length === 0) { 
            console.log('No matched events found, returning empty array')
            return res.json({ success: true, eventData: [] }) 
        }

        // Extract event IDs from the arrays
        const eventIds = []
        matchedEvents.forEach(matched => {
            if (matched.matched_ids && Array.isArray(matched.matched_ids)) {
                eventIds.push(...matched.matched_ids)
            }
            if (matched.recommendation_ids && Array.isArray(matched.recommendation_ids)) {
                eventIds.push(...matched.recommendation_ids)
            }
        })
        
        // Remove duplicates
        const uniqueEventIds = [...new Set(eventIds)]
        console.log('Event IDs to fetch:', uniqueEventIds)

        // Now fetch the actual events with their details
        const eventData = await Event.findAll({
            where: {
                event_id: { [Op.in]: uniqueEventIds },
                status: { [Op.ne]: 'Completed' }
            },
            attributes: [
                'event_id', 'title', 'description', 'event_started', 'event_ended', 
                'location', 'participants', 'max_participants',
                'funds_donation', 'goods_donation', 'status', 'event_image', 
                'certificate_generated', 'notified_before_starting', 'beneficiary_applicable', 
                'max_beneficiaries', 'createdAt', 'updatedAt'
            ],
            include: [
                { model: Category, through: { attributes: [] } }
            ]
        })
        console.log('Events found:', eventData.length)

        const eventPayload = eventData.map(event => ({
           title: event.title,
           time: event.event_started,
           type: event.Categories[0]?.name || 'General',
        }))

        console.log('Returning event payload:', eventPayload.length, 'events')
        return res.json({ success: true, eventData: eventPayload })

    } catch (error) {
        console.log('get all events calendar failed: ', error.message)
        console.log('Error stack:', error.stack)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}



