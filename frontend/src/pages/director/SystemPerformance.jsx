import React from 'react';
import { useSystemPerformanceStore } from '../../store/director/useSystemPerformanceStore.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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

// Import modular components
import PageHeader from '../../components/director/systemPerformance/PageHeader';
import MetricsGrid from '../../components/director/systemPerformance/MetricsGrid';
import TimeRangeSelector from '../../components/director/systemPerformance/TimeRangeSelector';
import ChartsGrid from '../../components/director/systemPerformance/ChartsGrid';
import DetailedMetrics from '../../components/director/systemPerformance/DetailedMetrics';

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

const SystemPerformance = () => {
    const { 
        metrics, 
        history, 
        isLoading, 
        lastUpdated, 
        getMetrics, 
        getHistory, 
        refreshAll 
    } = useSystemPerformanceStore();

    const [selectedTimeRange, setSelectedTimeRange] = React.useState(24);
    const [autoRefresh, setAutoRefresh] = React.useState(true);

    // Auto-refresh every 30 seconds
    React.useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                refreshAll();
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshAll]);

    // Initial data load
    React.useEffect(() => {
        refreshAll();
    }, []);

    // Handle time range change
    const handleTimeRangeChange = async (hours) => {
        setSelectedTimeRange(hours);
        await getHistory(hours);
    };

    // Debug logging to see actual data
    React.useEffect(() => {
        if (metrics) {
            console.log('System Performance Metrics:', metrics);
        }
        if (history) {
            console.log('System Performance History:', history);
            console.log('Active Users Data:', history.data?.activeUsers);
        }
    }, [metrics, history]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <PageHeader
                title="System Performance"
                subtitle="Real-time system metrics and performance monitoring"
                onRefresh={refreshAll}
                isLoading={isLoading}
                autoRefresh={autoRefresh}
                onAutoRefreshChange={setAutoRefresh}
                lastUpdated={lastUpdated}
            />

            <MetricsGrid metrics={metrics} />

            <TimeRangeSelector
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
            />

            <ChartsGrid history={history} metrics={metrics} />

            <DetailedMetrics metrics={metrics} />
        </div>
    );
};

export default SystemPerformance;
