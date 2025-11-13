import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import DonationHeader from '../../components/donor/donation/DonationHeader';
import StepProgress from '../../components/donor/donation/StepProgress';
import StepNavigation from '../../components/donor/donation/StepNavigation';
import AmountStep from '../../components/donor/donation/steps/AmountStep';
import PaymentStep from '../../components/donor/donation/steps/PaymentStep';
import PreferencesStep from '../../components/donor/donation/steps/PreferencesStep';
import { processDonationPayment, handlePaymentSuccess, getAvailablePaymentMethods } from '../../services/donation/donationService';
import { useDonorAuthStore } from '../../store/donor/useDonorAuthStore';
import toast from 'react-hot-toast';

const DonationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get campaign ID from URL query parameter or state
  const urlParams = new URLSearchParams(location.search);
  const campaignId = urlParams.get('campaign') || location.state?.campaignId || 1;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    gcashNumber: '',
    paymayaNumber: '',
    bankAccount: '',
    bankName: '',
    isAnonymous: false,
    showReceipt: true
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  // Fetch available payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoadingPaymentMethods(true);
        const response = await getAvailablePaymentMethods();
        
        if (response.success) {
          setPaymentMethods(response.paymentMethods);
          setPaymentAccounts(response.paymentAccounts);
        } else {
          toast.error('Failed to load payment methods');
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Handle payment success callback
  useEffect(() => {
    const handlePaymentSuccessCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const checkout_session_id = urlParams.get('checkout_session_id');
      
      if (checkout_session_id) {
        try {
          toast.loading('Confirming your payment...', { id: 'payment-confirmation' });
          
          const response = await handlePaymentSuccess({
            checkout_session_id
          });
          
          if (response.success) {
            toast.dismiss('payment-confirmation');
            toast.success('Payment confirmed! Thank you for your donation.');
            navigate('/donor/dashboard');
          } else {
            throw new Error(response.message || 'Payment confirmation failed');
          }
        } catch (error) {
          console.error('Payment confirmation error:', error);
          toast.dismiss('payment-confirmation');
          toast.error('Payment confirmation failed. Please contact support.');
        }
      }
    };

    handlePaymentSuccessCallback();
  }, [location.search, navigate]);

  const campaign = {
    id: campaignId,
    title: 'Build a Community Library',
    description: 'Help us create a safe learning space for children in underserved communities.',
    icon: '🏘️',
    category: 'Community'
  };

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: ''
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.amount && !formData.customAmount) {
          newErrors.amount = 'Please select or enter an amount';
        }
        break;
      
      case 2:
        if (!formData.paymentMethod) {
          newErrors.paymentMethod = 'Please select a payment method';
        }
        break;
      
      case 3:
        // Preferences step - no validation needed as all fields are optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const amount = parseFloat(formData.customAmount || formData.amount);
      
      if (amount <= 0) {
        toast.error('Please enter a valid donation amount');
        return;
      }
      
      const description = `Donation for ${campaign.title}`;
      
      // Use the first available payment account
      if (!paymentAccounts || paymentAccounts.length === 0) {
        toast.error('No payment accounts available. Please contact support.');
        return;
      }
      
      const linkedPaymentAccountId = paymentAccounts[0].linked_payment_account_id;
      const event_id = campaignId;
      
      const donationData = {
        amount,
        description,
        linkedPaymentAccountId,
        event_id,
        isAnonymous: formData.isAnonymous,
        mailReceipt: formData.showReceipt
      };
      
      console.log('Processing donation:', donationData);
      toast.loading('Processing your donation...', { id: 'donation-processing' });
      
      const response = await processDonationPayment(donationData);
      
      if (response.success && response.check_out_url) {
        toast.dismiss('donation-processing');
        toast.success('Redirecting to payment...');
        // Redirect to payment checkout
        window.location.href = response.check_out_url;
      } else {
        throw new Error(response.message || 'Payment processing failed');
      }
      
    } catch (error) {
      console.error('Donation processing error:', error);
      toast.dismiss('donation-processing');
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('There was an error processing your donation. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getTotalAmount = () => {
    const amount = formData.customAmount || formData.amount;
    return parseFloat(amount) || 0;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AmountStep
            formData={formData}
            handleAmountSelect={handleAmountSelect}
            handleInputChange={handleInputChange}
            errors={errors}
            presetAmounts={presetAmounts}
          />
        );
      case 2:
        return (
          <PaymentStep
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            paymentMethods={paymentMethods}
            paymentAccounts={paymentAccounts}
            loading={loadingPaymentMethods}
          />
        );
      case 3:
        return (
          <PreferencesStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DonationHeader campaign={campaign} />
      
      <StepProgress currentStep={currentStep} />
      
      <div className="mb-8">
        {renderStep()}
      </div>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={3}
        onPrevious={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
        totalAmount={getTotalAmount()}
      />
    </div>
  );
};

export default DonationPage;