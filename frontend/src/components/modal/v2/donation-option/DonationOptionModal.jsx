import React from 'react'
import { DollarSign, Package } from 'lucide-react'
import ModalHeader from './header/ModalHeader'
import QuickActions from './action/QuickAction'
import ToggleSwitch from '../../../common/ToggleSwitch'
import StatusIndicator from './status/StatusIndicator'
import ActionButtons from './action/ActionButton' 
import GuideModal from './guide/GuideModal'
import { ALL_GOODS_TYPES } from '../../../../constants/goodsTypes.js'
import { useDonationStore } from '../../../../store/donation/useDonationStore.js'


// Main DonationOptionModal Component - Using your exact function signature
function DonationOptionModal({ event, open, setOpen, onConfirm }) {
    const { getEventGoodsTypes } = useDonationStore()
    const [checkedFunds, setCheckedFunds] = React.useState(false)
    const [checkedGoods, setCheckedGoods] = React.useState(false)
    const [selectedGoodsTypes, setSelectedGoodsTypes] = React.useState([])
    const [showGuide, setShowGuide] = React.useState(false)

    const handleSelectAll = () => {
        const shouldCheckAll = !(checkedFunds && checkedGoods)
        setCheckedFunds(shouldCheckAll)
        setCheckedGoods(shouldCheckAll)
    }

    // Fetch existing goods types when modal opens and goods is enabled
    React.useEffect(() => {
        if(open && event) {
            setCheckedFunds(event.funds || false)
            setCheckedGoods(event.goods || false)
            
            // Fetch existing goods types if goods is enabled
            if (event.goods && event.id) {
                getEventGoodsTypes(event.id).then(result => {
                    if (result.success && result.data && Array.isArray(result.data)) {
                        // Set the fetched goods types as selected
                        setSelectedGoodsTypes(result.data)
                    } else {
                        // If no goods types found, initialize as empty
                        setSelectedGoodsTypes([])
                    }
                }).catch(error => {
                    console.error('Error fetching goods types:', error)
                    setSelectedGoodsTypes([])
                })
            } else {
                // If goods is not enabled, clear selection
                setSelectedGoodsTypes([])
            }
        } else if (!open) {
            // Reset when modal closes
            setSelectedGoodsTypes([])
            setCheckedFunds(false)
            setCheckedGoods(false)
        }
    }, [open, event, getEventGoodsTypes])

    const handleGoodsTypeToggle = (goodsTypeId) => {
        setSelectedGoodsTypes(prev => {
            if (prev.includes(goodsTypeId)) {
                return prev.filter(id => id !== goodsTypeId)
            } else {
                return [...prev, goodsTypeId]
            }
        })
    }

    console.log('DonationOptionModal render:', { open, event, hasEvent: !!event, eventId: event?.id || event?.event_id });

    if(!open) {
        console.log('DonationOptionModal: not open, returning null');
        return null;
    }

    const hasSelection = checkedFunds || checkedGoods
    const allSelected = checkedFunds && checkedGoods

    console.log('DonationOptionModal: rendering modal');

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-2 sm:p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
                setOpen(false);
            }
        }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-2 sm:mx-4 relative overflow-hidden max-h-[95vh] flex flex-col">
                {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
                
                <div className="p-4 sm:p-5 overflow-y-auto flex-1">
                    <ModalHeader onClose={() => setOpen(false)} />

                    <QuickActions 
                        onShowGuide={() => setShowGuide(true)}
                        onSelectAll={handleSelectAll}
                        allSelected={allSelected}
                    />

                    {/* Donation Options */}
                    <div className="space-y-3 mb-4">
                        <ToggleSwitch
                            checked={checkedFunds}
                            onChange={() => setCheckedFunds(!checkedFunds)}
                            label="Monetary Donations"
                            icon={DollarSign}
                            description="Accept cash, bank transfers, and online payments"
                        />
                        
                        <div>
                            <ToggleSwitch
                                checked={checkedGoods}
                                onChange={() => {
                                    setCheckedGoods(!checkedGoods)
                                    if (!checkedGoods) {
                                        // When enabling, select all goods types by default
                                        setSelectedGoodsTypes(ALL_GOODS_TYPES.map(gt => gt.id))
                                    } else {
                                        // When disabling, clear selection
                                        setSelectedGoodsTypes([])
                                    }
                                }}
                                label="Goods & Supplies"
                                icon={Package}
                                description="Accept physical items and materials"
                            />
                            
                            {/* Goods Type Selection - Only show when goods is enabled */}
                            {checkedGoods && (
                                <div className="mt-3 ml-10 sm:ml-12 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Goods Types Needed *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1">
                                        {ALL_GOODS_TYPES.map((goodsType) => {
                                            const Icon = goodsType.icon
                                            const isSelected = selectedGoodsTypes.includes(goodsType.id)
                                            return (
                                                <label
                                                    key={goodsType.id}
                                                    className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-md cursor-pointer border-2 transition-all ${
                                                        isSelected
                                                            ? `${goodsType.borderColor} ${goodsType.bgColor}`
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleGoodsTypeToggle(goodsType.id)}
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 flex-shrink-0"
                                                    />
                                                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${goodsType.color} flex-shrink-0`} />
                                                    <span className="text-xs font-medium text-gray-700 truncate">{goodsType.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                    {checkedGoods && selectedGoodsTypes.length === 0 && (
                                        <p className="text-red-500 text-xs mt-2">Please select at least one goods type</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <StatusIndicator 
                        checkedFunds={checkedFunds} 
                        checkedGoods={checkedGoods} 
                    />

                    <ActionButtons 
                        onCancel={() => setOpen(false)}
                        onConfirm={() => {
                            if (checkedGoods && selectedGoodsTypes.length === 0) {
                                return // Don't submit if goods is enabled but no types selected
                            }
                            onConfirm({ 
                                funds: checkedFunds, 
                                goods: checkedGoods,
                                goodsTypes: checkedGoods ? selectedGoodsTypes : []
                            })
                        }}
                        hasSelection={hasSelection && (checkedGoods ? selectedGoodsTypes.length > 0 : true)}
                    />
                </div>
            </div>
        </div>
    )
}

export default DonationOptionModal