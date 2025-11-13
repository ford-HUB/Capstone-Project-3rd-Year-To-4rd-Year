import React from 'react';

const MetricRow = ({ label, value, valueColor = 'gray-900' }) => {
    const valueColorClasses = {
        'gray-900': 'font-semibold',
        'green-600': 'font-semibold text-green-600',
        'blue-600': 'font-semibold text-blue-600',
        'yellow-600': 'font-semibold text-yellow-600',
        'red-600': 'font-semibold text-red-600'
    };

    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600">{label}</span>
            <span className={valueColorClasses[valueColor]}>{value}</span>
        </div>
    );
};

const MetricSection = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const DetailedMetrics = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MetricSection title="User Metrics">
                <MetricRow 
                    label="Total Users" 
                    value={metrics?.metrics?.users?.total || 0} 
                />
                <MetricRow 
                    label="Active Users" 
                    value={metrics?.metrics?.users?.active || 0} 
                    valueColor="green-600"
                />
                <MetricRow 
                    label="Activation Rate" 
                    value={`${metrics?.metrics?.users?.activationRate || 0}%`} 
                />
            </MetricSection>

            <MetricSection title="Event Metrics">
                <MetricRow 
                    label="Upcoming" 
                    value={metrics?.metrics?.events?.upcoming || 0} 
                    valueColor="blue-600"
                />
                <MetricRow 
                    label="Ongoing" 
                    value={metrics?.metrics?.events?.ongoing || 0} 
                    valueColor="yellow-600"
                />
                <MetricRow 
                    label="Completed" 
                    value={metrics?.metrics?.events?.completed || 0} 
                    valueColor="green-600"
                />
                <MetricRow 
                    label="Completion Rate" 
                    value={`${metrics?.metrics?.events?.completionRate || 0}%`} 
                />
            </MetricSection>

            <MetricSection title="Volunteer Metrics">
                <MetricRow 
                    label="Total Volunteers" 
                    value={metrics?.metrics?.volunteers?.total || 0} 
                />
                <MetricRow 
                    label="Registrations" 
                    value={metrics?.metrics?.volunteers?.registrations || 0} 
                />
                <MetricRow 
                    label="Participation Rate" 
                    value={`${metrics?.metrics?.volunteers?.participationRate || 0}%`} 
                />
                <MetricRow 
                    label="Total Attendance" 
                    value={metrics?.metrics?.attendance?.total || 0} 
                />
            </MetricSection>
        </div>
    );
};

export default DetailedMetrics;
