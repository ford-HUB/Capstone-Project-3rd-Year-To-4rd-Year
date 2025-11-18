import fs from 'fs'
import path from 'path'
import { Op } from 'sequelize'
import models from "../../models/index.js"
import { getTotalEventHours } from '../../utils/eventUtils.js'

export const getCertificateTemplates = async (req, res) => {
    try {
        const templateDir = path.join(process.cwd(), './src/templates/certificates')
        const templates = fs.readdirSync(templateDir)

        const files = templates.filter(file => file.endsWith('.html')).map((file, index) => {
            const html = fs.readFileSync(path.join(templateDir, file), 'utf-8')
            return {
                id: index + 1,
                name: file.replace('.html', ''),
                html
            }
        })

        return res.json({ success: true, fileData: files })

    } catch (error) {
        res.json('Internal Server Error')
        console.log('get certificate template failed: ', error.message)
    }
}

export const createCertificateTemplate = async (req, res) => {
    try {
        const { category_name, ct_name, selected_raw_ct } = req.validatedBody

        const { Category, Certificate_Template } = models

        const [category] = await Category.findOrCreate({
            where: { name: category_name },
            defaults: {
                name: category_name
            }
        })

        const [cert_template, created] = await Certificate_Template.findOrCreate({
            where: { category_id: category.category_id },
            defaults: {
                name: ct_name,
                type: 'appreciation',
                html_raw_template: selected_raw_ct
            }

        })

        if(!created) {
            await Certificate_Template.update({
                name: ct_name,
                type: 'appreciation',
                html_raw_template: selected_raw_ct
            }, { where: { ct_id: cert_template.ct_id } })
        }

        return res.json({ success: true, message: 'Certificate Template Created' })
    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('insert certificate template failed: ', error)
    }
}

export const getDeployedCertificateTemplate = async (req, res) => {
    try {
        const { Certificate_Template, Category } = models

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 4
        const offset = (page - 1) * limit


        const rows = await Certificate_Template.findAll({
            include: [
                { model: Category }
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']]
        })

        const count = await Certificate_Template.count({
            distinct: true, // to make sure it is unique
            col: 'ct_id',
        })

        if(rows.length === 0) { return res.json({ message: 'There is no deployed template certificate yet.' }) }
        
        return res.json({
            success: true,
            certificate_template_data: rows,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                pageSize: limit
            }
        })

    } catch (error) {
        console.log('get deployed certificate template failed: ', error)
    }
}

export const getUserCertificates = async (req, res) => {
    try {
        const { Event, Category, Organizer, Volunteer, CampusUsers, Staff, Coordinator, Director, Certificate } = models

        let participant
        let participant_id

        switch(req.user.Role.name) {
            case 'volunteer': 
                const campusUser = await CampusUsers.findOne({ where: { account_id: req.user.account_id } })
                participant = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })
                participant_id = participant.volunteer_id
                break
            
            case 'director':
                participant = await Director.findOne({ where: req.user.account_id })
                participant_id = participant.director_id
                break
            
            case 'staff':
                participant = await Staff.findOne({ where: { account_id: req.user.account_id } })
                participant_id = participant.staff_id
                break
            
            case 'coordinator':
            case 'assistant_coordinator':
                participant = await Coordinator.findOne({ where: { account_id: req.user.account_id } })
                participant_id = participant.coordinator_id
                break

            default:
                console.log('role type is out of our scope')
                break
        }

        const certificateData = await Certificate.findAll({ 
            where: { participant_id: participant_id, participant_type: req.user.Role.name === 'volunteer' ? 'volunteer': req.user.Role.name },
            include: [
                { 
                    model: Event,
                    include: [ 
                        { model: Organizer },
                        { model: Category, through: [] }
                    ]
                }
            ]
        })

        const formattedData = certificateData.map((certData) => {
            const certificateDetails = {
                id: certData.certificate_id,
                title: certData.cert_title,
                cert_img: certData.img_url,
                cert_pdf: certData.pdf_url,
                cert_uuid: certData.cert_uid,
                issued_at: certData.issued_at,
                series_id: certData.series_id,
                eventDetails: {
                    event_name: certData.Event.title,
                    event_description: certData.Event.description,
                    category_name: certData.Event.Categories[0].name,
                    organizer : certData.Event.Organizer.name,
                    totalDuration: getTotalEventHours(certData.Event.event_started, certData.Event.event_ended)
                }
            }

            return certificateDetails

        })

        if(formattedData.length === 0) { return res.json({ message: 'You have no certificate achieve yet.' }) }
        
        return res.json({ success: true, certificates: formattedData })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('get user certificate failed: ', error.message)
    }
}

