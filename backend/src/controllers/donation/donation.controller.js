import models from "../../models/index.js"
import { Op } from "sequelize"
import { notifyEventAvailableForDonations, notifyNewDonation } from "../../socket.js"

export const enableOrDisableFunds = async (req, res) => {
    try {
        const { funds } = req.body
        console.log(funds)
        const eventId = req.params.id
        const { Event } = models

        const isEventExist = await Event.findOne({ where: { event_id: eventId } })
        if(!isEventExist) { return res.json({ message: 'event is not found' }) }

        const updateEvent = await Event.update(
            { funds_donation: funds },
            { where: { event_id: isEventExist.event_id } })

        if(!updateEvent) { return res.json({ message: 'event donation failed' }) }

        if (funds) {
            try {
                const updatedEvent = await Event.findOne({ 
                    where: { event_id: isEventExist.event_id },
                    attributes: ['event_id', 'title', 'funds_donation', 'goods_donation', 'status', 'event_started', 'event_ended']
                });
                
                if (updatedEvent && (updatedEvent.status === 'Upcoming' || updatedEvent.status === 'Ongoing')) {
                    notifyEventAvailableForDonations(updatedEvent.event_id, {
                        title: updatedEvent.title,
                        funds_donation: updatedEvent.funds_donation,
                        goods_donation: updatedEvent.goods_donation,
                        status: updatedEvent.status
                    });
                }
            } catch (socketError) {
                console.error('Failed to emit event available for donations socket event:', socketError.message);
            }
        }

        return res.json({ success: true, message: `funds event donation ${funds ? 'activated' : 'deactivated'}` })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('enable or disable event donation failed: ', error.message)
    }
}

export const enableOrDisableGoods = async (req, res) => {
    try {
        const { goods, goodsTypes } = req.body
        const eventId = req.params.id
        const { Event, EventGoodsType } = models

        const isEventExist = await Event.findOne({ where: { event_id: eventId } })
        if(!isEventExist) { 
            return res.json({ success: false, message: 'event is not found' }) 
        }

        // Update event goods_donation status
        const updateEvent = await Event.update(
            { goods_donation: goods },
            { where: { event_id: isEventExist.event_id } })

        if(!updateEvent) { 
            return res.json({ success: false, message: 'event donation failed' }) 
        }

        // Handle goods types selection
        if (goods && goodsTypes && Array.isArray(goodsTypes) && goodsTypes.length > 0) {
            // Delete existing goods types for this event
            await EventGoodsType.destroy({
                where: { event_id: eventId }
            });

            // Create new goods type records
            const validGoodsTypes = ['ready_to_eat_food', 'hygiene_kits', 'baby_needs', 'bottled_water', 'blankets_towels', 'emergency_kits', 'medicine'];
            const goodsTypeRecords = goodsTypes
                .filter(type => validGoodsTypes.includes(type))
                .map(type => ({
                    event_id: eventId,
                    goods_type: type
                }));

            if (goodsTypeRecords.length > 0) {
                await EventGoodsType.bulkCreate(goodsTypeRecords);
            }
        } else if (!goods) {
            // If goods donation is disabled, remove all goods types
            await EventGoodsType.destroy({
                where: { event_id: eventId }
            });
        }

        if (goods) {
            try {
                const updatedEvent = await Event.findOne({ 
                    where: { event_id: isEventExist.event_id },
                    attributes: ['event_id', 'title', 'funds_donation', 'goods_donation', 'status', 'event_started', 'event_ended']
                });
                
                if (updatedEvent && (updatedEvent.status === 'Upcoming' || updatedEvent.status === 'Ongoing')) {
                    notifyEventAvailableForDonations(updatedEvent.event_id, {
                        title: updatedEvent.title,
                        funds_donation: updatedEvent.funds_donation,
                        goods_donation: updatedEvent.goods_donation,
                        status: updatedEvent.status
                    });
                }
            } catch (socketError) {
                console.error('Failed to emit event available for donations socket event:', socketError.message);
            }
        }

        return res.json({ 
            success: true, 
            message: `goods event donation ${goods ? 'activated': 'deactivated'}` 
        })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('enable or disable goods event donation failed: ', error.message)
    }
}

