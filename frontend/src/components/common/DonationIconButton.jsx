import React from 'react'
import { PackageOpen } from 'lucide-react'
import DonationOptionModal from '../modal/DonationOptionModal'
import { useDonationStore } from '../../store/donation/useDonationStore.js'
import { useEventStore } from '../../store/event/useEventStore.js'

const DonationIconButton = ({ event }) => {
  const { enableOrDisableFundsEventDonation, enableOrDisableGoodsEventDonation } = useDonationStore()
  const [ showDonationOptionModal, setShowDonationOptionModal ] = React.useState(false)

  const handleDonationOption = async ({ funds, goods }) => {
    await enableOrDisableFundsEventDonation(event.id, { funds: funds })
    await enableOrDisableGoodsEventDonation(event.id, { goods: goods })
    setShowDonationOptionModal(false)
  };

  return (
    <>
    <button onClick={() => setShowDonationOptionModal(true)}
    className='cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
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