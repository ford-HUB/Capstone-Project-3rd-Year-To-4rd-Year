import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';
import ChartCard from './ChartCard';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

/**
 * Statistics Charts Component
 * Displays various charts for donation statistics
 * Follows the design pattern from systemPerformance ChartsGrid
 */
const StatisticsCharts = ({ donationStats, dashboardStats, donationList = [] }) => {
    // Format number with thousand separators
    const formatNumber = (number) => {
        const num = parseFloat(number) || 0;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatNumber(value);
                    }
                }
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
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${formatNumber(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    // Prepare status breakdown data for Doughnut chart
    const statusBreakdownData = React.useMemo(() => {
        if (!donationStats?.statusBreakdown || donationStats.statusBreakdown.length === 0) {
            return null;
        }

        const labels = donationStats.statusBreakdown.map(item => {
            const status = item.status || item.dataValues?.status || 'Unknown';
            return status.charAt(0) + status.slice(1).toLowerCase();
        });

        const data = donationStats.statusBreakdown.map(item => 
            item.dataValues?.count || item.count || 0
        );

        const colors = [
            'rgba(59, 130, 246, 0.8)',   // blue - Pending
            'rgba(16, 185, 129, 0.8)',   // green - Completed
            'rgba(245, 158, 11, 0.8)',   // orange - Received
            'rgba(239, 68, 68, 0.8)',    // red - Cancelled
            'rgba(168, 85, 247, 0.8)',   // purple - Processing
            'rgba(107, 114, 128, 0.8)'   // gray - Other
        ];

        const borderColors = [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(168, 85, 247)',
            'rgb(107, 114, 128)'
        ];

        return {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, data.length),
                borderColor: borderColors.slice(0, data.length),
                borderWidth: 2
            }]
        };
    }, [donationStats]);

    // Prepare donation type distribution data for Doughnut chart
    const donationTypeData = React.useMemo(() => {
        if (!dashboardStats) return null;

        const totalDonations = (donationStats?.totalDonations || 0);
        const moneyDonations = totalDonations - (dashboardStats.totalGoods || 0);
        const goodsDonations = dashboardStats.totalGoods || 0;

        return {
            labels: ['Money Donations', 'Goods Donations'],
            datasets: [{
                data: [moneyDonations, goodsDonations],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',  // green for money
                    'rgba(59, 130, 246, 0.8)'   // blue for goods
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(59, 130, 246)'
                ],
                borderWidth: 2
            }]
        };
    }, [dashboardStats, donationStats]);

    // Format currency for tooltips
    const formatCurrencyShort = (amount) => {
        const num = parseFloat(amount) || 0;
        if (num >= 1000000) {
            return `₱${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `₱${(num / 1000).toFixed(1)}K`;
        }
        return `₱${num.toFixed(0)}`;
    };

    // Prepare improved comparison bar chart data with grouped bars
    const comparisonData = React.useMemo(() => {
        if (!donationStats || !dashboardStats) return null;

        const totalDonations = donationStats.totalDonations || 0;
        const completedDonations = donationStats.completedDonations || 0;
        // Get goods donations - check multiple possible sources
        let goodsDonations = dashboardStats?.totalGoods || 0;
        
        // Ensure goods donations are visible - if dashboardStats doesn't have it, try to calculate from donationList
        if (goodsDonations === 0 && donationList && donationList.length > 0) {
            // Fallback: count goods donations from donationList
            const goodsCount = donationList.filter(d => 
                d.donation_type === 'GOODS' || d.donation_type === 'goods'
            ).length;
            if (goodsCount > 0) {
                goodsDonations = goodsCount;
            }
        }
        
        const moneyDonations = totalDonations - goodsDonations;
        const totalDonors = dashboardStats.totalDonors || 0;
        const activeDonors = donationStats.activeDonors || 0;

        return {
            labels: ['Donations', 'Donors'],
            datasets: [
                {
                    label: 'Total',
                    data: [
                        totalDonations,
                        0
                    ],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',  // Blue for donations
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2
                },
                {
                    label: 'Total Donors',
                    data: [
                        0,
                        totalDonors
                    ],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',  // Purple for donors
                    borderColor: 'rgb(139, 92, 246)',
                    borderWidth: 2
                },
                {
                    label: 'Money Donations',
                    data: [
                        moneyDonations,
                        0
                    ],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgb(245, 158, 11)',
                    borderWidth: 2
                },
                {
                    label: 'Goods Donations',
                    data: [
                        goodsDonations,
                        0
                    ],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',  // Green color (same as completion rate)
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2
                }
            ]
        };
    }, [donationStats, dashboardStats, donationList]);

    // Enhanced chart options for comparison
    const comparisonChartOptions = React.useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${formatNumber(value)}`;
                    },
                    footer: function(tooltipItems) {
                        if (tooltipItems[0] && tooltipItems[0].dataIndex === 0) {
                            // Donations comparison - use actual stats data from closure
                            const total = donationStats?.totalDonations || 0;
                            const completed = donationStats?.completedDonations || 0;
                            const totalGoods = dashboardStats?.totalGoods || 0;
                            const money = total - totalGoods;
                            const goods = totalGoods;
                            
                            // Calculate percentages
                            const completionPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';
                            const moneyPercent = total > 0 ? ((money / total) * 100).toFixed(1) : '0.0';
                            const goodsPercent = total > 0 ? ((goods / total) * 100).toFixed(1) : '0.0';
                            
                            return [
                                `Completion: ${completionPercent}%`,
                                `Money: ${moneyPercent}% | Goods: ${goodsPercent}%`
                            ];
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000) {
                            return formatNumber(value);
                        }
                        return value;
                    },
                    font: {
                        size: 11
                    }
                }
            }
        }
    }), [donationStats, dashboardStats, formatNumber]);

    // Generate weekly data from donation list
    const weeklyData = React.useMemo(() => {
        // Calculate weekly data from actual donation list
        const weeklyArray = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Initialize last 7 weeks (each week is 7 days, non-overlapping)
        // Week 0 (most recent): today - 6 days to today (inclusive, 7 days)
        // Week 1: today - 13 days to today - 7 days (7 days)
        // Week 2: today - 20 days to today - 14 days (7 days)
        // etc.
        for (let i = 6; i >= 0; i--) {
            // Calculate week start: for week i, start is (i*7 + 6) days ago
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - (i * 7) - 6);
            weekStart.setHours(0, 0, 0, 0);
            
            // Week end is 7 days after start (exclusive, so it includes the 7th day)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            // For the most recent week (i === 0), ensure end includes today
            if (i === 0) {
                weekEnd.setDate(today.getDate() + 1);
                weekEnd.setHours(0, 0, 0, 0);
            }
            
            // Create label for the week (show start date)
            const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            weeklyArray.push({
                label: weekLabel,
                weekStart: new Date(weekStart),
                weekEnd: new Date(weekEnd),
                donations: 0,
                amount: 0,
                completed: 0,
                money: 0,
                goods: 0
            });
        }

        // Process donations if donation list is available
        if (donationList && donationList.length > 0) {
            donationList.forEach(donation => {
                // Handle both createdAt and timestamp fields (backend returns timestamp)
                const donationDateStr = donation.createdAt || donation.timestamp;
                if (donationDateStr) {
                    const donationDate = new Date(donationDateStr);
                    if (isNaN(donationDate.getTime())) {
                        // Invalid date, skip this donation
                        return;
                    }
                    donationDate.setHours(0, 0, 0, 0);
                    
                    // Find which week this donation belongs to
                    for (let i = 0; i < weeklyArray.length; i++) {
                        const weekData = weeklyArray[i];
                        if (donationDate >= weekData.weekStart && donationDate < weekData.weekEnd) {
                            weekData.donations += 1;
                            
                            // Calculate amount if money donation and track money vs goods
                            // Backend returns amount directly on donation object, or check type field
                            const donationType = donation.donation_type || donation.type || 'MONEY';
                            if (donationType === 'MONEY' || donationType === 'money') {
                                const amount = parseFloat(donation.amount) || 0;
                                weekData.amount += amount;
                                weekData.money += 1;
                            } else if (donationType === 'GOODS' || donationType === 'goods') {
                                weekData.goods += 1;
                            }
                            
                            if (donation.status === 'COMPLETED' || donation.status === 'completed') {
                                weekData.completed += 1;
                            }
                            break; // Found the week, no need to check others
                        }
                    }
                }
            });
        }

        return weeklyArray;
    }, [donationList]);

    // Prepare weekly line chart data
    const weeklyLineData = React.useMemo(() => {
        if (!weeklyData || weeklyData.length === 0) {
            // Return empty chart data structure with zero values for last 7 weeks
            const today = new Date();
            const labels = [];
            for (let i = 6; i >= 0; i--) {
                const weekDate = new Date(today);
                weekDate.setDate(today.getDate() - (i * 7));
                labels.push(weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
            return {
                labels,
                datasets: [
                    {
                        label: 'Total Donations',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Completed Donations',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Money Donations',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Goods Donations',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            };
        }

        return {
            labels: weeklyData.map(week => week.label),
            datasets: [
                {
                    label: 'Total Donations',
                    data: weeklyData.map(week => week.donations),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Completed Donations',
                    data: weeklyData.map(week => week.completed),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Money Donations',
                    data: weeklyData.map(week => week.money),
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Goods Donations',
                    data: weeklyData.map(week => week.goods),
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };
    }, [weeklyData]);

    // Line chart options
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatNumber(value);
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Weekly Line Chart - Full Width */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Trend of Donations</h3>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="h-96">
                    {weeklyLineData && <Line data={weeklyLineData} options={lineChartOptions} />}
                </div>
            </div>

            {/* Other Charts Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Improved Comparison Chart */}
                {comparisonData && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Statistics Overview</h3>
                                <p className="text-sm text-gray-500 mt-1">Comprehensive comparison of donation metrics</p>
                            </div>
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="h-80">
                            <Bar data={comparisonData} options={comparisonChartOptions} />
                        </div>
                        {/* Summary Stats Below Chart */}
                        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {dashboardStats ? formatCurrencyShort(dashboardStats.totalMoney || 0) : '₱0'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                                <p className="text-lg font-bold text-green-600">
                                    {donationStats ? `${((donationStats.completedDonations || 0) / ((donationStats.totalDonations || 0) || 1) * 100).toFixed(1)}%` : '0%'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Avg. Donation</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {donationStats ? formatCurrencyShort(donationStats.averageDonation || 0) : '₱0'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Active Donors</p>
                                <p className="text-lg font-bold text-orange-600">
                                    {formatNumber(donationStats?.activeDonors || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsCharts;