export const getEventGoodsTypes = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { EventGoodsType } = models;

        const goodsTypes = await EventGoodsType.findAll({
            where: { event_id },
            attributes: ['goods_type']
        });

        const enabledTypes = goodsTypes.map(gt => gt.goods_type);

        return res.json({
            success: true,
            data: enabledTypes,
            message: 'Event goods types retrieved successfully'
        });
    } catch (error) {
        console.log('getEventGoodsTypes failed:', error.message);
        return res.json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export const getEventsOpenForDonations = async (req, res) => {
    try {
        const { Event, Organizer, Category, Donations, Payments, EventGoodsType } = models

        const allEvents = await Event.findAll({
            limit: 5,
            attributes: ['event_id', 'title', 'funds_donation', 'goods_donation', 'status']
        });
        console.log('Sample events in database:', allEvents);

        const events = await Event.findAll({
            where: {
                [Op.or]: [
                    { funds_donation: true },
                    { goods_donation: true }
                ],
                status: {
                    [Op.in]: ['Upcoming', 'Ongoing']
                }
            },
            include: [
                {
                    model: Organizer,
                    attributes: ['organizer_id', 'name']
                },
                {
                    model: Category,
                    attributes: ['category_id', 'name'],
                    through: { attributes: [] }
                },
                {
                    model: EventGoodsType,
                    attributes: ['goods_type'],
                    required: false
                }
            ],
            order: [['event_started', 'ASC']]
        })

        const eventsWithStats = await Promise.all(events.map(async (event) => {
            const eventData = event.toJSON();
            
            // Extract enabled goods types
            const enabledGoodsTypes = eventData.EventGoodsTypes 
                ? eventData.EventGoodsTypes.map(egt => egt.goods_type)
                : [];
            
            const donations = await Donations.findAll({
                where: { 
                    event_id: event.event_id,
                    status: 'RECEIVED'
                },
                attributes: ['donation_id', 'account_id', 'donation_type']
            });

            const totalRaised = await Payments.sum('amount', {
                where: { 
                    payment_status: 'PAID',
                    donation_id: donations.map(d => d.donation_id)
                }
            }) || 0;

            const uniqueDonors = new Set(donations.map(donation => donation.account_id));
            const donorCount = uniqueDonors.size;

            const totalDonations = donations.length;

            const goodsDonationCount = await Donations.count({
                where: { 
                    event_id: event.event_id,
                    status: 'RECEIVED',
                    donation_type: 'GOODS'
                }
            });

            const averageDonation = totalDonations > 0 ? totalRaised / totalDonations : 0;

            const progressPercentage = Math.min((totalRaised / 100000) * 100, 100); // Assuming 100k target

            return {
                ...eventData,
                enabledGoodsTypes: enabledGoodsTypes,
                donationStats: {
                    totalRaised: totalRaised,
                    donorCount: donorCount,
                    progressPercentage: progressPercentage,
                    totalDonations: totalDonations,
                    averageDonation: averageDonation,
                    goodsDonationCount: goodsDonationCount
                }
            };
        }));

        return res.json({ 
            success: true, 
            data: eventsWithStats,
            count: eventsWithStats.length,
            message: 'Events open for donations retrieved successfully'
        })

    } catch (error) {
        res.json({ success: false, message: 'Internal Server Error' })
        console.log('get events open for donations failed: ', error.message)
    }
}

export const getEventDonationStats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { Event, Donations, Payments } = models;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.json({
                success: false,
                message: 'Event not found'
            });
        }

        const donations = await Donations.findAll({
            where: { 
                event_id: eventId,
                status: 'RECEIVED'
            },
            attributes: ['donation_id', 'account_id', 'is_anonymous']
        });

        const totalRaised = await Payments.sum('amount', {
            where: { 
                payment_status: 'PAID',
                donation_id: donations.map(d => d.donation_id)
            }
        }) || 0;

        const uniqueDonors = new Set(donations.map(donation => donation.account_id));
        const donorCount = uniqueDonors.size;
        const totalDonations = donations.length;
        const averageDonation = totalDonations > 0 ? totalRaised / totalDonations : 0;

        const recentDonations = await Payments.findAll({
            where: { 
                payment_status: 'PAID',
                donation_id: donations.map(d => d.donation_id)
            },
            include: [
                {
                    model: Donations,
                    where: { event_id: eventId },
                    attributes: ['donation_id', 'is_anonymous']
                }
            ],
            attributes: ['amount', 'currency', 'paid_at'],
            order: [['paid_at', 'DESC']],
            limit: 10
        });

        const formattedRecentDonations = recentDonations.map(payment => ({
            donation_id: payment.Donation.donation_id,
            amount: payment.amount,
            currency: payment.currency,
            paid_at: payment.paid_at,
            is_anonymous: payment.Donation.is_anonymous
        }));

        return res.json({
            success: true,
            data: {
                event: {
                    event_id: event.event_id,
                    title: event.title,
                    description: event.description
                },
                stats: {
                    totalRaised: totalRaised,
                    donorCount: donorCount,
                    totalDonations: totalDonations,
                    averageDonation: averageDonation
                },
                recentDonations: formattedRecentDonations
            },
            message: 'Event donation statistics retrieved successfully'
        });

    } catch (error) {
        console.log('getEventDonationStats failed:', error.message);
        res.json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getDonationById = async (req, res) => {
    try {
        const { donationId } = req.params
        const { Donations, Donor, Event, Payments } = models

        const donation = await Donations.findByPk(donationId, {
            include: [
                {
                    model: Event,
                    attributes: ['event_id', 'title']
                },
                {
                    model: Payments,
                    attributes: ['payment_id', 'amount', 'currency', 'payment_status', 'paid_at']
                }
            ]
        })

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            })
        }

        const donationData = donation.toJSON()
        let overallStatus = donationData.status

        if (donationData.Payments && donationData.Payments.length > 0) {
            const hasPaidPayment = donationData.Payments.some(payment => payment.payment_status === 'PAID')
            if (hasPaidPayment && donationData.status === 'PENDING') {
                overallStatus = 'RECEIVED'
            }
        }

        const responseData = {
            ...donationData,
            status: overallStatus
        }

        console.log('Final response data:', responseData)

        res.json({
            success: true,
            data: responseData,
            message: 'Donation retrieved successfully'
        })

    } catch (error) {
        console.log('getDonationById failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

export const getMyDonations = async (req, res) => {
    try {
        const { Donations, Event, Category, GoodsDonation, Payments } = models;

        const accountId = req.user?.account_id;
        if (!accountId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const donations = await Donations.findAll({
            where: { account_id: accountId },
            include: [
                {
                    model: Event,
                    include: [
                        {
                            model: Category,
                            attributes: ['name'],
                            through: { attributes: [] }
                        }
                    ],
                },
                { model: GoodsDonation },
                { model: Payments }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedData = donations.map((donation) => {
            const d = donation.toJSON();
            const eventTitle = d.Event?.title || 'Untitled Campaign';
            const categoryName = (d.Event?.Categories && d.Event.Categories.length > 0) 
                ? d.Event.Categories[0].name 
                : (d.Event?.category || '');
            const donationType = d.donation_type === 'GOODS' ? 'goods' : 'money';
            const createdAt = d.createdAt || d.updatedAt || d.date || new Date().toISOString();
            const payment = Array.isArray(d.Payments) && d.Payments.length > 0 ? d.Payments[0] : null;

            const quantityRaw = d.GoodsDonation?.quantity;
            const quantityNum = typeof quantityRaw === 'number'
                ? quantityRaw
                : (typeof quantityRaw === 'string' ? parseInt(quantityRaw.replace(/[^0-9]/g, ''), 10) : 0);
            const safeQuantityNum = Number.isFinite(quantityNum) ? quantityNum : 0;

            return {
                id: d.donation_id || d.id || 'N/A',
                event_id: d.event_id || d.Event?.event_id || null,
                campaign: eventTitle,
                campaignType: d.Event?.type || d.Event?.category || 'Campaign',
                eventStatus: d.Event?.status || '',
                amount: donationType === 'money' ? (payment?.amount || 0) : 0,
                date: createdAt,
                status: (d.status || 'PENDING').toString().toLowerCase(),
                paymentMethod: payment?.method || 'Funds',
                transactionId: payment?.payment_id || d.transaction_id || '',
                description: donationType === 'goods' ? (d.GoodsDonation?.detailed_description || 'In-kind donation') : 'Funds donation',
                impact: donationType === 'goods' ? (d.GoodsDonation?.type_goods?.join(', ') || 'Goods') : 'Monetary support',
                category: categoryName,
                progress: 0,
                target: 0,
                raised: 0,
                donationType,
                goodsValue: donationType === 'goods' ? (d.GoodsDonation?.estimated_value || 0) : 0,
                goodsQuantity: donationType === 'goods' ? safeQuantityNum : 0,
                goodsQuantityText: donationType === 'goods' ? (quantityRaw ?? '') : '',
                goodsDescription: d.GoodsDonation?.detailed_description || '',
                goodsTypes: d.GoodsDonation?.type_goods?.join(', ') || ''
            };
        });

        // Log activity - View my donations
        await logDonorActivity(
            accountId,
            'access',
            'donation',
            'Viewed my donations',
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            data: formattedData,
            message: 'My donations retrieved successfully'
        });
    } catch (error) {
        console.log('getMyDonations failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const getMyDonationHistory = async (req, res) => {
    try {
        const { Donations, Event, Category, GoodsDonation, Payments } = models;

        const accountId = req.user?.account_id;
        if (!accountId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const donations = await Donations.findAll({
            where: { 
                account_id: accountId,
                [Op.or]: [
                    { status: { [Op.in]: ['COMPLETED', 'DISTRIBUTED'] } },
                    { '$Event.status$': 'Completed' }
                ]
            },
            include: [
                {
                    model: Event,
                    where: {},
                    required: false,
                    include: [
                        {
                            model: Category,
                            attributes: ['name']
                        }
                    ],
                },
                { model: GoodsDonation },
                { model: Payments }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedData = donations.map((donation) => {
            const d = donation.toJSON();
            const eventTitle = d.Event?.title || 'Untitled Campaign';
            const categoryName = (d.Event?.Categories && d.Event.Categories.length > 0) 
                ? d.Event.Categories[0].name 
                : (d.Event?.category || '');
            const donationType = d.donation_type === 'GOODS' ? 'goods' : 'money';
            const createdAt = d.createdAt || d.updatedAt || d.date || new Date().toISOString();
            const payment = Array.isArray(d.Payments) && d.Payments.length > 0 ? d.Payments[0] : null;
            
            const dateObj = new Date(createdAt);
            const year = dateObj.getFullYear();
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            const month = monthNames[dateObj.getMonth()];

            const quantityRaw = d.GoodsDonation?.quantity;
            const quantityNum = typeof quantityRaw === 'number'
                ? quantityRaw
                : (typeof quantityRaw === 'string' ? parseInt(quantityRaw.replace(/[^0-9]/g, ''), 10) : 0);
            const safeQuantityNum = Number.isFinite(quantityNum) ? quantityNum : 0;

            // Calculate impact information
            let impactDescription = '';
            let impactDetails = {};
            
            if (donationType === 'goods') {
                const goodsTypes = d.GoodsDonation?.type_goods?.join(', ') || 'Goods';
                const quantity = safeQuantityNum > 0 ? safeQuantityNum : (quantityRaw || '');
                const estimatedValue = d.GoodsDonation?.estimated_value || 0;
                
                impactDescription = `${goodsTypes}${quantity ? ` (${quantity} ${typeof quantity === 'number' ? 'items' : ''})` : ''}`;
                impactDetails = {
                    type: 'goods',
                    goodsTypes: goodsTypes,
                    quantity: quantity,
                    quantityText: quantityRaw || '',
                    estimatedValue: estimatedValue
                };
            } else {
                const amount = payment?.amount || 0;
                impactDescription = `₱${parseFloat(amount).toLocaleString()} contributed`;
                impactDetails = {
                    type: 'money',
                    amount: amount,
                    contribution: `Monetary support of ₱${parseFloat(amount).toLocaleString()}`
                };
            }

            return {
                id: d.donation_id || d.id || 'N/A',
                campaign: eventTitle,
                campaignType: d.Event?.type || d.Event?.category || 'Campaign',
                eventStatus: d.Event?.status || '',
                amount: donationType === 'money' ? (payment?.amount || 0) : 0,
                date: createdAt,
                status: (d.status || 'PENDING').toString().toLowerCase(),
                paymentMethod: payment?.method || 'Funds',
                transactionId: payment?.payment_id || d.transaction_id || '',
                description: donationType === 'goods' ? (d.GoodsDonation?.detailed_description || 'In-kind donation') : 'Funds donation',
                impact: impactDescription,
                impactDetails: impactDetails,
                category: categoryName,
                progress: 0,
                target: 0,
                raised: 0,
                year,
                month,
                donationType,
                goodsValue: donationType === 'goods' ? (d.GoodsDonation?.estimated_value || 0) : 0,
                goodsQuantity: donationType === 'goods' ? safeQuantityNum : 0,
                goodsQuantityText: donationType === 'goods' ? (quantityRaw ?? '') : '',
                goodsDescription: d.GoodsDonation?.detailed_description || '',
                goodsTypes: d.GoodsDonation?.type_goods?.join(', ') || ''
            };
        });

        // Log activity - View donation history
        await logDonorActivity(
            accountId,
            'access',
            'donation',
            'Viewed donation history',
            req.ip || req.connection.remoteAddress,
            req.get('user-agent')
        )

        return res.json({
            success: true,
            data: formattedData,
            message: 'Donation history retrieved successfully'
        });
    } catch (error) {
        console.log('getMyDonationHistory failed:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const submitGoodsDonation = async (req, res) => {
    try {
        const { 
            goodsType, 
            goodsDescription, 
            quantity, 
            quantityUnit,
            condition, 
            dropoffLocation, 
            preferredDate, 
            preferredTime, 
            isAnonymous, 
            showReceipt 
        } = req.validatedBody;
        
        const { event_id } = req.params;
        const { Donations, GoodsDonation, Event, Accounts, Donor, Role, EventGoodsType } = models;

        const event = await Event.findByPk(event_id);
        if (!event) {
            return res.json({
                success: false,
                message: 'Event not found'
            });
        }

        if (!event.goods_donation) {
            return res.json({
                success: false,
                message: 'This event does not accept goods donations'
            });
        }

        // Check if the selected goods type is enabled for this event
        const enabledGoodsTypes = await EventGoodsType.findAll({
            where: { event_id: parseInt(event_id) },
            attributes: ['goods_type']
        });

        const enabledTypes = enabledGoodsTypes.map(egt => egt.goods_type);
        
        // If event has specific goods types configured, validate against them
        if (enabledTypes.length > 0 && !enabledTypes.includes(goodsType)) {
            return res.json({
                success: false,
                message: `This event only accepts the following goods types: ${enabledTypes.join(', ')}`
            });
        }

        const account = await Accounts.findByPk(req.user.account_id);
        if (!account) {
            return res.json({
                success: false,
                message: 'Account not found'
            });
        }

        const donation = await Donations.create({
            event_id: event.event_id,
            account_id: account.account_id,
            donation_type: 'GOODS',
            status: 'PENDING',
            is_anonymous: isAnonymous || false,
            mail_reciept: showReceipt || false,
            remark: `Goods donation: ${goodsType}`
        });

        const quantityString = `${quantity} ${quantityUnit || 'Items'}`;

        const goodsDonation = await GoodsDonation.create({
            donation_id: donation.donation_id,
            type_goods: [goodsType],
            detailed_description: goodsDescription,
            quantity: quantityString,
            condition: ['ready_to_eat_food', 'emergency_kits', 'medicine', 'bottled_water'].includes(goodsType) ? null : condition,
            drop_off_location: dropoffLocation || 'UCLM Front Gate 1',
            preferred_date: preferredDate,
            preferred_time: preferredTime
        });

        // Get donor name
        const donor = await Donor.findOne({ where: { account_id: account.account_id } });
        const donorName = donation.is_anonymous ? 'Anonymous' : (donor?.fullname || donor?.name || account.email || 'Donor');

        // Emit real-time notification
        notifyNewDonation({
            donation_id: donation.donation_id,
            donation_type: 'GOODS',
            amount: 0,
            status: donation.status,
            donor_name: donorName,
            is_anonymous: donation.is_anonymous || false,
            event_name: event.title,
            goods_description: goodsDescription,
            goods_quantity: quantityString,
            payment_method: '',
            transaction_id: ''
        });

        res.json({
            success: true,
            message: 'Goods donation submitted successfully! We\'ll contact you soon to coordinate the drop-off.',
            data: {
                donation_id: donation.donation_id,
                goods_id: goodsDonation.goods_id,
                status: donation.status
            }
        });

    } catch (error) {
        console.log('submitGoodsDonation failed:', error.message);
        console.error('Error details:', error);
        res.json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
