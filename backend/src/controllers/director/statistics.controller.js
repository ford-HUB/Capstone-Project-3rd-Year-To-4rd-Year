import models from "../../models/index.js";
import { Op } from 'sequelize';
import { buildDateFilterFromQuery } from '../../utils/dateFilter.util.js';

/**
 * Get comprehensive statistics for the director dashboard
 * Includes users, events, volunteers, attendance, beneficiaries, donors, forms, and distributed
 */
export const getComprehensiveStats = async (req, res) => {
    try {
        const { 
            Donations, Accounts, Event, Volunteer, 
            EventRegistration, Attendance, Beneficiary, Donor,
            MatchedEvent, Submission, Certificate, FormLink, Document,
            EventEvaluation, BeneficiaryEventEvaluation
        } = models;

        // Get month and year filters from query parameters and build date filter
        const monthFilter = req.query.month;
        const yearFilter = req.query.year;
        const dateFilter = buildDateFilterFromQuery(req.query);
        // Check if filter is valid (Op.gte/Op.lte are Symbols, so Object.keys() won't work)
        const hasDateFilter = Reflect.ownKeys(dateFilter).length > 0;
        // Special handling for month-only filter (no year) - use Sequelize extract
        const hasMonthOnly = monthFilter && monthFilter !== 'all' && (!yearFilter || yearFilter === 'all');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all statistics in parallel
        const [
            totalUsers,
            activeUsers,
            totalEvents,
            upcomingEvents,
            ongoingEvents,
            completedEvents,
            totalVolunteers,
            totalRegistrations,
            totalAttendance,
            totalBeneficiaries,
            totalDonors,
            totalForms,
            totalSubmissions,
            totalDocuments,
            recentMatches
        ] = await Promise.all([
            // User metrics
            Accounts.count(),
            Accounts.count({ where: { is_active: true } }),
            
            // Event metrics (apply date filter if provided)
            Event.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            Event.count(hasDateFilter 
                ? { where: { status: 'Upcoming', createdAt: dateFilter } } 
                : { where: { status: 'Upcoming' } }),
            Event.count(hasDateFilter 
                ? { where: { status: 'Ongoing', createdAt: dateFilter } } 
                : { where: { status: 'Ongoing' } }),
            Event.count(hasDateFilter 
                ? { where: { status: 'Completed', createdAt: dateFilter } } 
                : { where: { status: 'Completed' } }),
            
            // Volunteer metrics (apply date filter if provided)
            Volunteer.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            EventRegistration.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            Attendance.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Beneficiary metrics (apply date filter if provided)
            Beneficiary.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Donor metrics (apply date filter if provided)
            Donor.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Form metrics (apply date filter if provided) - count FormLink instead of Form
            FormLink.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Submission metrics (apply date filter if provided)
            Submission.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Document metrics (apply date filter if provided)
            Document.count(hasDateFilter ? { where: { createdAt: dateFilter } } : {}),
            
            // Matching performance (last 24 hours)
            MatchedEvent.count({
                where: {
                    last_updated: {
                        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);

        // Calculate Total Distributed: Count certificates from certificates table
        const totalDistributed = await Certificate.count(
            hasDateFilter 
                ? { where: { createdAt: dateFilter } }
                : {}
        );

        // Calculate rates
        const eventCompletionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
        const userActivationRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
        
        const volunteersWithSuccessfulAttendance = await Attendance.count({
            distinct: true,
            col: 'participant_id',
            where: {
                participant_type: 'volunteer',
                time_in: { [Op.ne]: null },
                time_out: { [Op.ne]: null }
            }
        });
        
        const volunteerParticipationRate = totalVolunteers > 0 
            ? Math.min((volunteersWithSuccessfulAttendance / totalVolunteers) * 100, 100) 
            : 0;

        // Calculate average rating from event evaluations
        let averageRating = 0;
        let ratingPercentage = 0;
        try {
            // Get all event evaluations (volunteer evaluations)
            const volunteerEvaluations = await EventEvaluation.findAll({
                attributes: ['overall_rating'],
                where: hasDateFilter ? { createdAt: dateFilter } : {}
            });

            // Get all beneficiary event evaluations
            const beneficiaryEvaluations = await BeneficiaryEventEvaluation.findAll({
                attributes: ['overall_rating'],
                where: hasDateFilter ? { createdAt: dateFilter } : {}
            });

            // Combine all ratings
            const allRatings = [
                ...volunteerEvaluations.map(e => e.overall_rating),
                ...beneficiaryEvaluations.map(e => e.overall_rating)
            ].filter(rating => rating && rating > 0);

            // Calculate average rating
            if (allRatings.length > 0) {
                const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
                averageRating = sum / allRatings.length;
                // Convert to percentage (rating out of 5, so multiply by 20 to get percentage)
                ratingPercentage = (averageRating / 5) * 100;
            }
        } catch (ratingError) {
            console.log('Error calculating average rating:', ratingError.message);
            // Keep default values of 0
        }

        // Get recent activity (last 30 days or filtered by month/year)
        const recentDateFilter = hasDateFilter 
            ? { createdAt: dateFilter }
            : { createdAt: { [Op.gte]: thirtyDaysAgo } };

        const recentDonations = await Donations.count({
            where: recentDateFilter
        });

        const recentEvents = await Event.count({
            where: recentDateFilter
        });

        const recentRegistrations = await EventRegistration.count({
            where: recentDateFilter
        });

        const recentAttendance = await Attendance.count({
            where: recentDateFilter
        });

        // Count total goods donations (all statuses)
        const totalGoods = await Donations.count({
            where: {
                donation_type: 'GOODS'
            }
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                activationRate: Math.round(userActivationRate * 100) / 100
            },
            events: {
                total: totalEvents,
                upcoming: upcomingEvents,
                ongoing: ongoingEvents,
                completed: completedEvents,
                completionRate: Math.round(eventCompletionRate * 100) / 100,
                recent: recentEvents,
                averageRating: Math.round(averageRating * 100) / 100,
                ratingPercentage: Math.round(ratingPercentage * 100) / 100
            },
            volunteers: {
                total: totalVolunteers,
                registrations: totalRegistrations,
                participationRate: Math.round(volunteerParticipationRate * 100) / 100,
                recentRegistrations: recentRegistrations
            },
            attendance: {
                total: totalAttendance,
                recent: recentAttendance
            },
            beneficiaries: {
                total: totalBeneficiaries
            },
            donors: {
                total: totalDonors
            },
            forms: {
                total: totalForms
            },
            documents: {
                total: totalDocuments
            },
            distributed: {
                total: totalDistributed
            },
            matching: {
                recentMatches: recentMatches
            },
            donations: {
                recent: recentDonations,
                totalGoods: totalGoods
            },
            lastUpdated: new Date()
        };

        res.json({
            success: true,
            data: stats,
            message: 'Comprehensive statistics retrieved successfully'
        });

    } catch (error) {
        console.log('getComprehensiveStats failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getOverviewStats = async (req, res) => {
    try {
        const { 
            Donations, Accounts, Event, Volunteer, 
            EventRegistration, Attendance, Beneficiary, Donor,
            Submission, FormLink, Document, Certificate,
            EventEvaluation, BeneficiaryEventEvaluation
        } = models;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all statistics in parallel
        const [
            totalUsers,
            activeUsers,
            totalEvents,
            upcomingEvents,
            ongoingEvents,
            completedEvents,
            totalVolunteers,
            totalRegistrations,
            totalAttendance,
            totalBeneficiaries,
            totalDonors,
            totalForms,
            totalSubmissions,
            totalDocuments
        ] = await Promise.all([
            // User metrics
            Accounts.count(),
            Accounts.count({ where: { is_active: true } }),
            
            // Event metrics
            Event.count(),
            Event.count({ where: { status: 'Upcoming' } }),
            Event.count({ where: { status: 'Ongoing' } }),
            Event.count({ where: { status: 'Completed' } }),
            
            // Volunteer metrics
            Volunteer.count(),
            EventRegistration.count(),
            Attendance.count(),
            
            // Beneficiary metrics
            Beneficiary.count(),
            
            // Donor metrics
            Donor.count(),
            
            // Form metrics - count FormLink instead of Form
            FormLink.count(),
            
            // Submission metrics
            Submission.count(),
            
            // Document metrics
            Document.count()
        ]);

        // Calculate Total Distributed: Count certificates from certificates table
        const totalDistributed = await Certificate.count();

        // Calculate rates
        const eventCompletionRate = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
        const userActivationRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

        // Calculate average rating from event evaluations
        let averageRating = 0;
        let ratingPercentage = 0;
        try {
            // Get all event evaluations (volunteer evaluations)
            const volunteerEvaluations = await EventEvaluation.findAll({
                attributes: ['overall_rating']
            });

            // Get all beneficiary event evaluations
            const beneficiaryEvaluations = await BeneficiaryEventEvaluation.findAll({
                attributes: ['overall_rating']
            });

            // Combine all ratings
            const allRatings = [
                ...volunteerEvaluations.map(e => e.overall_rating),
                ...beneficiaryEvaluations.map(e => e.overall_rating)
            ].filter(rating => rating && rating > 0);

            // Calculate average rating
            if (allRatings.length > 0) {
                const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
                averageRating = sum / allRatings.length;
                // Convert to percentage (rating out of 5, so multiply by 20 to get percentage)
                ratingPercentage = (averageRating / 5) * 100;
            }
        } catch (ratingError) {
            console.log('Error calculating average rating:', ratingError.message);
            // Keep default values of 0
        }

        // Get recent activity (last 30 days)
        const recentDateFilter = { createdAt: { [Op.gte]: thirtyDaysAgo } };

        const recentDonations = await Donations.count({
            where: recentDateFilter
        });

        const recentEvents = await Event.count({
            where: recentDateFilter
        });

        const recentRegistrations = await EventRegistration.count({
            where: recentDateFilter
        });

        const recentAttendance = await Attendance.count({
            where: recentDateFilter
        });

        // Count total goods donations (all statuses)
        const totalGoods = await Donations.count({
            where: {
                donation_type: 'GOODS'
            }
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                activationRate: Math.round(userActivationRate * 100) / 100
            },
            events: {
                total: totalEvents,
                upcoming: upcomingEvents,
                ongoing: ongoingEvents,
                completed: completedEvents,
                completionRate: Math.round(eventCompletionRate * 100) / 100,
                recent: recentEvents,
                averageRating: Math.round(averageRating * 100) / 100,
                ratingPercentage: Math.round(ratingPercentage * 100) / 100
            },
            volunteers: {
                total: totalVolunteers,
                registrations: totalRegistrations,
                recentRegistrations: recentRegistrations
            },
            attendance: {
                total: totalAttendance,
                recent: recentAttendance
            },
            beneficiaries: {
                total: totalBeneficiaries
            },
            donors: {
                total: totalDonors
            },
            forms: {
                total: totalForms
            },
            documents: {
                total: totalDocuments
            },
            distributed: {
                total: totalDistributed
            },
            submissions: {
                total: totalSubmissions
            },
            donations: {
                recent: recentDonations,
                totalGoods: totalGoods
            },
            lastUpdated: new Date()
        };

        res.json({
            success: true,
            data: stats,
            message: 'Overview statistics retrieved successfully'
        });

    } catch (error) {
        console.log('getOverviewStats failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

