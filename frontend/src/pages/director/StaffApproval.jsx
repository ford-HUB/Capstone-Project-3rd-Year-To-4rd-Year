import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidebarPanel';
import { Search, Filter, UserPlus, Check, X, Mail, Phone, Building } from 'lucide-react';

const StaffApproval = () => {
    // Temporary data for pending staff registrations
    const pendingRegistrations = [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            requestDate: "May 28, 2024",
            status: "pending"
        },
        {
            id: 2,
            name: "Michael Brown",
            email: "michael.brown@example.com",
            requestDate: "May 27, 2024",
            status: "pending"
        },
        {
            id: 3,
            name: "Emily Davis",
            email: "emily.davis@example.com",
            requestDate: "May 26, 2024",
            status: "pending"
        }
    ];

    return (
        <div className="p-6 bg-gray-50 pt-24 pl-12">
            <div className="flex flex-col md:flex-row gap-4">                
                {/* Main Content */}
                <div className="flex-1 ml-12">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-8 h-8 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-800">Staff Registration Approval</h1>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search registrations..."
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

                        {/* Registrations Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingRegistrations.map((registration) => (
                                        <tr key={registration.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">
                                                            {registration.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {registration.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{registration.requestDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <button className="text-green-600 hover:text-green-900 flex items-center gap-1">
                                                        <Check className="w-5 h-5" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900 flex items-center gap-1">
                                                        <X className="w-5 h-5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffApproval; 