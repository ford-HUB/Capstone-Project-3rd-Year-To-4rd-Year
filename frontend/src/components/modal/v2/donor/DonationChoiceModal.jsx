import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDonationEventsStore } from '../../../../store/donor/useDonationEventsStore'

const DonationChoiceModal = ({ isOpen, onClose, campaignId }) => {
  const navigate = useNavigate()
  const { events } = useDonationEventsStore()
  
  // Find the event to check which donation types are enabled
  const event = events.find(e => e.event_id === parseInt(campaignId))
  const hasFunds = event?.funds_donation || false
  const hasGoods = event?.goods_donation || false

  const handleMoneyDonation = () => {
    onClose()
    navigate(`/donor/donate?campaign=${campaignId}`)
  }

  const handleGoodsDonation = () => {
    onClose()
    navigate(`/donor/goods-donation?campaign=${campaignId}`)
  }

  if (!isOpen) return null
  
  // If only one type is enabled, this shouldn't happen (should redirect directly)
  // But as a safety check, if modal is shown with only one option, show only that option
  if (hasFunds && !hasGoods) {
    handleMoneyDonation()
    return null
  }
  
  if (hasGoods && !hasFunds) {
    handleGoodsDonation()
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Choose Donation Type</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">How would you like to support this campaign?</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Money Donation Option - Only show if funds donation is enabled */}
            {hasFunds && (
              <button
                onClick={handleMoneyDonation}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Donate Money
                    </h3>
                    <p className="text-sm text-gray-600">
                      Make a financial contribution to support the cause
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Goods Donation Option - Only show if goods donation is enabled */}
            {hasGoods && (
              <button
                onClick={handleGoodsDonation}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Donate Goods
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contribute physical items and see drop-off locations
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Both donation types help make a difference in our community
          </p>
        </div>
      </div>
    </div>
  )
}

export default DonationChoiceModal