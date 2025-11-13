import { CheckCircle } from "lucide-react"

const ToggleSwitch = ({ checked, onChange, label, icon: Icon, description }) => {
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${checked ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{label}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                    </div>
                </div>
                
                {/* Custom Toggle Switch */}
                <div 
                    onClick={onChange}
                    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 ${
                        checked ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                >
                    <div 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 mt-1 ${
                            checked ? 'translate-x-6' : 'translate-x-1'
                        }`} 
                    />
                </div>
            </div>
            
            {checked && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle size={16} />
                    <span>Active</span>
                </div>
            )}
        </div>
    )
}

export default ToggleSwitch