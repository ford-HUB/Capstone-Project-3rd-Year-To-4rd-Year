import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentStatusModal from '../../components/modal/PaymentStatusModal.jsx';
import { usePaymentStore } from '../../store/director/usePaymentStore.js';
import { useProfileStore } from '../../store/director/useProfileStore.js';

const PaymentStatus = () => {
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const { getPaymentMethods } = usePaymentStore();
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    // Get payment status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success' || paymentStatus === 'cancelled') {
      setStatus(paymentStatus);
      setShowModal(true);
      
      // Refresh payment data if successful
      if (paymentStatus === 'success') {
        getPaymentMethods();
        currentProfile();
      }
    } else {
      // If no status parameter, redirect to profile
      navigate('/director/profile');
    }
  }, [navigate, getPaymentMethods, currentProfile]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/director/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {showModal && (
        <PaymentStatusModal 
          status={status} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PaymentStatus;
