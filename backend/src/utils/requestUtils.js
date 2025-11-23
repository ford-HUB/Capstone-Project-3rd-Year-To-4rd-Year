import { sendMail } from "../services/mailService.js";

export const formatRoleName = (role) => {
    const roleMap = {
        'staff': 'Staff',
        'coordinator': 'Coordinator',
        'assistant_coordinator': 'Assistant Coordinator'
    };
    return roleMap[role] || role;
};

export const notifyRequestAction = async (email, action, data) => {
    const actionConfig = {
        'APPROVED': {
            subject: 'Your role request has been approved',
            title: 'Request Approved',
            description: `Congratulations! Your request for ${formatRoleName(data.requested_role)} role has been approved.`,
            status_title: 'Request Status: Approved',
            status_description: 'You will receive a separate email with instructions to complete your account setup.',
            action_title: 'Next steps:',
            action_text: 'Please check your email for the verification link to complete your account setup. The link will expire in 24 hours.'
        },
        'REJECTED': {
            subject: 'Your role request has been declined',
            title: 'Request Declined',
            description: `We regret to inform you that your request for ${formatRoleName(data.requested_role)} role has been declined.`,
            status_title: 'Request Status: Declined',
            status_description: 'Your request has been reviewed and unfortunately cannot be approved at this time.',
            action_title: 'Reason for decline:',
            action_text: data.reason || 'No specific reason provided'
        }
    }

    const config = actionConfig[action] || actionConfig['REJECTED']
    const template = 'accountActionNotification.html'
    
    const variables = {
        email: process.env.AUTH_MAILER,
        title: config.title,
        description: config.description,
        status_title: config.status_title,
        status_description: config.status_description,
        reason: data.reason || 'No specific reason provided',
        action_title: config.action_title,
        action_text: config.action_text
    }
    
    await sendMail(email, config.subject, config.description, template, variables)
}

