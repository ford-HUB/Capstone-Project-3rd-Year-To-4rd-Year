const extractInitialsFromWords = (text, maxLength) => {
    if (!text || typeof text !== 'string') return '';

    const words = text.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';

    const initials = words.map(word => word[0]).join('').toUpperCase();
    return initials.substring(0, maxLength);
};

export const generateInitials = (input, maxLength = 2) => {
    if (!input) return '';

    if (typeof input === 'string') {
        return extractInitialsFromWords(input, maxLength);
    }

    if (typeof input !== 'object') return '';

    if (input.organization_name) {
        return extractInitialsFromWords(input.organization_name, maxLength);
    }

    if (input.firstname && input.lastname) {
        const firstInitial = input.firstname[0]?.toUpperCase() || '';
        const lastInitial = input.lastname[0]?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    }

    if (input.name) {
        return extractInitialsFromWords(input.name, maxLength);
    }

    if (input.firstname) {
        return input.firstname[0]?.toUpperCase() || '';
    }

    return '';
};

