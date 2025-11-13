import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Activity, Clock, Users, PieChart } from 'lucide-react';
import ChartCard from './ChartCard';

const ChartsGrid = ({ history, metrics }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        }
    };

    // Chart data generators
    const createLineChartData = (data, label, borderColor, backgroundColor) => ({
        labels: data?.map(item => new Date(item.timestamp).toLocaleTimeString()) || ['Current'],
        datasets: [{
            label,
            data: data?.map(item => item.value) || [0],
            borderColor,
            backgroundColor,
            tension: 0.4,
            fill: true
        }]
    });

    const createBarChartData = (data, label, backgroundColor, borderColor) => ({
        labels: data?.map(item => new Date(item.timestamp).toLocaleTimeString()) || ['Current'],
        datasets: [{
            label,
            data: data?.map(item => item.value) || [0],
            backgroundColor,
            borderColor,
            borderWidth: 1
        }]
    });

    const createDoughnutChartData = (labels, data, backgroundColor, borderColor) => ({
        labels,
        datasets: [{
            data,
            backgroundColor,
            borderColor,
            borderWidth: 2
        }]
    });

    // Chart data
    const systemLoadData = createLineChartData(
        history?.data?.systemLoad,
        'System Load (%)',
        'rgb(59, 130, 246)',
        'rgba(59, 130, 246, 0.1)'
    );

    const responseTimeData = createLineChartData(
        history?.data?.responseTime,
        'Response Time (ms)',
        'rgb(16, 185, 129)',
        'rgba(16, 185, 129, 0.1)'
    );

    const activeUsersData = createBarChartData(
        history?.data?.activeUsers,
        'Active Users',
        'rgba(168, 85, 247, 0.8)',
        'rgb(168, 85, 247)'
    );

    const eventStatusData = createDoughnutChartData(
        ['Upcoming', 'Ongoing', 'Completed'],
        [
            metrics?.metrics?.events?.upcoming || 0,
            metrics?.metrics?.events?.ongoing || 0,
            metrics?.metrics?.events?.completed || 0
        ],
        [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
        ],
        [
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)'
        ]
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="System Load" icon={Activity} iconColor="blue">
                <Line data={systemLoadData} options={chartOptions} />
            </ChartCard>

            <ChartCard title="Response Time" icon={Clock} iconColor="green">
                <Line data={responseTimeData} options={chartOptions} />
            </ChartCard>

            <ChartCard title="Active Users" icon={Users} iconColor="purple">
                <Bar data={activeUsersData} options={chartOptions} />
            </ChartCard>

            <ChartCard title="Event Status" icon={PieChart} iconColor="orange">
                <Doughnut data={eventStatusData} options={doughnutOptions} />
            </ChartCard>
        </div>
    );
};

export default ChartsGrid;
