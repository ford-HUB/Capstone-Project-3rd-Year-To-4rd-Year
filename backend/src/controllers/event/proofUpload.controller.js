import models from "../../models/index.js";
import { logParticipantActivity } from "../../services/activityLogService.js";

export const uploadEventProof = async (req, res) => {
    try {
        const { event_id } = req.params;

        const files = req.files;

        const { EventRegistration, Event, CampusUsers, Accounts, Volunteer } = models;


        if (!files || files.length === 0) {return res.json({ message: 'No files uploaded'}) }

        // Validate file types and count
        const imageFiles = files.filter(file => file.mimetype.startsWith('image/')); 
        if (imageFiles.length !== files.length) {
            return res.json({
                success: false,
                message: 'Only image files are allowed'
            });
        }

        if (imageFiles.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 images allowed'
            });
        }

        // Check if event exists and is completed
        const event = await Event.findByPk(event_id);
        if (!event) { return res.json({ message: 'Event not found' }) }

        if (event.status !== 'Completed') {
            return res.json({ message: 'Proof can only be uploaded for completed events' })
        }

        const account = await Accounts.findByPk(req.user.account_id)

        if(!account) { return res.json({ message: 'accound not found' }) }

        const campusUser = await CampusUsers.findOne({ where: { account_id: account.account_id } })

        if(!campusUser) { return res.json({ message: 'campus user not found' }) }

        const volunteer = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })

        if(!volunteer) { return res.json({ message: 'volunteer not found' }) }

        // Find the registration record
        const registration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                participant_id: volunteer.volunteer_id,
                participant_type: 'volunteer'
            }
        });

        if (!registration) { return res.json({ message: 'Event registration not found' }) }

        const imageUrls = imageFiles.map(file => file.path);

        // Update registration with proof data
        await registration.update({
            proof_uploaded: true,
            proof_uploaded_at: new Date(),
            proof_images: imageUrls
        });

        // Log activity - Upload event proof
        const eventTitle = event.title || `Event ID: ${event_id}`
        await logParticipantActivity(
            req.user.account_id,
            'upload',
            'document',
            `Uploaded event proof for event: ${eventTitle}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            message: 'Proof uploaded successfully',
            data: {
                proof_uploaded: true,
                proof_uploaded_at: registration.proof_uploaded_at,
                image_count: imageUrls.length,
                images: imageUrls
            }
        });

    } catch (error) {
        res.json({ success: false, message: 'Internal server error' })
        console.log('proof upload failed: ', error.message)
    }
};

export const getEventProofStatus = async (req, res) => {
    try {
        const { event_id } = req.params;

        const { EventRegistration, Event, Accounts, CampusUsers, Volunteer } = models

        const account = await Accounts.findByPk(req.user.account_id)

        if(!account) { return res.json({ message: 'accound not found' }) }

        const campusUser = await CampusUsers.findOne({ where: { account_id: account.account_id } })

        if(!campusUser) { return res.json({ message: 'campus user not found' }) }

        const volunteer = await Volunteer.findOne({ where: { campus_user_id: campusUser.campus_user_id } })

        if(!volunteer) { return res.json({ message: 'volunteer not found' }) }

        const registration = await EventRegistration.findOne({
            where: {
                event_id: event_id,
                participant_id: volunteer.volunteer_id,
                participant_type: 'volunteer'
            },
            include: [
                {
                    model: Event,
                    attributes: ['title', 'status', 'event_ended']
                }
            ]
        });

        if (!registration) { return res.json({ message: 'Event registration not found' }) }

        return res.json({
            success: true,
            data: {
                proof_uploaded: registration.proof_uploaded,
                proof_uploaded_at: registration.proof_uploaded_at,
                proof_images: registration.proof_images || [],
                event: {
                    title: registration.Event.title,
                    status: registration.Event.status,
                    event_ended: registration.Event.event_ended
                }
            }
        });

    } catch (error) {
        res.json({ success: false, message: 'Internal server error' });
        console.log('Get proof status failed :', error.message);
    }
};

