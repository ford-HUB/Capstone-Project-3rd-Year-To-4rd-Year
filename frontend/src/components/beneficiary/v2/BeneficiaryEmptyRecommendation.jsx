import React from 'react';
import { MapPin, RefreshCw, Heart, AlertCircle } from 'lucide-react';

const BeneficiaryEmptyRecommendation = () => {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                        No Events Found
                    </h3>
                    <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed">
                        We could not see any applicable event that you might be almost near you or can travel to go. 
                        Check back later for new opportunities!
                    </p>
                </div>

                <div className="space-y-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh Location</span>
                    </button>
                    
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>Stay updated</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Check back soon</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryEmptyRecommendation;
