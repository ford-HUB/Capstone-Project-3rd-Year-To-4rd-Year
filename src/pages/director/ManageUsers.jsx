import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';
import { Search, Filter, UserPlus, MoreVertical, Mail, Phone, Shield } from 'lucide-react';

const ManageUsers = () => {
    // Temporary data for users
    const users = [
        {
            id: 1,
            name: "John Doe",
            role: "Coordinator",
            email: "john.doe@example.com",
            phone: "+1234567890",
            status: "active",
            department: "Community Service"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Participant",
            email: "jane.smith@example.com",
            phone: "+1234567891",
            status: "active",
            department: "Student Affairs"
        },
        {
            id: 3,
            name: "Mike Johnson",
            role: "Coordinator",
            email: "mike.johnson@example.com",
            phone: "+1234567892",
            status: "inactive",
            department: "Events"
        }
    ];

    return (
        <div className="p-6 bg-gray-50 pt-24 pl-12">
            <div className="flex flex-col md:flex-row gap-4">
                <DirectorSidePanel />
                
                {/* Main Content */}
                <div className="flex-1 ml-12">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                    <Filter className="w-5 h-5" />
                                    Filter
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                    <UserPlus className="w-5 h-5" />
                                    Add User
                                </button>
                            </div>
                        </div>

                        {/* Users List */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-200">
                                        <th className="pb-3 font-semibold text-gray-600">Name</th>
                                        <th className="pb-3 font-semibold text-gray-600">Role</th>
                                        <th className="pb-3 font-semibold text-gray-600">Contact</th>
                                        <th className="pb-3 font-semibold text-gray-600">Department</th>
                                        <th className="pb-3 font-semibold text-gray-600">Status</th>
                                        <th className="pb-3 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    user.role === 'Coordinator' 
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-600">{user.department}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <Shield className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <MoreVertical className="w-5 h-5 text-gray-600" />
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

export default ManageUsers; 