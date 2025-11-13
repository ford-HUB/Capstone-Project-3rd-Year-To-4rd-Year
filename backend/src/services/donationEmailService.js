import { sendMail } from './mailService.js';

export const sendDonationStatusUpdateEmail = async ({
    donorEmail,
    donorName,
    eventTitle,
    donationId,
    donationType,
    newStatus,
    eventStartDate,
    eventEndDate,
    remark
}) => {
    try {
        const subject = `Donation Status Update - ${eventTitle}`;
        
        // Determine the template based on status
        let templateName;
        if (newStatus === 'RECEIVED') {
            templateName = 'goodsReceivedNotification.html';
        } else if (newStatus === 'DISTRIBUTED') {
            templateName = 'donationDistributedNotification.html';
        } else if (newStatus === 'COMPLETED') {
            templateName = 'donationCompletedNotification.html';
        } else {
            templateName = 'donationDistributedNotification.html'; // fallback
        }

        // Format dates
        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const variables = {
            donorName: donorName || 'Valued Donor',
            eventTitle: eventTitle || 'Event',
            donationId: donationId || 'N/A',
            donationType: donationType || 'Donation',
            newStatus: newStatus || 'Updated',
            eventStartDate: eventStartDate ? formatDate(eventStartDate) : 'N/A',
            eventEndDate: eventEndDate ? formatDate(eventEndDate) : 'N/A',
            remark: remark || 'our facility',
            currentDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        const textContent = {
            text: `Dear ${variables.donorName},\n\nYour donation for "${variables.eventTitle}" has been updated to ${variables.newStatus}.\n\nDonation ID: ${variables.donationId}\nDonation Type: ${variables.donationType}\nEvent: ${variables.eventTitle}\nStatus: ${variables.newStatus}\n\nThank you for your generous contribution!\n\nBest regards,\nUCLM CARES Team`
        };

        await sendMail(
            donorEmail,
            subject,
            textContent,
            templateName,
            variables
        );

        console.log(`Donation status email sent to ${donorEmail} for donation ${donationId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send donation status email:', error.message);
        return { success: false, error: error.message };
    }
};

export const sendDonationReceiptEmail = async ({
    donorEmail,
    donorName,
    eventTitle,
    donationId,
    donationType,
    amount,
    currency = 'PHP'
}) => {
    try {
        const subject = `Donation Receipt - ${eventTitle}`;
        const templateName = 'donationReceiptNotification.html';

        const variables = {
            donorName: donorName || 'Valued Donor',
            eventTitle: eventTitle || 'Event',
            donationId: donationId || 'N/A',
            donationType: donationType || 'Donation',
            amount: amount || '0.00',
            currency: currency || 'PHP',
            currentDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        const textContent = {
            text: `Dear ${variables.donorName},\n\nThank you for your donation to "${variables.eventTitle}".\n\nDonation ID: ${variables.donationId}\nDonation Type: ${variables.donationType}\nAmount: ${variables.currency} ${variables.amount}\nEvent: ${variables.eventTitle}\n\nYour generosity makes a difference!\n\nBest regards,\nUCLM CARES Team`
        };

        await sendMail(
            donorEmail,
            subject,
            textContent,
            templateName,
            variables
        );

        console.log(`Donation receipt email sent to ${donorEmail} for donation ${donationId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send donation receipt email:', error.message);
        return { success: false, error: error.message };
    }
};
