import React, { useEffect } from 'react';
import { Loader2, User, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useActivityLogStore } from '../../store/beneficiary/useActivityLogStore';

const MyLogs = () => {
    const { 
        logs, 
        isLoading, 
        getMyActivityLogs 
    } = useActivityLogStore();

    useEffect(() => {
        getMyActivityLogs();
    }, [getMyActivityLogs]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return { date: dateStr, time: timeStr };
    };

    const getEventIcon = (iconName) => {
        const iconMap = {
            'trash': Trash2,
            'user': User,
            'check': CheckCircle,
            'key': Clock,
            'edit': User,
            'activity': AlertCircle
        };
        return iconMap[iconName] || AlertCircle;
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'success': 'bg-green-500',
            'failure': 'bg-red-500',
            'info': 'bg-blue-500'
        };
        return colorMap[status] || 'bg-gray-500';
    };

    const getStatusIcon = (status) => {
        if (status === 'success') return CheckCircle;
        if (status === 'failure') return XCircle;
        return AlertCircle;
    };

    return (
        <div className="p-6 h-screen bg-gray-50 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Activity Logs</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Track your account activities and system interactions
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-20">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Activity Logs</h3>
                            <p className="text-gray-600">Your activity logs will appear here once you start using the system.</p>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            <div className="space-y-8">
                                {logs.map((logGroup, groupIndex) => {
                                    const { date, time } = formatDateTime(logGroup.mainEvent.timestamp);
                                    const IconComponent = getEventIcon(logGroup.mainEvent.icon);
                                    const StatusIcon = getStatusIcon(logGroup.mainEvent.status);
                                    const statusColor = getStatusColor(logGroup.mainEvent.status);

                                    return (
                                        <div key={groupIndex} className="relative pl-20">
                                            <div className="absolute left-6 top-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full z-10 flex items-center justify-center">
                                                <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
                                            </div>

                                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-lg ${
                                                        logGroup.mainEvent.status === 'success' ? 'bg-green-100' :
                                                        logGroup.mainEvent.status === 'failure' ? 'bg-red-100' :
                                                        'bg-blue-100'
                                                    }`}>
                                                        <IconComponent className={`w-5 h-5 ${
                                                            logGroup.mainEvent.status === 'success' ? 'text-green-600' :
                                                            logGroup.mainEvent.status === 'failure' ? 'text-red-600' :
                                                            'text-blue-600'
                                                        }`} />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className={`font-semibold ${logGroup.mainEvent.action?.toLowerCase() === 'delete' ? 'text-red-600' : 'text-gray-900'}`}>
                                                                {logGroup.mainEvent.module.charAt(0).toUpperCase() + logGroup.mainEvent.module.slice(1)} - {logGroup.mainEvent.action.charAt(0).toUpperCase() + logGroup.mainEvent.action.slice(1)}
                                                            </h3>
                                                            <div className="text-right">
                                                                <div className="text-sm font-medium text-gray-900">{date}</div>
                                                                <div className="text-xs text-gray-500">{time}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                                logGroup.mainEvent.status === 'success' ? 'text-green-500' :
                                                                logGroup.mainEvent.status === 'failure' ? 'text-red-500' :
                                                                'text-blue-500'
                                                            }`} />
                                                            <p className="text-sm text-gray-600">{logGroup.mainEvent.description}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {logGroup.subEvents && logGroup.subEvents.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                                        {logGroup.subEvents.map((subEvent, subIndex) => {
                                                            const subStatusColor = getStatusColor(subEvent.status);
                                                            const SubStatusIcon = getStatusIcon(subEvent.status);
                                                            const subDateTime = formatDateTime(subEvent.timestamp);

                                                            return (
                                                                <div key={subIndex} className="flex items-start gap-3 pl-4">
                                                                    <div className={`w-1 h-full min-h-[40px] ${subStatusColor} rounded-full`}></div>
                                                                    
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <SubStatusIcon className={`w-4 h-4 ${
                                                                                subEvent.status === 'success' ? 'text-green-500' :
                                                                                subEvent.status === 'failure' ? 'text-red-500' :
                                                                                'text-blue-500'
                                                                            }`} />
                                                                            <p className="text-sm text-gray-700">{subEvent.description}</p>
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 ml-6">
                                                                            {subDateTime.date} {subDateTime.time}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyLogs;

