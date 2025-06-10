import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';
import { Search, Filter, Download, FileText, BarChart2, PieChart, LineChart, Calendar } from 'lucide-react';

const ManageReports = () => {
    // Temporary data for reports
    const reports = [
        {
            id: 1,
            title: "Monthly Event Participation",
            type: "Bar Chart",
            date: "May 2024",
            status: "completed",
            downloads: 45
        },
        {
            id: 2,
            title: "User Engagement Analysis",
            type: "Pie Chart",
            date: "April 2024",
            status: "completed",
            downloads: 32
        },
        {
            id: 3,
            title: "Yearly Growth Report",
            type: "Line Chart",
            date: "2024",
            status: "in progress",
            downloads: 28
        }
    ];

    return (
        <div className="p-6 bg-gray-50 pt-24 pl-12 h-screen">
            <div className="flex flex-col md:flex-row gap-4 h-full">
                <DirectorSidePanel />
                
                {/* Main Content */}
                <div className="flex-1 ml-12 h-full">
                    {/* Header Section - Now Sticky */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Manage Reports</h1>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                    <Filter className="w-5 h-5" />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-600 text-sm font-medium">Total Reports</p>
                                        <h3 className="text-2xl font-bold text-blue-900 mt-1">24</h3>
                                    </div>
                                    <FileText className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-600 text-sm font-medium">Active Reports</p>
                                        <h3 className="text-2xl font-bold text-purple-900 mt-1">18</h3>
                                    </div>
                                    <BarChart2 className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                            <div className="bg-green-50 p-6 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-600 text-sm font-medium">Total Downloads</p>
                                        <h3 className="text-2xl font-bold text-green-900 mt-1">156</h3>
                                    </div>
                                    <Download className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reports List - Now Scrollable */}
                    <div className="mt-6 space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {report.date}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                {report.downloads} downloads
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            report.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {report.status}
                                        </span>
                                        <button className="p-2 hover:bg-gray-200 rounded-lg">
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    {report.type === 'Bar Chart' && <BarChart2 className="w-5 h-5 text-blue-600" />}
                                    {report.type === 'Pie Chart' && <PieChart className="w-5 h-5 text-purple-600" />}
                                    {report.type === 'Line Chart' && <LineChart className="w-5 h-5 text-green-600" />}
                                    <span className="text-sm text-gray-600">{report.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageReports; 