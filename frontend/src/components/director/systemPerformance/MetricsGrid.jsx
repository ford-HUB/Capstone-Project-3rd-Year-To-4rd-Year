import React from 'react';
import { Server, Users, Calendar, TrendingUp } from 'lucide-react';
import MetricCard from './MetricCard';

const MetricsGrid = ({ metrics }) => {
    const formatUptime = (seconds) => {
        if (!seconds) return 'N/A';
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    const metricsData = [
        {
            title: 'System Uptime',
            value: formatUptime(metrics?.systemUptime),
            icon: Server,
            iconColor: 'green'
        },
        {
            title: 'Active Users',
            value: metrics?.metrics?.users?.active || 0,
            subtitle: `${metrics?.metrics?.users?.activationRate || 0}% activation rate`,
            icon: Users,
            iconColor: 'blue',
            valueColor: 'gray-900',
            subtitleColor: 'gray-500'
        },
        {
            title: 'Total Events',
            value: metrics?.metrics?.events?.total || 0,
            subtitle: `${metrics?.metrics?.events?.completionRate || 0}% completion rate`,
            icon: Calendar,
            iconColor: 'purple',
            valueColor: 'gray-900',
            subtitleColor: 'gray-500'
        },
        {
            title: 'Recent Matches',
            value: metrics?.metrics?.matching?.recentMatches || 0,
            subtitle: 'Last 24 hours',
            icon: TrendingUp,
            iconColor: 'orange',
            valueColor: 'gray-900',
            subtitleColor: 'gray-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
                <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    subtitle={metric.subtitle}
                    icon={metric.icon}
                    iconColor={metric.iconColor}
                    valueColor={metric.valueColor}
                    subtitleColor={metric.subtitleColor}
                />
            ))}
        </div>
    );
};

export default MetricsGrid;
