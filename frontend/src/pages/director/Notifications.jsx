import React from 'react'
import { Bell } from 'lucide-react'

const Notifications = () => {
    return (
        <div className="flex h-screen bg-gray-50 pt-2 pl-16">
            <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No Notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You don't have any notifications at the moment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications 