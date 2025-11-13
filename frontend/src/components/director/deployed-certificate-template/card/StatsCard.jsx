import { Icon } from "lucide-react";

const StatsCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
            <div className={`p-2 ${colorClass} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', '').replace('-100', '-600')}`} />
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);