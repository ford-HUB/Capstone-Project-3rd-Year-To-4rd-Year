import { HandCoins, X } from "lucide-react"

const ModalHeader = ({ onClose }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                    <HandCoins className="text-blue-600" size={20} />
                </div>
                <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Donation Options</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Configure available donation types</p>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    )
}

export default ModalHeader