export const getCertificateCountAndEvent = async (req, res) => {
    try {
        const { Event, Volunteer, CampusUsers, Staff, Coordinator, Director, Certificate, EventRegistration, Attendance } = models
        const { account_id } = req.user
        const roleName = req.user.Role.name

        // Get participant information based on role
        let participant_id, participant_type

        switch(roleName) {
            case 'volunteer': {
                const campusUser = await CampusUsers.findOne({ where: { account_id } })
                if (!campusUser) {
                    return res.json({ success: false, message: 'Campus user not found' })
                }
                const volunteer = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })
                if (!volunteer) {
                    return res.json({ success: false, message: 'Volunteer not found' })
                }
                participant_id = volunteer.volunteer_id
                participant_type = 'volunteer'
                break
            }
            
            case 'director': {
                const director = await Director.findOne({ where: { account_id } })
                if (!director) {
                    return res.json({ success: false, message: 'Director not found' })
                }
                participant_id = director.director_id
                participant_type = 'director'
                break
            }
            
            case 'staff': {
                const staff = await Staff.findOne({ where: { account_id } })
                if (!staff) {
                    return res.json({ success: false, message: 'Staff not found' })
                }
                participant_id = staff.staff_id
                participant_type = 'staff'
                break
            }
            
            case 'coordinator':
            case 'assistant_coordinator': {
                const coordinator = await Coordinator.findOne({ where: { account_id } })
                if (!coordinator) {
                    return res.json({ success: false, message: 'Coordinator not found' })
                }
                participant_id = coordinator.coordinator_id
                participant_type = roleName === 'assistant_coordinator' ? 'assistant_coordinator' : 'coordinator'
                break
            }

            default:
                return res.json({ success: false, message: 'Role type is out of our scope' })
        }

        // Count total certificates
        const certificateCount = await Certificate.count({ 
            where: { participant_id, participant_type }
        })

        // Count completed events based on role requirements
        const eventCompletedCount = participant_type === 'volunteer' 
            ? await getVolunteerCompletedEventCount(Attendance, Event, EventRegistration, participant_id, participant_type)
            : await getManagementCompletedEventCount(Attendance, Event, participant_id, participant_type)

        return res.json({ 
            success: true, 
            certificateCount, 
            eventCount: eventCompletedCount 
        })

    } catch (error) {
        console.error('get certificate count and event failed: ', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}

// Helper function: Count completed events for volunteers (requires attendance + proof upload)
const getVolunteerCompletedEventCount = async (Attendance, Event, EventRegistration, participant_id, participant_type) => {
    // Get events where volunteer has completed attendance and event is completed
    const completedAttendances = await Attendance.findAll({
        where: {
            participant_id,
            participant_type,
            time_in: { [Op.ne]: null },
            time_out: { [Op.ne]: null }
        },
        include: [{
            model: Event,
            where: { status: 'Completed' },
            required: true,
            attributes: ['event_id']
        }],
        attributes: ['event_id']
    })

    const eventIds = [...new Set(completedAttendances.map(att => att.event_id))]

    if (eventIds.length === 0) return 0

    // Verify proof upload for each event
    const registrationsWithProof = await EventRegistration.findAll({
        where: {
            participant_id,
            participant_type,
            event_id: { [Op.in]: eventIds },
            proof_uploaded: true
        },
        attributes: ['event_id'],
        raw: true
    })

    return [...new Set(registrationsWithProof.map(reg => reg.event_id))].length
}

// Helper function: Count completed events for management roles (requires attendance only)
const getManagementCompletedEventCount = async (Attendance, Event, participant_id, participant_type) => {
    return await Attendance.count({
        where: {
            participant_id,
            participant_type,
            time_in: { [Op.ne]: null },
            time_out: { [Op.ne]: null }
        },
        include: [{
            model: Event,
            where: { status: 'Completed' },
            required: true,
            attributes: []
        }],
        distinct: true,
        col: 'event_id'
    })
}

export const deleteCertificateTemplate = async (req, res) => {
    try {
        const { ct_id } = req.params

        const { Certificate_Template } = models

        // Check if certificate template exists
        const certificateTemplate = await Certificate_Template.findByPk(ct_id)
        if (!certificateTemplate) {
            return res.json({ success: false, message: 'Certificate template not found' })
        }

        // Delete the certificate template
        await Certificate_Template.destroy({
            where: { ct_id: ct_id }
        })

        return res.json({ 
            success: true, 
            message: 'Certificate template deleted successfully',
            deletedTemplate: {
                id: certificateTemplate.ct_id,
                name: certificateTemplate.name
            }
        })

    } catch (error) {
        console.log('delete certificate template failed: ', error)
        return res.json({ success: false, message: 'Internal Server Error' })
    }
}

