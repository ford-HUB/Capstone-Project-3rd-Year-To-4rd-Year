import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDonationStore } from '../../store/donation/useDonationStore.js';

const DonationCancelled = () => {
  const [status, setStatus] = useState('loading'); // loading, verified, error
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPaymentCancellation } = useDonationStore();

  useEffect(() => {
    const verifyCancellation = async () => {
      try {
        // Get donation ID from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const donationId = urlParams.get('donation_id');
        
        if (!donationId) {
          setStatus('error');
          return;
        }

        // Use store to verify payment cancellation
        const response = await verifyPaymentCancellation(donationId);
        
        if (response.success) {
          if (response.isCancelled || response.paymentStatus === 'CANCELLED') {
            setStatus('verified');
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
      }
    };

    // Start verification after a short delay to show loading state
    const timer = setTimeout(verifyCancellation, 1000);
    return () => clearTimeout(timer);
  }, [location.search, navigate, verifyPaymentCancellation]);

  // Auto-navigate to dashboard after 3 seconds on success
  useEffect(() => {
    if (status === 'verified') {
      const timer = setTimeout(() => {
        navigate('/donor/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold text-blue-600">⏳ Verifying cancellation...</h1>
        <p className="mt-3 text-gray-700">
          Please wait while we confirm your payment cancellation.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold text-red-600">❌ Verification Error</h1>
        <p className="mt-3 text-gray-700">
          Unable to verify payment status. Redirecting to dashboard...
        </p>
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold text-orange-600">🚫 Payment Cancelled</h1>
        <p className="mt-3 text-gray-700">
          Your payment has been successfully cancelled. No charges were made.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    );
  }

  return null;
};

export default DonationCancelled;
