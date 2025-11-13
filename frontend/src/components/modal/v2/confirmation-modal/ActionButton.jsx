

const ActionButtons = ({ onCancel, onConfirm, config, colors, disabled, loading }) => {
    return (
        <div className="flex gap-3 pt-4">
            <button 
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
                {config.cancelText || 'Cancel'}
            </button>
            
            <button
                onClick={onConfirm}
                disabled={disabled || loading}
                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colors.button}`}
            >
                {loading ? '...' : config.action}
            </button>
        </div>
    )
    
}

export default ActionButtons