import React from 'react';
import DonationModal from '../modal/DonationModal';
import { useDonationStore } from '../../store/donation/useDonationStore.js';

const ToggleActivationDonationButton = ({ event }) => {
    const { enableEventDonation, disableEventDonation } = useDonationStore()
    const [isDonationActive, setDonationActive] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState('')

    const handleToggle = (e) => {
        const isChecked = e.target.checked;

        setPendingAction(isChecked ? 'open' : 'close');
        setShowModal(true);
    };

    const handleDonationConfirmation = async(confirmed) => {
        if (confirmed) {
            console.log(event.id)
            const success = await enableEventDonation(event.id)
            if(!success) return
            setDonationActive(pendingAction === 'open'); 
            setPendingAction('');
            setShowModal(false);
        }else {
            const success = await disableEventDonation(event.id)
            if(!success) return
            setPendingAction('');
            setShowModal(false);
        }
    };

  return (
    <>
      <label className="label text-[10px]">
        <input
          type="checkbox"
          checked={isDonationActive}
          onChange={handleToggle}
          className="toggle w-5 h-1"
        />
        Activate <br /> Donation <br /> goods <br /> funds
      </label>

      <DonationModal
        selectedEvent={event?.title}
        open={showModal}
        setOpen={() => {
          setShowModal(false);
          setPendingAction('');
        }}
        action={pendingAction}
        onConfirm={(confirmed) => handleDonationConfirmation(confirmed)}
      />
    </>
  );
};

export default ToggleActivationDonationButton;
