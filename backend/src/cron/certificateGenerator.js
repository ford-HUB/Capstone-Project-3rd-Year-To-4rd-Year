import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { generateCertificateBatch } from '../services/certificateService.js';

const { Event, Category, Department } = models;

// Configuration for batch processing
const BATCH_CONFIG = {
    EVENTS_PER_CYCLE: 30,        // Process 5 events per cron cycle
    PARTICIPANTS_PER_BATCH: 10, // Process 10 participants per batch within each event
    CRON_INTERVAL: '0 */3 * * * *' // Every 3 mins
};

// Run every 3 minutes
cron.schedule(BATCH_CONFIG.CRON_INTERVAL, async () => {
    const batchId = `BATCH_${Date.now()}`;
    const startTime = new Date();
    
    try {
        console.log(`\n🚀 [${batchId}] Certificate Generation Batch Started at ${startTime.toLocaleString()}`);
        console.log(`📊 [${batchId}] Configuration: ${BATCH_CONFIG.EVENTS_PER_CYCLE} events/cycle, ${BATCH_CONFIG.PARTICIPANTS_PER_BATCH} participants/batch`);

        const now = new Date();
        
        // Find events that need certificate generation
        const eventsToProcess = await Event.findAll({
            where: {
                event_ended: { [Op.lte]: now },
                status: 'Completed',
                certificate_generated: false,
            },
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Department, through: { attributes: [] } }
            ],
            limit: BATCH_CONFIG.EVENTS_PER_CYCLE,
            order: [['event_ended', 'ASC']] // Process older events first
        });

        console.log(`📋 [${batchId}] Found ${eventsToProcess.length} events ready for certificate generation`);

        if (eventsToProcess.length === 0) {
            console.log(`✅ [${batchId}] No events to process. Batch completed.`);
            return;
        }

        let totalEventsProcessed = 0;
        let totalCertificatesGenerated = 0;
        let totalEventsCompleted = 0;

        // Process each event with batch processing
        for (const event of eventsToProcess) {
            const eventStartTime = new Date();
            console.log(`\n📅 [${batchId}] Processing Event ${event.event_id}: "${event.title}"`);
            console.log(`⏰ [${batchId}] Event ended: ${event.event_ended.toLocaleString()}`);

            try {
                const result = await generateCertificateBatch(
                    event, 
                    event.Categories[0], 
                    event.Departments[0], 
                    BATCH_CONFIG.PARTICIPANTS_PER_BATCH,
                    batchId
                );

                const eventProcessingTime = new Date() - eventStartTime;
                
                if (result.success) {
                    totalEventsProcessed++;
                    totalCertificatesGenerated += result.count || 0;
                    
                    console.log(`✅ [${batchId}] Event ${event.event_id} batch processed successfully:`);
                    console.log(`   📊 Generated ${result.count || 0} certificates in this batch`);
                    console.log(`   📜 Total certificates: ${result.totalCertificates || 0}/${result.totalParticipants || 0}`);
                    console.log(`   ⏱️  Processing time: ${eventProcessingTime}ms`);
                    console.log(`   💬 Message: ${result.message}`);

                    // Only mark event as certificates generated if ALL certificates are complete
                    if (result.isComplete) {
                        event.certificate_generated = true;
                        await event.save();
                        totalEventsCompleted++;
                        
                        console.log(`🏷️  [${batchId}] Event ${event.event_id} marked as certificate_generated: true (ALL certificates generated)`);
                    } else {
                        console.log(`⏳ [${batchId}] Event ${event.event_id} still has pending certificates - will continue in next batch`);
                    }
                } else {
                    console.log(`❌ [${batchId}] Event ${event.event_id} failed:`);
                    console.log(`   💬 Error: ${result.message}`);
                    console.log(`   ⏱️  Processing time: ${eventProcessingTime}ms`);
                    
                    if (result.data && result.data.category) {
                        console.log(`   📝 Reason: No template found for category "${result.data.category}"`);
                    }
                }
            } catch (eventError) {
                console.error(`💥 [${batchId}] Error processing event ${event.event_id}:`, eventError.message);
            }
        }

        // Batch completion summary
        const totalProcessingTime = new Date() - startTime;
        console.log(`\n📈 [${batchId}] BATCH COMPLETION SUMMARY:`);
        console.log(`   🎯 Events processed: ${totalEventsProcessed}/${eventsToProcess.length}`);
        console.log(`   🏆 Events completed: ${totalEventsCompleted}`);
        console.log(`   📜 Total certificates generated: ${totalCertificatesGenerated}`);
        console.log(`   ⏱️  Total processing time: ${totalProcessingTime}ms`);
        console.log(`   🚀 [${batchId}] Certificate Generation Batch Completed\n`);

    } catch (error) {
        const totalProcessingTime = new Date() - startTime;
        console.error(`💥 [${batchId}] CRITICAL BATCH ERROR after ${totalProcessingTime}ms:`, error.message);
        console.error(`🔍 [${batchId}] Error stack:`, error.stack);
    }
});
