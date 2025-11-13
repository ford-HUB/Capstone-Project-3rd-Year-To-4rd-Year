import React from 'react';
import { FileText, BarChart3, Users, TrendingUp } from 'lucide-react';
import StatCard from '../ui/StatCard.jsx';

/**
 * Dashboard statistics component for form responses
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {number} props.stats.totalResponses - Total number of responses
 * @param {number} props.stats.totalForms - Total number of forms
 * @param {number} props.stats.totalRespondents - Total number of unique respondents
 * @param {number} props.stats.responseRate - Response rate percentage
 */
const DashboardStats = ({ stats }) => {
    const statCards = [
        {
            title: "Total Responses",
            value: stats.totalResponses.toLocaleString(),
            icon: FileText,
            color: "bg-blue-500",
            subtitle: "All time responses"
        },
        {
            title: "Active Forms",
            value: stats.totalForms,
            icon: BarChart3,
            color: "bg-green-500",
            subtitle: "Currently active"
        },
        {
            title: "Unique Respondents",
            value: stats.totalRespondents.toLocaleString(),
            icon: Users,
            color: "bg-purple-500",
            subtitle: "Individual participants"
        },
        {
            title: "Response Rate",
            value: `${stats.responseRate}%`,
            icon: TrendingUp,
            color: "bg-orange-500",
            subtitle: "Average completion rate"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
                <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    color={card.color}
                    subtitle={card.subtitle}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
