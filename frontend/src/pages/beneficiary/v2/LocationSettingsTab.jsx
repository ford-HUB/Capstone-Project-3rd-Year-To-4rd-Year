import React, { useState } from 'react';
import { MapPin, Save, RefreshCw } from 'lucide-react';

const LocationSettingsTab = () => {
    const [locationEnabled, setLocationEnabled] = useState(true);
    const [currentLocation, setCurrentLocation] = useState('Detecting...');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLocationUpdate = async () => {
        setIsUpdating(true);
        // Simulate location update
        setTimeout(() => {
            setCurrentLocation('Cebu City, Philippines');
            setIsUpdating(false);
        }, 2000);
    };

    const handleSaveSettings = () => {
        // Save location settings
        console.log('Saving location settings...');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
                <MapPin className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Location Settings</h2>
            </div>

            <div className="space-y-6">
                {/* Location Services Toggle */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800">Location Services</h3>
                            <p className="text-sm text-gray-600">Enable location services to find events and assistance near you</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={locationEnabled}
                                onChange={(e) => setLocationEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>

                {/* Current Location */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Current Location</h3>
                        <button
                            onClick={handleLocationUpdate}
                            disabled={isUpdating}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                            <span>{isUpdating ? 'Updating...' : 'Update Location'}</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>{currentLocation}</span>
                    </div>
                </div>

                {/* Location Preferences */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Location Preferences</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Radius (km)
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="5">5 km</option>
                                <option value="10" selected>10 km</option>
                                <option value="15">15 km</option>
                                <option value="25">25 km</option>
                                <option value="50">50 km</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Areas
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                                    <span className="ml-2 text-sm text-gray-700">Near my current location</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="ml-2 text-sm text-gray-700">City center</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <span className="ml-2 text-sm text-gray-700">Suburban areas</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSaveSettings}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationSettingsTab;


