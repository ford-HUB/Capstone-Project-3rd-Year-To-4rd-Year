import { Info, X, DollarSign, Package, HandCoins } from "lucide-react"

const GuideModal = ({ onClose }) => {
    return (
        <div className="absolute inset-0 bg-white rounded-lg p-6 z-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Info className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">Donation Guide</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                        <DollarSign className="text-blue-600 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">Monetary Donations</h3>
                            <p className="text-sm text-blue-700 mb-2">Direct financial contributions that provide maximum flexibility for the organization.</p>
                            <ul className="text-xs text-blue-600 space-y-1">
                                <li>• Instant impact and immediate use</li>
                                <li>• Can be allocated where needed most</li>
                                <li>• Easy to track and manage</li>
                                <li>• Tax-deductible receipts available</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start space-x-3">
                        <Package className="text-green-600 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-green-800 mb-2">Goods & Supplies</h3>
                            <p className="text-sm text-green-700 mb-2">Physical items and materials that directly support the cause or beneficiaries.</p>
                            <ul className="text-xs text-green-600 space-y-1">
                                <li>• Tangible items for immediate distribution</li>
                                <li>• Specific needs fulfillment</li>
                                <li>• Community engagement opportunities</li>
                                <li>• Perfect for donation drives</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start space-x-3">
                        <HandCoins className="text-amber-600 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-amber-800 mb-2">Pro Tip</h3>
                            <p className="text-sm text-amber-700">You can activate both options to maximize your impact and provide donors with flexible giving choices!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuideModal