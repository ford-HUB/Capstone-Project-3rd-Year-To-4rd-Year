import {
    BookOpen,
    Award,
    Users,
    Heart,
    Leaf,
    LifeBuoy,
    Globe,
    Edit,
    Copy,
    BarChart3,
    Trash2
} from 'lucide-react';


export const TEMPLATE_CONFIG = {
    "Donation Drive": {
        icon: Heart,
        color: 'rose',
        bgClass: 'from-rose-50 to-pink-100',
        badgeClass: 'bg-rose-100 text-rose-800',
        label: 'Volunteering Certificate',
        name: 'Donation Drives',
        description:
            'Certificate awarded for volunteering in donation and fundraising initiatives',
    },
    Outreach: {
        icon: Award,
        color: 'yellow',
        bgClass: 'from-yellow-50 to-amber-100',
        badgeClass: 'bg-yellow-100 text-yellow-800',
        label: 'Achievement Award',
        name: 'Community Outreach',
        description:
            'Certificate awarded for active participation in community outreach programs',
    },
    Health: {
        icon: LifeBuoy,
        color: 'red',
        bgClass: 'from-red-50 to-rose-100',
        badgeClass: 'bg-red-100 text-red-800',
        label: 'Health Volunteer Certificate',
        name: 'Health & Wellness',
        description:
            'Certificate awarded for contributing to health campaigns and wellness missions',
    },
    School: {
        icon: BookOpen,
        color: 'blue',
        bgClass: 'from-blue-50 to-indigo-100',
        badgeClass: 'bg-blue-100 text-blue-800',
        label: 'Course Certificate',
        name: 'Education Support',
        description:
            'Certificate awarded for volunteering in educational events and learning support activities',
    },
    Community: {
        icon: Users,
        color: 'green',
        bgClass: 'from-green-50 to-emerald-100',
        badgeClass: 'bg-green-100 text-green-800',
        label: 'Participation Certificate',
        name: 'Youth Engagement',
        description:
            'Certificate awarded for supporting youth-focused programs and leadership activities',
    },
    Charity: {
        icon: Leaf,
        color: 'teal',
        bgClass: 'from-teal-50 to-emerald-100',
        badgeClass: 'bg-teal-100 text-teal-800',
        label: 'Sustainability Certificate',
        name: 'Environmental Programs',
        description:
            'Certificate awarded for participating in environmental protection and sustainability projects',
    },
    "Relief Program": {
        icon: LifeBuoy,
        color: 'orange',
        bgClass: 'from-orange-50 to-amber-100',
        badgeClass: 'bg-orange-100 text-orange-800',
        label: 'Relief Service Certificate',
        name: 'Disaster & Relief',
        description:
            'Certificate awarded for volunteering in disaster response and relief operations',
    },
    Emergency: {
        icon: Globe,
        color: 'purple',
        bgClass: 'from-purple-50 to-violet-100',
        badgeClass: 'bg-purple-100 text-purple-800',
        label: 'Cultural Involvement Certificate',
        name: 'Cultural Events',
        description:
            'Certificate awarded for involvement in organizing or supporting cultural and heritage events',
    },
    Training: {
        icon: BookOpen,
        color: 'blue',
        bgClass: 'from-blue-50 to-indigo-100',
        badgeClass: 'bg-blue-100 text-blue-800',
        label: 'Training Certificate',
        name: 'Training & Development',
        description:
            'Certificate awarded for participating in training and development programs',
    },
    Seminar: {
        icon: BookOpen,
        color: 'blue',
        bgClass: 'from-blue-50 to-indigo-100',
        badgeClass: 'bg-blue-100 text-blue-800',
        label: 'Seminar Certificate',
        name: 'Seminars & Workshops',
        description:
            'Certificate awarded for attending seminars and workshops',
    },
    Others: {
        icon: BookOpen,
        color: 'blue',
        bgClass: 'from-blue-50 to-indigo-100',
        badgeClass: 'bg-blue-100 text-blue-800',
        label: 'Others Certificate',
        name: 'Others',
        description:
            'Certificate awarded for other categories',
    },
};


export const MENU_ACTIONS = [
    { key: 'edit', icon: Edit, label: 'Update New', className: '', navigation: '/director/templates-list' },
    {
        key: 'delete',
        icon: Trash2,
        label: 'Delete',
        className: 'text-red-600 hover:bg-red-50',
        separator: true,
        navigation: ''
    },
];
