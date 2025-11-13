import React from 'react';
import { MapPin, Navigation, Heart, Users, TrendingUp, Clock } from 'lucide-react';

const BeneficiaryLocationStats = ({ 
    nearYouCount = 0, 
    almostNearYouCount = 0, 
    recommendationsCount = 0,
    beneficiaryCity = 'Your City'
}) => {
    const totalEvents = nearYouCount + almostNearYouCount + recommendationsCount;

    const stats = [
        {
            label: 'Near You',
            value: nearYouCount,
            icon: MapPin,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            description: 'Same city events'
        },
        {
            label: 'Recommendations',
            value: almostNearYouCount + recommendationsCount,
            icon: Heart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            description: 'Nearby cities & other options'
        }
    ];

    const getLocationStatus = () => {
        if (nearYouCount > 0) {
            return {
                status: 'Great!',
                message: `You have ${nearYouCount} event${nearYouCount > 1 ? 's' : ''} in your city`,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200'
            };
        } else if (recommendationsCount > 0) {
            return {
                status: 'Available',
                message: `You have ${recommendationsCount} other event${recommendationsCount > 1 ? 's' : ''} available`,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200'
            };
        } else {
            return {
                status: 'No Events',
                message: 'No events available at the moment',
                color: 'text-gray-600',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200'
            };
        }
    };

    const locationStatus = getLocationStatus();

    return (
        <div className="space-y-4">
            {/* Location Header */}
            <div className={`p-3 rounded-lg border ${locationStatus.bgColor} ${locationStatus.borderColor}`}>
                <div className="flex items-center space-x-2 mb-2">
                    <MapPin className={`w-4 h-4 ${locationStatus.color}`} />
                    <span className={`text-sm font-medium ${locationStatus.color}`}>
                        {locationStatus.status}
                    </span>
                </div>
                <p className="text-xs text-gray-600">
                    {locationStatus.message}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                    Location: <span className="font-medium">{beneficiaryCity}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-3">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border ${stat.bgColor} ${stat.borderColor} transition-all duration-200 hover:shadow-sm`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                                    <span className={`text-sm font-medium ${stat.color}`}>
                                        {stat.label}
                                    </span>
                                </div>
                                <span className={`text-lg font-bold ${stat.color}`}>
                                    {stat.value}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                            Total Events
                        </span>
                    </div>
                    <span className="text-xl font-bold text-green-600">
                        {totalEvents}
                    </span>
                </div>
                <p className="text-xs text-green-600">
                    Events available for assistance
                </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                        Quick Tips
                    </span>
                </div>
                <ul className="text-xs text-blue-600 space-y-1">
                    <li>• "Near You" events are in your city</li>
                    <li>• "Recommendations" include nearby cities & other options</li>
                    <li>• Register early for popular events</li>
                </ul>
            </div>
        </div>
    );
};

export default BeneficiaryLocationStats;
