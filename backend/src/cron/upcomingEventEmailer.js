import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { sendMail } from '../services/mailService.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const { Event, Volunteer, Student, Accounts } = models;

dayjs.extend(utc);

// Runs every day at 00:00 UTC to email subscribers about events starting "tomorrow"
cron.schedule('0 0 * * *', async () => {
    try {
        // Compute tomorrow's start and end in UTC using dayjs
        const tomorrowStart = dayjs.utc().add(1, 'day').startOf('day').toDate();
        const tomorrowEnd = dayjs.utc().add(1, 'day').endOf('day').toDate();

        console.log(`[UpcomingEventEmailer] Checking events between ${tomorrowStart.toISOString()} and ${tomorrowEnd.toISOString()}`);

        // Find events starting tomorrow (UTC) that are still upcoming
        const upcomingEvents = await Event.findAll({
            where: {
                status: 'Upcoming',
                event_started: {
                    [Op.between]: [tomorrowStart, tomorrowEnd]
                }
            },
            order: [['event_started', 'ASC']]
        });

        if (!upcomingEvents || upcomingEvents.length === 0) {
            console.log('[UpcomingEventEmailer] No upcoming events for tomorrow. Skipping.');
            return;
        }

        // Build a simple HTML list for the digest template
        const formatDateTime = (date) => {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const eventsListHtml = upcomingEvents.map((evt) => {
            const start = formatDateTime(evt.event_started);
            const end = formatDateTime(evt.event_ended);
            return `
                <li style="margin-bottom:12px;">
                    <div style="font-weight:600;color:#0f172a;">${evt.title}</div>
                    <div style="color:#334155;">${evt.description || ''}</div>
                    <div style="color:#475569;font-size:12px;margin-top:4px;">
                        When: ${start} — ${end}<br/>
                        Where: ${evt.location}
                    </div>
                </li>
            `;
        }).join('');

        // Get subscribed volunteers and their emails
        const subscribers = await Volunteer.findAll({
            where: { is_subscribed: true },
            attributes: ['volunteer_id'],
            include: [
                {
                    model: Student,
                    attributes: ['account_id', 'firstname', 'lastname'],
                    include: [
                        {
                            model: Accounts,
                            attributes: ['email']
                        }
                    ]
                }
            ],
            nest: true
        });

        const toEmails = subscribers
            .map((v) => {
                // Depending on Sequelize naming, Account may appear as Accounts or Account
                const accountObj = v.Student?.Accounts || v.Student?.Account || null;
                return accountObj?.email || null;
            })
            .filter(Boolean);

        if (toEmails.length === 0) {
            console.log('[UpcomingEventEmailer] No subscribed volunteers with emails. Skipping.');
            return;
        }

        console.log(`[UpcomingEventEmailer] Preparing to send digest to ${toEmails.length} subscribers.`);

        // Send individual emails (can be optimized later for batching)
        const subject = 'Upcoming Events Tomorrow - UCLM Cares';
        const textFallback = {
            text: 'There are events starting tomorrow. Please check your UCLM Cares portal for details.'
        };
        const variablesBase = {
            currentDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            eventsList: eventsListHtml
        };

        let sentCount = 0;
        for (const email of toEmails) {
            try {
                await sendMail(
                    email,
                    subject,
                    textFallback,
                    'upcomingEventsDigest.html',
                    variablesBase
                );
                sentCount++;
            } catch (err) {
                console.error(`[UpcomingEventEmailer] Failed sending to ${email}: ${err.message}`);
            }
        }

        console.log(`[UpcomingEventEmailer] Digest sent to ${sentCount}/${toEmails.length} subscribers.`);
    } catch (error) {
        console.error('[UpcomingEventEmailer] Cron error:', error.message);
    }
}, { timezone: 'UTC' });


