import models from "../../models/index.js";
import { Op } from 'sequelize';
import { sendMail } from '../../services/mailService.js';
import { buildDateFilterFromQuery } from '../../utils/dateFilter.util.js';
import { logDirectorActivity } from "../../services/activityLogService.js";

export const getOpenDonationEvents = async (req, res) => {
    try {
        const { Event } = models;
        
        const openEvents = await Event.findAll({
            where: {
                [Op.or]: [
                    { funds_donation: true },
                    { goods_donation: true }
                ],
                status: {
                    [Op.notIn]: ['Cancelled', 'Completed']
                }
            },
            attributes: ['event_id', 'title', 'funds_donation', 'goods_donation', 'status'],
            order: [['title', 'ASC']]
        });

        const eventOptions = openEvents.map(event => ({
            value: event.title,
            label: event.title,
            eventId: event.event_id,
            acceptsFunds: event.funds_donation,
            acceptsGoods: event.goods_donation,
            status: event.status
        }));

        res.json({
            success: true,
            data: eventOptions,
            message: 'Open donation events retrieved successfully'
        });

    } catch (error) {
        console.log('getOpenDonationEvents failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDonationList = async (req, res) => {
    try {
        const { Donations, Donor, Event, Category, Payments, Accounts, GoodsDonation, PaymentMethod } = models;
        const { status, type, dateRange, search, page, limit, event, month, year } = req.query;

        // Pagination parameters
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Build where clause for donations
        const donationWhere = {};
        
        // Filter by donation status
        if (status && status !== 'all') {
            donationWhere.status = status;
        }

        // Filter by donation type
        if (type && type !== 'all') {
            donationWhere.donation_type = type;
        }

        // Build date filter for month/year (takes priority over dateRange)
        const dateFilter = buildDateFilterFromQuery(req.query);
        const monthFilter = req.query.month;
        const yearFilter = req.query.year;

        // Special handling for month-only filter (no year) - use Sequelize extract
        const hasMonthOnly = monthFilter && monthFilter !== 'all' && (!yearFilter || yearFilter === 'all');
        
        // Apply date filter if month/year is provided, otherwise use dateRange
        // Check if filter is valid (Op.gte/Op.lte are Symbols, so Object.keys() won't work)
        const hasDateFilter = Reflect.ownKeys(dateFilter).length > 0;
        
        if (hasMonthOnly) {
            // Filter by month number across all years using Sequelize extract
            const monthNum = parseInt(monthFilter);
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
                // Initialize Op.and if it doesn't exist
                if (!donationWhere[Op.and]) {
                    donationWhere[Op.and] = [];
                }
                donationWhere[Op.and].push(
                    models.sequelize.literal(`EXTRACT(MONTH FROM "Donations"."createdAt") = ${monthNum}`)
                );
            }
        } else if (hasDateFilter) {
            donationWhere.createdAt = dateFilter;
        } else if (dateRange && dateRange !== 'all') {
            const now = new Date();
            let startDate;

            switch (dateRange) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate = new Date(now);
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                default:
                    startDate = null;
            }

            if (startDate) {
                donationWhere.createdAt = {
                    [Op.gte]: startDate
                };
            }
        }

        // Build where clause for Event (for search and event filter)
        const eventWhere = {};

        // Add event filter (by title)
        if (event && event !== 'all') {
            eventWhere.title = event;
        }

        // Add search conditions to event where clause
        if (search) {
            if (eventWhere.title) {
                // If event filter is already set, combine with search using AND
                eventWhere[Op.and] = [
                    { title: eventWhere.title },
                    { title: { [Op.like]: `%${search}%` } }
                ];
                delete eventWhere.title;
            } else {
                eventWhere[Op.or] = [
                    { title: { [Op.like]: `%${search}%` } }
                ];
            }
        }

        // Build where clause for donor search
        const donorWhere = {};
        if (search) {
            donorWhere.fullname = { [Op.like]: `%${search}%` };
        }

        // Get total count for pagination
        const totalCount = await Donations.count({
            where: donationWhere,
            include: [
                {
                    model: Accounts,
                    attributes: [],
                    include: [
                        {
                            model: Donor,
                            attributes: [],
                            ...(search ? {
                                where: donorWhere,
                                required: false
                            } : {})
                        }
                    ],
                    ...(search ? { required: false } : {})
                },
                {
                    model: Event,
                    attributes: [],
                    where: Object.keys(eventWhere).length > 0 ? eventWhere : undefined,
                    required: event && event !== 'all' ? true : false
                }
            ],
            distinct: true
        });

        // For search, we need to make includes more flexible to support OR conditions
        // We'll fetch all matching donations and filter in memory if needed
        const donations = await Donations.findAll({
            where: donationWhere,
            include: [
                {
                    model: Accounts,
                    attributes: ['email'],
                    include: [
                        {
                            model: Donor,
                            attributes: ['donor_id', 'fullname', 'profile_image'],
                            ...(search ? {
                                where: donorWhere,
                                required: false
                            } : {})
                        }
                    ]
                },
                {
                    model: Event,
                    include: [
                        {
                            model: Category,
                            attributes: ['name'],
                            through: { attributes: [] },
                            ...(search ? {
                                where: { name: { [Op.like]: `%${search}%` } },
                                required: false
                            } : {})
                        }
                    ],
                    attributes: ['event_id', 'title', 'description', 'status', 'location', 'event_started'],
                    where: Object.keys(eventWhere).length > 0 ? eventWhere : undefined,
                    required: event && event !== 'all' ? true : false
                },
                {
                    model: Payments,
                    attributes: ['payment_id', 'amount', 'currency', 'payment_status', 'paid_at', 'transaction_id'],
                    include: [
                        {
                            model: PaymentMethod,
                            attributes: ['payment_method', 'external_referrence'],
                            required: false
                        }
                    ]
                },
                {
                    model: GoodsDonation,
                    attributes: ['goods_id', 'type_goods', 'detailed_description', 'quantity', 'condition', 'drop_off_location', 'preferred_date', 'preferred_time']
                }
            ],
            attributes: [
                'donation_id',
                'donation_type',
                'status',
                'remark',
                'is_anonymous',
                'mail_reciept',
                'account_id',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offset
        });

        const totalPages = Math.ceil(totalCount / limitNum);

        // Format donations for frontend consumption
        // Return both formatted data for table and raw nested structure for dashboard
        const formattedDonations = donations.map((donation) => {
            // Get account reference - handle both singular and plural forms from Sequelize
            const account = donation.Account || donation.Accounts || 
                (Array.isArray(donation.Accounts) ? donation.Accounts[0] : null);
            
            // Get donor object - handle both singular and plural forms
            const donor = account?.Donor || (Array.isArray(account?.Donors) ? account.Donors[0] : null);
            
            // Get donor name
            let donorName = 'Donor';
            if (donation.is_anonymous) {
                donorName = 'Anonymous';
            } else {
                donorName = donor?.fullname 
                    || donor?.name
                    || account?.email
                    || 'Donor';
            }

            // Ensure Payments is always an array
            const paymentsArray = Array.isArray(donation.Payments) 
                ? donation.Payments 
                : (donation.Payments ? [donation.Payments] : []);

            // Get amount for money donations
            const amount = donation.donation_type === 'MONEY' 
                ? (parseFloat(paymentsArray[0]?.amount) || 0)
                : 0;

            // Get goods info - ensure it's always handled as array or single object
            const goodsDonation = Array.isArray(donation.GoodsDonation) 
                ? donation.GoodsDonation[0] 
                : donation.GoodsDonation;
            
            const goodsDescription = goodsDonation?.detailed_description 
                || goodsDonation?.type_goods 
                || '';
            const goodsQuantity = goodsDonation?.quantity || '';

            // Get payment method and transaction ID
            const payment = paymentsArray[0] || null;
            
            // PaymentMethod.payment_method is JSONB, extract the type or use external_referrence
            let paymentMethod = 'Online Payment';
            if (payment?.PaymentMethod) {
                const pmData = payment.PaymentMethod.payment_method;
                if (typeof pmData === 'object' && pmData !== null) {
                    paymentMethod = pmData.type || pmData.method || 'Online Payment';
                } else if (typeof pmData === 'string') {
                    paymentMethod = pmData;
                }
            }
            
            const transactionId = payment?.transaction_id || payment?.PaymentMethod?.external_referrence || donation.donation_id || '';

            // Return formatted data with nested structure preserved for dashboard and table compatibility
            return {
                // Formatted fields for table
                id: donation.donation_id,
                donation_id: donation.donation_id,
                type: donation.donation_type || 'MONEY',
                donation_type: donation.donation_type || 'MONEY', // Keep both for compatibility
                amount: amount,
                status: donation.status || 'PENDING',
                donor_name: donorName,
                event_name: donation.Event?.title || 'General Donation',
                goods_description: goodsDescription,
                goods_quantity: goodsQuantity,
                timestamp: donation.createdAt || new Date(),
                createdAt: donation.createdAt || new Date(),
                payment_method: paymentMethod,
                transaction_id: transactionId,
                // Nested structure for dashboard and table compatibility
                account_id: account?.account_id || donation.account_id,
                Account: account ? {
                    account_id: account.account_id,
                    email: account.email,
                    Donor: donor ? {
                        donor_id: donor.donor_id,
                        fullname: donor.fullname,
                        name: donor.name,
                        profile_image: donor.profile_image
                    } : null
                } : null,
                Event: donation.Event ? {
                    event_id: donation.Event.event_id,
                    title: donation.Event.title,
                    description: donation.Event.description,
                    status: donation.Event.status,
                    location: donation.Event.location,
                    event_started: donation.Event.event_started
                } : null,
                Payments: paymentsArray,
                GoodsDonation: goodsDonation ? [goodsDonation] : [],
                is_anonymous: donation.is_anonymous,
                remark: donation.remark
            };
        });

        // Log activity - View donation list
        await logDirectorActivity(
            req.user.account_id,
            'access',
            'donation',
            'Viewed donation list',
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        res.json({
            success: true,
            data: formattedDonations,
            count: formattedDonations.length,
            pagination: {
                currentPage: pageNum,
                totalPages: totalPages,
                totalCount: totalCount,
                limit: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            message: 'Donations retrieved successfully'
        });

    } catch (error) {
        console.log('getDonationList failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDonationStats = async (req, res) => {
    try {
        const { Donations, Payments } = models;

        // Build date filter for month/year
        const monthFilter = req.query.month;
        const yearFilter = req.query.year;
        const dateFilter = buildDateFilterFromQuery(req.query);
        // Check if filter is valid (Op.gte/Op.lte are Symbols, so Object.keys() won't work)
        const hasFilter = Reflect.ownKeys(dateFilter).length > 0;
        
        // Special handling for month-only filter (no year) - use Sequelize extract
        const hasMonthOnly = monthFilter && monthFilter !== 'all' && (!yearFilter || yearFilter === 'all');
        const donationWhere = {};
        
        // Add month-only filter using EXTRACT
        if (hasMonthOnly) {
            const monthNum = parseInt(monthFilter);
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
                donationWhere[Op.and] = [
                    models.sequelize.literal(`EXTRACT(MONTH FROM "Donations"."createdAt") = ${monthNum}`)
                ];
            }
        } else if (hasFilter) {
            // Use date range filter (month+year or year only)
            donationWhere.createdAt = dateFilter;
        }

        const totalDonations = await Donations.count({ where: donationWhere });

        // Get total amount from payments associated with filtered donations
        let totalAmount = 0;
        const hasDateFilter = Reflect.ownKeys(dateFilter).length > 0;
        const hasAnyFilter = hasMonthOnly || hasDateFilter;
        if (hasAnyFilter) {
            // Get all donations matching filters and sum their payments
            const donations = await Donations.findAll({
                where: donationWhere,
                include: [{
                    model: Payments,
                    where: { payment_status: 'PAID' },
                    required: false
                }]
            });
            totalAmount = donations.reduce((sum, donation) => {
                // Sum all payments for this donation
                if (donation.Payments && donation.Payments.length > 0) {
                    return sum + donation.Payments.reduce((paymentSum, payment) => {
                        return paymentSum + (parseFloat(payment.amount) || 0);
                    }, 0);
                }
                return sum;
            }, 0);
        } else {
            // No filters - get all paid payments
            const totalAmountResult = await Payments.sum('amount', { where: { payment_status: 'PAID' } });
            totalAmount = totalAmountResult || 0;
        }

        const completedDonations = await Donations.count({
            where: { 
                status: 'COMPLETED',
                ...donationWhere
            }
        });

        // Active donors: count distinct donors who made donations matching the filters
        // This respects both date and event filters
        const activeDonors = await Donations.count({
            distinct: true,
            col: 'account_id',
            where: donationWhere
        });

        const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        const statusBreakdown = await Donations.findAll({
            attributes: [
                'status',
                [models.sequelize.fn('COUNT', models.sequelize.col('donation_id')), 'count']
            ],
            where: donationWhere,
            group: ['status']
        });

        const stats = {
            totalDonations,
            totalAmount,
            completedDonations,
            activeDonors,
            averageDonation,
            statusBreakdown,
            lastUpdated: new Date()
        };

        res.json({
            success: true,
            data: stats,
            message: 'Donation statistics retrieved successfully'
        });

    } catch (error) {
        console.log('getDonationStats failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const monthFilter = req.query.month;
        const yearFilter = req.query.year;
        const eventFilter = req.query.event;
        const { Donations, Payments, Donor, Event } = models;

        const dateFilter = buildDateFilterFromQuery(req.query);

        let whereClause = {};
        const hasMonthOnly = monthFilter && monthFilter !== 'all' && (!yearFilter || yearFilter === 'all');
        const hasDateFilter = Reflect.ownKeys(dateFilter).length > 0;
        
        // Build date filter conditions
        const dateConditions = [];
        if (hasMonthOnly) {
            const monthNum = parseInt(monthFilter);
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
                dateConditions.push(
                    models.sequelize.literal(`EXTRACT(MONTH FROM "Donations"."createdAt") = ${monthNum}`)
                );
            }
        } else if (hasDateFilter) {
            // Add date filter to where clause
            whereClause.createdAt = dateFilter;
        }
        
        // If we have month-only conditions, add them to whereClause
        if (dateConditions.length > 0) {
            whereClause[Op.and] = dateConditions;
        }

        // Build event filter - convert title to event_id for reliable filtering
        const eventWhere = {};
        let eventIdFilter = null;
        if (eventFilter && eventFilter !== 'all') {
            const eventId = parseInt(eventFilter);
            if (!isNaN(eventId)) {
                eventIdFilter = eventId;
            } else {
                // Look up event by title to get event_id for more reliable filtering
                const event = await Event.findOne({
                    where: { title: eventFilter },
                    attributes: ['event_id']
                });
                if (event) {
                    eventIdFilter = event.event_id;
                } else {
                    // Fallback to title filtering if event not found
                    eventWhere.title = eventFilter;
                }
            }
        }

        // Calculate total money with filters
        let totalMoney = 0;
        const hasAnyFilter = hasMonthOnly || hasDateFilter || (eventFilter && eventFilter !== 'all');
        
        if (hasAnyFilter) {
            const donationsWhere = { ...whereClause };
            if (eventIdFilter) {
                donationsWhere.event_id = eventIdFilter;
            }
            
            // Use Reflect.ownKeys to properly detect Symbol keys like Op.and
            // Since hasAnyFilter is true, we should always have a valid where clause
            const hasDonationsWhere = Reflect.ownKeys(donationsWhere).length > 0;
            const hasEventWhere = eventIdFilter ? false : (Reflect.ownKeys(eventWhere).length > 0);
            
            const donations = await Donations.findAll({
                // Always use donationsWhere when hasAnyFilter is true (filters are active)
                where: hasDonationsWhere ? donationsWhere : whereClause,
                include: [
                    {
                        model: Payments,
                        where: { payment_status: 'PAID' },
                        required: false
                    },
                    {
                        model: Event,
                        attributes: ['event_id', 'title'],
                        where: hasEventWhere ? eventWhere : undefined,
                        required: (eventFilter && eventFilter !== 'all' && !eventIdFilter) ? true : false
                    }
                ]
            });
            
            totalMoney = donations.reduce((sum, donation) => {
                // Verify event matches if filtering by title
                if (eventFilter && eventFilter !== 'all' && !eventIdFilter) {
                    if (!donation.Event || donation.Event.title !== eventFilter) {
                        return sum;
                    }
                }
                
                // Sum all payments for this donation
                if (donation.Payments && donation.Payments.length > 0) {
                    return sum + donation.Payments.reduce((paymentSum, payment) => {
                        return paymentSum + (parseFloat(payment.amount) || 0);
                    }, 0);
                }
                return sum;
            }, 0);
        } else {
            totalMoney = await Payments.sum('amount', {
                where: { payment_status: 'PAID' }
            }) || 0;
        }

        // Count total goods donations (all goods donations regardless of status for statistics)
        const goodsWhere = {
            ...whereClause,
            donation_type: 'GOODS'
            // Removed status filter to count all goods donations for statistics overview
        };
        
        if (eventIdFilter) {
            goodsWhere.event_id = eventIdFilter;
        }
        
        let totalGoods;
        if (eventFilter && eventFilter !== 'all' && !eventIdFilter) {
            totalGoods = await Donations.count({
                where: goodsWhere,
                include: [
                    {
                        model: Event,
                        attributes: [],
                        where: eventWhere,
                        required: true
                    }
                ],
                distinct: true,
                col: 'Donations.donation_id'
            });
        } else {
            totalGoods = await Donations.count({
                where: goodsWhere
            });
        }

        // Count total unique donors
        const donorsWhere = { ...whereClause };
        if (eventIdFilter) {
            donorsWhere.event_id = eventIdFilter;
        }
        
        let totalDonors;
        if (eventFilter && eventFilter !== 'all' && !eventIdFilter) {
            totalDonors = await Donations.count({
                distinct: true,
                col: 'Donations.account_id',
                where: donorsWhere,
                include: [
                    {
                        model: Event,
                        attributes: [],
                        where: eventWhere,
                        required: true
                    }
                ]
            });
        } else {
            totalDonors = await Donations.count({
                distinct: true,
                col: 'account_id',
                where: Object.keys(donorsWhere).length > 0 ? donorsWhere : undefined
            });
        }

        // Calculate average per donor
        const averagePerDonor = totalDonors > 0 ? totalMoney / totalDonors : 0;

        const dashboardStats = {
            totalMoney,
            totalGoods,
            totalDonors,
            averagePerDonor,
            lastUpdated: new Date()
        };

        res.json({
            success: true,
            data: dashboardStats,
            message: 'Dashboard statistics retrieved successfully'
        });

    } catch (error) {
        console.log('getDashboardStats failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const bulkUpdateDonationStatus = async (req, res) => {
    try {
        const { donationIds, status } = req.validatedBody;
        const { Donations, Accounts, Donor, Event } = models;

        const donations = await Donations.findAll({
            where: {
                donation_id: {
                    [Op.in]: donationIds
                }
            },
            attributes: ['donation_id', 'donation_type', 'status']
        });

        const invalidDonations = donations.filter(donation => 
            donation.donation_type !== 'GOODS' || donation.status !== 'PENDING'
        );

        if (invalidDonations.length > 0) {
            return res.json({
                success: false,
                message: 'Only goods donations with pending status can be updated',
                invalidDonations: invalidDonations.map(d => ({
                    donation_id: d.donation_id,
                    donation_type: d.donation_type,
                    status: d.status
                }))
            });
        }

        const donationsWithDetails = await Donations.findAll({
            where: {
                donation_id: {
                    [Op.in]: donationIds
                }
            },
            include: [
                {
                    model: Accounts,
                    attributes: ['email'],
                    include: [
                        {
                            model: Donor,
                            attributes: ['donor_id', 'fullname']
                        }
                    ]
                },
                {
                    model: Event,
                    attributes: ['event_id', 'title', 'location', 'event_started']
                }
            ]
        });

        const updateResult = await Donations.update(
            { 
                status: status,
                updatedAt: new Date()
            },
            {
                where: {
                    donation_id: {
                        [Op.in]: donationIds
                    }
                }
            }
        );

        let emailsSent = 0;
        for (const donation of donationsWithDetails) {
            if (donation.Account?.email) {
                try {
                    await sendMail(
                        donation.Account.email,
                        'Donation Status Update - UCLM CARES',
                        'Your donation status has been updated',
                        'goodsReceivedNotification.html',
                        {
                            donorName: donation.Account.Donor.fullname,
                            eventTitle: donation.Event?.title || 'Event',
                            donationId: donation.donation_id,
                            donationType: donation.donation_type,
                            newStatus: status,
                            remark: `Updated at ${donation.Event?.location || 'our facility'}`,
                            eventStartDate: donation.Event?.event_started ? new Date(donation.Event.event_started).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'N/A',
                            currentDate: new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })
                        }
                    );
                    emailsSent++;
                    console.log(`Email sent to ${donation.Account.email} for donation #${donation.donation_id}`);
                } catch (emailError) {
                    console.error(`Failed to send email to ${donation.Account.email}:`, emailError.message);
                }
            }
        }

        // Log activity - Bulk update donation status
        await logDirectorActivity(
            req.user.account_id,
            'update',
            'donation',
            `Bulk updated ${updateResult[0]} donation(s) to status: ${status}`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        res.json({
            success: true,
            message: `Successfully updated ${updateResult[0]} donations to ${status}. ${emailsSent} emails sent.`,
            updatedCount: updateResult[0],
            emailsSent: emailsSent
        });

    } catch (error) {
        console.log('bulkUpdateDonationStatus failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateDonationStatus = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { status } = req.validatedBody;
        const { Donations, Donor, Event, Accounts } = models;

        // Find donation with related data
        const donation = await Donations.findByPk(donationId, {
            include: [
                {
                    model: Accounts,
                    attributes: ['email'],
                    include: [
                        {
                            model: Donor,
                            attributes: ['donor_id', 'fullname']
                        }
                    ],
                }
            ]
        });

        if (!donation) {
            return res.json({
                success: false,
                message: 'Donation not found'
            });
        }


        await donation.update({ status });

        if (donation.Account?.email) {
            await sendMail(
                donation.Account.email,
                'Donation Status Update - UCLM CARES',
                'Your donation status has been updated',
                'goodsReceivedNotification.html',
                {
                    donorName: donation.Account.Donor.fullname,
                    eventTitle: donation.Event?.title || 'Event',
                    donationId: donation.donation_id,
                    donationType: donation.donation_type,
                    newStatus: status,
                    remark: `Updated at ${donation.Event?.location || 'our facility'}`,
                    eventStartDate: donation.Event?.event_started ? new Date(donation.Event.event_started).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'N/A',
                    currentDate: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }
            );
            
            console.log(`Email sent to ${donation.Account.email} for donation #${donation.donation_id}`);
        } else {
            console.log(`No email sent - donor or email not found for donation #${donation.donation_id}`);
        }

        res.json({
            success: true,
            message: 'Donation status updated successfully',
            donation: {
                donation_id: donation.donation_id,
                status: donation.status,
                updatedAt: donation.updatedAt
            }
        });

    } catch (error) {
        console.log('updateDonationStatus failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const exportDonations = async (req, res) => {
    try {
        const { donationIds } = req.validatedBody;
        const { Donations, Donor, Event, Category, Payments, Accounts, GoodsDonation } = models;

        let whereClause = {};
        if (donationIds && donationIds.length > 0) {
            whereClause.donation_id = {
                [Op.in]: donationIds
            };
        }

        const donations = await Donations.findAll({
            where: whereClause,
            include: [
                {
                    model: Donor,
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ],
                    attributes: ['donor_id', 'fullname', 'profile_image']
                },
                {
                    model: Event,
                    include: [
                        {
                            model: Category,
                            attributes: ['name']
                        }
                    ],
                    attributes: ['event_id', 'title', 'description']
                },
                {
                    model: Payments,
                    attributes: ['payment_id', 'amount', 'currency', 'payment_status', 'paid_at']
                },
                {
                    model: GoodsDonation,
                    attributes: ['goods_id', 'type_goods', 'detailed_description', 'quantity', 'condition', 'drop_off_location', 'preferred_date', 'preferred_time']
                }
            ],
            attributes: [
                'donation_id',
                'donation_type',
                'status',
                'remark',
                'is_anonymous',
                'mail_reciept',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });
        
        // Log activity - Export donations
        const exportCount = donations.length
        await logDirectorActivity(
            req.user.account_id,
            'download',
            'donation',
            `Exported ${exportCount} donation record(s)`,
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        res.json({
            success: true,
            data: donations,
            message: 'Donations exported successfully'
        });

    } catch (error) {
        console.log('exportDonations failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDonationDetails = async (req, res) => {
    try {
        const { donationId } = req.params;
        const { Donations, Donor, Event, Category, Payments, Accounts, GoodsDonation } = models;

        const donation = await Donations.findByPk(donationId, {
            include: [
                {
                    model: Donor,
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                },
                {
                    model: Event,
                    include: [
                        {
                            model: Category,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: Payments
                },
                {
                    model: GoodsDonation
                }
            ]
        });

        if (!donation) {
            return res.json({
                success: false,
                message: 'Donation not found'
            });
        }

        res.json({
            success: true,
            data: donation,
            message: 'Donation details retrieved successfully'
        });

    } catch (error) {
        console.log('getDonationDetails failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
