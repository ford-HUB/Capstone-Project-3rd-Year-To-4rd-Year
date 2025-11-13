import React from 'react'
import { PackageOpen } from 'lucide-react'
import DonationOptionModal from '../modal/v2/donation-option/DonationOptionModal.jsx'
import { useDonationStore } from '../../store/donation/useDonationStore.js'
import { useEventStore } from '../../store/event/useEventStore.js'

const DonationIconButton = ({ event, onUpdate, onModalOpen }) => {
  const { enableOrDisableFundsEventDonation, enableOrDisableGoodsEventDonation } = useDonationStore()
  const [ showDonationOptionModal, setShowDonationOptionModal ] = React.useState(false)

  const handleDonationOption = async ({ funds, goods, goodsTypes }) => {
    const eventId = event.id || event.event_id;
    if (!eventId) {
      console.error('Event ID is missing');
      return;
    }
    await enableOrDisableFundsEventDonation(eventId, { funds: funds })
    await enableOrDisableGoodsEventDonation(eventId, { goods: goods, goodsTypes: goodsTypes || [] })
    setShowDonationOptionModal(false)
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Donation button clicked, opening modal', { eventId: event.id || event.event_id, event });
    setShowDonationOptionModal(true);
    if (onModalOpen) {
      onModalOpen();
    }
  };

  React.useEffect(() => {
    console.log('DonationIconButton - Modal state:', showDonationOptionModal, 'Event:', event);
    if (showDonationOptionModal) {
      console.log('Modal should be visible now', { 
        eventId: event.id || event.event_id,
        hasEvent: !!event,
        eventStructure: Object.keys(event || {})
      });
    }
  }, [showDonationOptionModal, event]);

  return (
    <>
    <button 
      onClick={handleClick}
      className='cursor-pointer hover:bg-gray-100 p-2 rounded-md'
      type="button"
    >
        <PackageOpen className='h-5 w-5 text-gray-600'/>
    </button>

    <DonationOptionModal
      event={event}
      open={showDonationOptionModal}
      setOpen={setShowDonationOptionModal}
      onConfirm={handleDonationOption}
    />
    </>
  )
}

export default DonationIconButton