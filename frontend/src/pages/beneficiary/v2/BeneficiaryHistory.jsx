import React from 'react';
import { Clock, Calendar, MapPin, User, Award } from 'lucide-react';

const BeneficiaryHistory = () => {
    // This would be populated with actual history data
    const historyRecords = [
        {
            id: 1,
            type: 'Event Registration',
            eventName: 'Community Health Fair',
            date: '2024-01-20',
            status: 'Attended',
            location: 'City Health Center',
            description: 'Attended health screening and received free medical consultation'
        },
        {
            id: 2,
            type: 'Assistance Request',
            eventName: 'Food Distribution Program',
            date: '2024-01-15',
            status: 'Completed',
            location: 'Community Center',
            description: 'Received food package for family'
        },
        {
            id: 3,
            type: 'Event Registration',
            eventName: 'Educational Workshop',
            date: '2024-01-10',
            status: 'Registered',
            location: 'Public Library',
            description: 'Registered for skills development workshop'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
            case 'Attended':
                return 'bg-green-100 text-green-800';
            case 'Registered':
                return 'bg-blue-100 text-blue-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Event Registration':
                return <Calendar className="w-5 h-5" />;
            case 'Assistance Request':
                return <Award className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Clock className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Assistance History</h2>
            </div>

            {historyRecords.length > 0 ? (
                <div className="space-y-4">
                    {historyRecords.map((record) => (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        {getTypeIcon(record.type)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-lg font-medium text-gray-800">{record.eventName}</h3>
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{record.type}</p>
                                            <p className="text-gray-600 mb-3">{record.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{record.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No History Records</h3>
                    <p className="text-gray-400">Your assistance history will appear here once you start participating in events.</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Assistance Received</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600 mt-1">2</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Events Attended</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mt-1">1</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Total Interactions</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mt-1">3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryHistory;


