import React from 'react';
import { DollarSign, Users, Heart, TrendingUp } from 'lucide-react';

const DonationTrackingEmptyState = () => {
    return (
        <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-12 h-12 text-gray-400" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Donations Yet
            </h3>
            
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Donations will appear here once donors start contributing to your events. 
                Share your events to encourage donations!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Share Events</h4>
                    <p className="text-sm text-gray-500">
                        Promote your events to attract more donors
                    </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                        <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Engage Community</h4>
                    <p className="text-sm text-gray-500">
                        Build relationships with potential donors
                    </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Track Progress</h4>
                    <p className="text-sm text-gray-500">
                        Monitor donation trends and impact
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DonationTrackingEmptyState;
