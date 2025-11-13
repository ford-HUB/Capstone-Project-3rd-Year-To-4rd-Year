

const StatusIndicator = ({ checkedFunds, checkedGoods }) => {
    return (
        <div className="mb-4 p-2.5 sm:p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Active Options:</span>
                <div className="flex items-center space-x-2">
                    {!checkedFunds && !checkedGoods && (
                        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 sm:py-1 rounded-full">
                            No options selected
                        </span>
                    )}
                    {(checkedFunds || checkedGoods) && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 sm:py-1 rounded-full">
                            {checkedFunds && checkedGoods ? 'Both' : checkedFunds ? 'Funds Only' : 'Goods Only'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StatusIndicator