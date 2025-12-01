import models from "../models/index.js";
import { db } from "../config/db.js";

const seedGraduatedYears = async () => {
    let t = null;
    try {
        const { GraduatedYear } = models;

        // First, sync the table to create/define the table structure if it doesn't exist
        console.log('🔄 Creating/updating GraduatedYear table structure...');
        await GraduatedYear.sync({ alter: true });
        console.log('✅ GraduatedYear table structure created/updated successfully!');
        
        // Now populate with data
        t = await db.transaction();

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

        // Use findOrCreate to avoid duplicates
        let createdCount = 0;
        let existingCount = 0;

        for (const academicYear of academicYears) {
            const [record, created] = await GraduatedYear.findOrCreate({
                where: { year: academicYear.year },
                defaults: academicYear,
                transaction: t
            });

            if (created) {
                createdCount++;
            } else {
                existingCount++;
            }
        }

        await t.commit();
        console.log(`✅ Graduated Years data seeding completed!`);
        console.log(`   - Created: ${createdCount} new academic years`);
        console.log(`   - Existing: ${existingCount} academic years already in database`);
        console.log(`   - Total: ${academicYears.length} academic years processed`);
        console.log(`   - Range: ${startYear}-${startYear + 1} to ${endYear}-${endYear + 1}`);

    } catch (error) {
        if (t && !t.finished) {
            await t.rollback();
        }
        console.error('❌ Failed to seed graduated years:', error.message);
        console.error('Full error:', error);
        process.exit(1);
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

