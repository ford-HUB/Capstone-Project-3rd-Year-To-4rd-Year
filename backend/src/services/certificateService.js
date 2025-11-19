import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
import Handlebars from 'handlebars';
import models from '../models/index.js';
import { exportToPdf, exportToPng } from '../utils/certificateExporter.js';
import { createCertificateNotification } from './notificationService.js';
import { Op } from 'sequelize';
import { sendMail } from './mailService.js';

// FIXED: Management roles (director, staff, coordinator, assistant_coordinator) only require attendance completion
// Volunteers require attendance + proof upload + requirements upload for certificate eligibility

export const generateCertificateBatch = async (event, category, department, batchSize = 10, batchId = 'BATCH') => {
    try {
        const {
            Certificate,
            Category,
            Attendance,
            Certificate_Template,
            Event,
            Accounts,
            EventRegistration,
            CampusUsers,
            Role,
            Volunteer,
            Staff,
            Coordinator,
            Director,
        } = models;

        if (!event) {
            return { success: false, message: 'Event not found', data: null };
        }

        if (!category) {
            return { success: false, message: 'No category found for this event', data: null };
        }

        // Fetch certificate template for the category
        const certificateTemplate = await Certificate_Template.findOne({
            where: { category_id: category.category_id }
        });

        if (!certificateTemplate) {
            return { success: false, message: 'No template found for this event category', data: category };
        }

        // Get total count of participants who completed attendance and their respective requirements
        // Management roles (director, staff, coordinator, assistant_coordinator) only need attendance
        // Volunteers need attendance + proof upload + requirements upload
        
        // First, get all completed attendance records
        const completedAttendance = await Attendance.findAll({
            where: {
                event_id: event.event_id,
                time_in: { [Op.ne]: null },
                time_out: { [Op.ne]: null },
            },
            attributes: ['participant_id', 'participant_type']
        });

        // Get all event registrations for this event
        const allRegistrations = await EventRegistration.findAll({
            where: {
                event_id: event.event_id,
                status: 'registered'
            },
            attributes: ['participant_id', 'participant_type', 'proof_uploaded', 'proof_images']
        });

        console.log(`📋 [${batchId}] Event ${event.event_id}: Found ${allRegistrations.length} total registrations`);

        // Filter participants based on their role requirements
        const completedParticipants = completedAttendance.filter(att => {
            const registration = allRegistrations.find(reg => 
                reg.participant_id === att.participant_id && 
                reg.participant_type === att.participant_type
            );

            if (!registration) return false;

            // Management roles (director, staff, coordinator, assistant_coordinator) only need attendance
            const isManagementRole = ['director', 'staff', 'coordinator', 'assistant_coordinator'].includes(att.participant_type);
            
            if (isManagementRole) {
                return true; // Management roles only need attendance
            } else {
                // Volunteers need attendance + proof upload + requirements upload
                return registration.proof_uploaded === true && 
                       registration.proof_images && 
                       registration.proof_images.length > 0;
            }
        });

        const totalCompletedParticipants = completedParticipants.length;

        if (totalCompletedParticipants === 0) {
            return { success: true, message: 'No participants completed their respective requirements (management roles need attendance only, volunteers need attendance + proof + requirements)', data: [], count: 0 };
        }

        console.log(`📊 [${batchId}] Event ${event.event_id}: Found ${totalCompletedParticipants} participants with completed requirements (management: attendance only, volunteers: attendance + proof + requirements)`);

        // Check if certificates already exist for this event
        const existingCertificates = await Certificate.count({
            where: { event_id: event.event_id }
        });

        if (existingCertificates > 0) {
            console.log(`⚠️  [${batchId}] Event ${event.event_id}: ${existingCertificates} certificates already exist`);
            
            // If all participants already have certificates, mark as completed
            if (existingCertificates >= totalCompletedParticipants) {
                return { 
                    success: true, 
                    message: `All ${existingCertificates} certificates already generated`, 
                    data: [], 
                    count: 0,
                    totalCertificates: existingCertificates,
                    totalParticipants: totalCompletedParticipants,
                    isComplete: true
                };
            }
        }

        // Get all participants who already have certificates for this event
        const existingCertificateRecords = await Certificate.findAll({
            where: { event_id: event.event_id },
            attributes: ['participant_id', 'participant_type']
        });

        // Create a Set of participant keys (participant_id + participant_type) for fast lookup
        const existingParticipantKeys = new Set(
            existingCertificateRecords.map(cert => 
                `${cert.participant_id}_${cert.participant_type}`
            )
        );

        // Filter out participants who already have certificates
        const eligibleParticipantIds = completedParticipants
            .filter(p => {
                const key = `${p.participant_id}_${p.participant_type}`;
                return !existingParticipantKeys.has(key);
            })
            .map(p => ({
                participant_id: p.participant_id,
                participant_type: p.participant_type
            }));

        if (eligibleParticipantIds.length === 0) {
            console.log(`✅ [${batchId}] Event ${event.event_id}: All eligible participants already have certificates`);
            return {
                success: true,
                message: 'All eligible participants already have certificates',
                count: 0,
                totalCertificates: existingCertificates,
                totalParticipants: totalCompletedParticipants,
                isComplete: true,
                data: []
            };
        }

        console.log(`🎯 [${batchId}] Event ${event.event_id}: ${eligibleParticipantIds.length} participants need certificates (${totalCompletedParticipants - eligibleParticipantIds.length} already have them)`);

        // Fetch full attendance records with participant details for eligible participants (excluding those with certificates)
        const attendanceRecords = await Attendance.findAll({
            where: {
                event_id: event.event_id,
                time_in: { [Op.ne]: null },
                time_out: { [Op.ne]: null },
                [Op.or]: eligibleParticipantIds.map(p => ({
                    participant_id: p.participant_id,
                    participant_type: p.participant_type
                }))
            },
            include: [
                { 
                    model: Volunteer,
                    required: false,
                    include: [
                        { model: CampusUsers }
                    ]
                },
                { model: Staff, required: false },
                { model: Coordinator, required: false },
                { model: Director, required: false },
            ],
            limit: batchSize,
            order: [['createdAt', 'ASC']] // Process older attendance records first
        });

        console.log(`🔄 [${batchId}] Event ${event.event_id}: Processing batch of ${attendanceRecords.length} participants`);

        // --- SIGNATORIES ---
        const directorDataInfo = await Director.findOne({ order: [['createdAt', 'DESC']] });

        let coordinatorDataInfo

        if(department) {
            coordinatorDataInfo =  await Accounts.findOne({ 
               include: [
                { 
                    model: Role,
                    attributes: ['name'],
                    where: { name: 'coordinator' },
                    required: true
                },
                {
                    model: Coordinator,
                    where: { department_id: department.department_id }, 
                    required: true
                }
               ],
               order: [[Coordinator,  'createdAt', 'DESC']],
            });
        }

        const staffDataInfo = await Staff.findOne({ order: [['createdAt', 'DESC']] });
        
        const generatedCertificates = [];
        let processedCount = 0;
        let skippedCount = 0;

        // Generate certificates for this batch
        for (const att of attendanceRecords) {
            try {
                // Check if certificate already exists for this participant
                const existingCert = await Certificate.findOne({
                    where: {
                        event_id: event.event_id,
                        participant_id: att.participant_id,
                        participant_type: att.participant_type
                    }
                });

                if (existingCert) {
                    console.log(`⏭️  [${batchId}] Event ${event.event_id}: Certificate already exists for participant ${att.participant_id}`);
                    skippedCount++;
                    continue;
                }

                let participant = null;

                if (att.participant_type === 'volunteer' && att.Volunteer?.CampusUser) {
                    const account = await Accounts.findOne({ where: { account_id: att?.Volunteer.CampusUser.account_id } })
                    participant = {
                        id: att.participant_id, // Use attendance participant_id
                        email: account.email,
                        name: `${att.Volunteer.CampusUser.firstname} ${att.Volunteer.CampusUser.lastname}`,
                        type: `Volunteer ${att.Volunteer.CampusUser.type.charAt(0).toUpperCase() + att.Volunteer.CampusUser.type.slice(1)}`,
                    }
                } else if (att.participant_type === 'staff' && att.Staff) {
                    const account = await Accounts.findOne({ where: { account_id: att?.Staff.account_id } })
                    participant = {
                        id: att.participant_id, // Use attendance participant_id
                        email: account.email,
                        name: `${att.Staff.firstname} ${att.Staff.lastname}`,
                        type: 'Staff',
                    }
                } else if (att.participant_type === 'coordinator' && att.Coordinator) {
                    const account = await Accounts.findOne({ where: { account_id: att?.Coordinator.account_id } })
                    participant = {
                        id: att.participant_id, // Use attendance participant_id
                        email: account.email,
                        name: `${att.Coordinator.firstname} ${att.Coordinator.lastname}`,
                        type: 'Coordinator',
                    }
                } else if (att.participant_type === 'assistant_coordinator' && att.Coordinator) {
                    const account = await Accounts.findOne({ where: { account_id: att?.Coordinator.account_id } })
                    participant = {
                        id: att.participant_id, // Use attendance participant_id
                        email: account.email,
                        name: `${att.Coordinator.firstname} ${att.Coordinator.lastname}`,
                        type: 'Assistant Coordinator',
                    }
                } else if (att.participant_type === 'director' && att.Director) {
                    const account = await Accounts.findOne({ where: { account_id: att?.Director.account_id } })
                    participant = {
                        id: att.participant_id, // Use attendance participant_id
                        email: account.email,
                        name: `${att.Director.firstname} ${att.Director.lastname}`,
                        type: 'Director',
                    }
                }

                if (!participant) {
                    console.log(` [${batchId}] Event ${event.event_id}: Skipping attendance ${att.attendance_id} - no valid participant data`);
                    skippedCount++;
                    continue;
                }

                const issuedDate = dayjs();
                const certId = uuidV4();

                const data_attachment = {
                    participant_name: participant.name,
                    event_title: event.title,
                    certificate_type: participant.type === 'Director' ? 'RECOGNATION' : 'APPRECIATION',
                    category_name: category.name,
                    issued_date: issuedDate.format('YYYY-MM-DD'),
                    cert_uuid: certId,

                    director_name: directorDataInfo ? `${directorDataInfo.firstname} ${directorDataInfo.lastname}`: '',
                    director_signatory_img: directorDataInfo.signature_img || '',

                    additional_signatory_name: department ? `${coordinatorDataInfo?.Coordinator.firstname} ${coordinatorDataInfo?.Coordinator.lastname}`: `${staffDataInfo.firstname} ${staffDataInfo.lastname}`,
                    additional_signatory_img: department ? coordinatorDataInfo?.Coordinator.signature_img : staffDataInfo.signature_img || '',
                    additional_signatory_role: department ? `Program Coordinator`: 'Program Staff',

                    official_signatory_name: `One Dev`,
                    official_signatory_role: `Official`,
                    isDirector: participant.type === 'Director'
                };

                const compiledHtml = Handlebars.compile(certificateTemplate.html_raw_template);
                const certificateHTML = compiledHtml(data_attachment);

                const safeName = participant.name.replace(/\W+/g, '_'); 

                const fileName = `certificate_${safeName}_${Date.now()}`;

                const imgCertificate = await exportToPng({ htmlCertificate: certificateHTML, fileName });
                const pdfCertificate = await exportToPdf({ htmlCertificate: certificateHTML, fileName });

                const certificate = await Certificate.create({
                    participant_id: participant.id,
                    participant_type: att.participant_type,
                    event_id: event.event_id,
                    ct_id: certificateTemplate.ct_id,
                    issued_date: issuedDate.toDate(),
                    cert_uid: certId,
                    type: participant.type === 'Director' ? 'recognation': 'appreciation',
                    img_url: imgCertificate,
                    pdf_url: pdfCertificate,
                    director_id: directorDataInfo.director_id,
                    additional_signatory_id: department ? coordinatorDataInfo?.Coordinator.coordinator_id : staffDataInfo.staff_id,
                    cert_title: event.title,
                });

                // Create notification and mail for the participant
                try {
                    await createCertificateNotification({
                        certificate_id: certificate.certificate_id,
                        event_title: event.title,
                        participant_id: participant.id,
                        participant_name: participant.name
                    });

                    await sendMail(participant.email,
                        `Your Certificate of Participation for ${event.title} is Ready`,
                        '',
                        'mailingGeneratedCertificate.html',
                        {
                            participant_name: participant.name,
                            event_name: event.title,
                            certificate_link: pdfCertificate
                        }
                    )
                } catch (notifError) {
                    console.error(`⚠️ [${batchId}] Event ${event.event_id}: Failed to create notification for ${participant.name}:`, notifError.message);
                }                

                generatedCertificates.push({
                    participant: participant.name,
                    participant_type: att.participant_type,
                    pdf: pdfCertificate
                });

                processedCount++;
                console.log(`✅ [${batchId}] Event ${event.event_id}: Generated certificate for ${participant.name} (${att.participant_type})`);

            } catch (participantError) {
                console.error(`💥 [${batchId}] Event ${event.event_id}: Error processing participant ${att.attendance_id}:`, participantError.message);
                skippedCount++;
            }
        }

        // Check if this was the final batch
        const totalCertificatesNow = await Certificate.count({
            where: { event_id: event.event_id }
        });

        const isComplete = totalCertificatesNow >= totalCompletedParticipants;

        console.log(`📊 [${batchId}] Event ${event.event_id} Batch Summary:`);
        console.log(`   ✅ Processed: ${processedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
        console.log(`   📜 Total certificates now: ${totalCertificatesNow}/${totalCompletedParticipants}`);
        console.log(`   🎯 Event complete: ${isComplete ? 'YES' : 'NO'}`);

        return {
            success: true,
            message: `Batch processed: ${processedCount} certificates generated, ${skippedCount} skipped`,
            count: processedCount,
            totalCertificates: totalCertificatesNow,
            totalParticipants: totalCompletedParticipants,
            isComplete: isComplete,
            data: generatedCertificates,
        };
    } catch (error) {
        console.error(`💥 [${batchId}] generateCertificateBatch Error:`, error);
        return { success: false, message: 'Internal Server Error', data: null };
    }
};
