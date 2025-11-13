import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiInstance } from "../../api/_base.js";

export default function DonationSuccess() {
  const [status, setStatus] = useState("loading");
  const [donation, setDonation] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const donationId = searchParams.get("donation_id");

  useEffect(() => {
    async function checkStatus() {
      try {
        console.log('Fetching donation with ID:', donationId);
        console.log('API URL:', `/api/donation/${donationId}`);
        
        const response = await apiInstance.get(`/api/donation/${donationId}`);
        console.log('Response status:', response.status);
        
        const data = response.data;
        console.log('Response data:', data);
        
        if (data.success) {
          setDonation(data.data);
          
          // Check both donation status and payment status
          const donationStatus = data.data.status;
          const payments = data.data.Payments || [];
          const hasPaidPayment = payments.some(payment => payment.payment_status === 'PAID');
          
          console.log('Donation status:', donationStatus);
          console.log('Payments:', payments);
          console.log('Has paid payment:', hasPaidPayment);
          
          // Determine overall status
          if (hasPaidPayment || donationStatus === 'RECEIVED' || donationStatus === 'DELIVERED' || donationStatus === 'COMPLETED') {
            console.log('Setting status to RECEIVED');
            setStatus('RECEIVED');
          } else if (donationStatus === 'PENDING') {
            console.log('Setting status to PENDING');
            setStatus('PENDING');
          } else {
            console.log('Setting status to:', donationStatus);
            setStatus(donationStatus);
          }
        } else {
          console.log('API returned success: false');
          setStatus("error");
        }
      } catch (err) {
        console.log('Fetch error:', err);
        setStatus("error");
      }
    }

    if (donationId) checkStatus();
  }, [donationId]);

  // Auto-navigate to dashboard after 3 seconds on success
  useEffect(() => {
    if (status === "RECEIVED" || status === "DELIVERED" || status === "COMPLETED") {
      const timer = setTimeout(() => {
        navigate('/donor/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  if (status === "loading") return <p>Verifying your payment...</p>;
  if (status === "error") return <p>❌ Unable to verify your donation.</p>;
  if (status === "RECEIVED" || status === "DELIVERED" || status === "COMPLETED")
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold text-green-600">🎉 Thank you for your donation!</h1>
        <p className="mt-3 text-gray-700">
          Your payment has been confirmed. We appreciate your support.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    );

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-semibold text-yellow-500">⏳ Payment Pending</h1>
      <p className="mt-3 text-gray-700">
        We're waiting for confirmation from PayMongo. You'll receive an update soon.
      </p>
    </div>
  );
}
