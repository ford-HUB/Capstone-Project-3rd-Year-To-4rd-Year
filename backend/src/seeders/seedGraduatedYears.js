import models from "../models/index.js";
import { db } from "../config/db.js";

const seedGraduatedYears = async () => {
    try {
        const { GraduatedYear } = models;

        // First, sync the table to create/define the table structure if it doesn't exist
        // IMPORTANT: sync() should NOT be inside a transaction
        console.log('🔄 Creating/updating GraduatedYear table structure...');
        await GraduatedYear.sync({ alter: true });
        console.log('✅ GraduatedYear table structure created/updated successfully!');
        
        // Ensure foreign key constraint exists on campus_users.gy_id
        // This ensures data integrity even if the constraint wasn't created by Sequelize
        try {
            console.log('🔄 Ensuring foreign key constraint on campus_users.gy_id...');
            await db.query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint 
                        WHERE conname = 'fk_campus_users_gy_id'
                    ) THEN
                        ALTER TABLE campus_users
                        ADD CONSTRAINT fk_campus_users_gy_id
                        FOREIGN KEY (gy_id)
                        REFERENCES graduated_year(gy_id)
                        ON DELETE SET NULL;
                    END IF;
                END $$;
            `);
            console.log('✅ Foreign key constraint verified/created successfully!');
        } catch (fkError) {
            // If constraint already exists or table doesn't exist yet, that's okay
            if (fkError.message.includes('already exists') || 
                fkError.message.includes('does not exist')) {
                console.log('ℹ️  Foreign key constraint already exists or will be created on next sync');
            } else {
                console.warn('⚠️  Could not create foreign key constraint:', fkError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Failed to create/update table structure:', error.message);
        throw error;
    }

    // Now populate with data
    // Note: We'll do this without a transaction to avoid transaction abort issues
    // Each insert will be atomic on its own
    try {
        const { GraduatedYear } = models;

        // Generate academic years from 2010 to current year + 1
        // Format: "YYYY-YYYY" (e.g., "2025-2026")
        const currentYear = new Date().getFullYear();
        const startYear = 2010;
        const endYear = currentYear + 1; // Include next year for upcoming graduates

        const academicYears = [];

        // Generate academic years in descending order (newest first)
        for (let year = endYear; year >= startYear; year--) {
            const academicYear = `${year}-${year + 1}`;
            academicYears.push({
                year: academicYear
            });
        }

        // Check existing records first
        const existingRecords = await GraduatedYear.findAll({
            attributes: ['year']
        });
        const existingYears = new Set(existingRecords.map(r => r.year));

        // Filter out years that already exist
        const yearsToCreate = academicYears.filter(ay => !existingYears.has(ay.year));
        
        let createdCount = 0;
        let existingCount = academicYears.length - yearsToCreate.length;

        // Create records one by one to handle errors gracefully
        // This avoids transaction abort issues
        for (const academicYear of yearsToCreate) {
            try {
                const [record, created] = await GraduatedYear.findOrCreate({
                    where: { year: academicYear.year },
                    defaults: academicYear
                });
                
                if (created) {
                    createdCount++;
                } else {
                    existingCount++;
                }
            } catch (createError) {
                // Handle various error types that might occur
                const isUniqueError = 
                    createError.name === 'SequelizeUniqueConstraintError' ||
                    createError.name === 'SequelizeDatabaseError' ||
                    createError.parent?.code === '23505' ||
                    createError.parent?.code === '23503' ||
                    (createError.parent?.message && createError.parent.message.includes('unique'));
                
                if (isUniqueError) {
                    // If it's a unique constraint error, it means it was created between our check and now
                    existingCount++;
                    console.log(`⚠️  ${academicYear.year} already exists (race condition detected)`);
                } else {
                    console.error(`❌ Error creating ${academicYear.year}:`, createError.message);
                    if (createError.parent) {
                        console.error(`   Database error code: ${createError.parent.code}`);
                        console.error(`   Database error detail: ${createError.parent.detail}`);
                    }
                    // Continue with other records even if one fails
                }
            }
        }
        console.log(`✅ Graduated Years data seeding completed!`);
        console.log(`   - Created: ${createdCount} new academic years`);
        console.log(`   - Existing: ${existingCount} academic years already in database`);
        console.log(`   - Total: ${academicYears.length} academic years processed`);
        console.log(`   - Range: ${startYear}-${startYear + 1} to ${endYear}-${endYear + 1}`);

    } catch (error) {
        console.error('❌ Failed to seed graduated years data:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

// Run the seed function
seedGraduatedYears()
    .then(() => {
        console.log('🎉 Graduated years seed script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Graduated years seed script failed:', error);
        process.exit(1);
    });

