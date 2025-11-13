import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoodsDonationHeader from '../../components/donor/goods-donation/GoodsDonationHeader';
import GoodsStepProgress from '../../components/donor/goods-donation/GoodsStepProgress';
import GoodsStepNavigation from '../../components/donor/goods-donation/GoodsStepNavigation';
import GoodsStep from '../../components/donor/goods-donation/steps/GoodsStep';
import DropoffStep from '../../components/donor/goods-donation/steps/DropoffStep';
import ConfirmationStep from '../../components/donor/goods-donation/steps/ConfirmationStep';
import useGoodsDonationStore from '../../store/donor/useGoodsDonationStore';

const GoodsDonationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get campaign ID from URL query parameter or state
  const urlParams = new URLSearchParams(location.search);
  const campaignId = urlParams.get('campaign') || location.state?.campaignId || 1;
  
  // Use the goods donation store
  const {
    formData,
    currentStep,
    errors,
    isProcessing,
    enabledGoodsTypes,
    handleInputChange,
    clearError,
    nextStep,
    prevStep,
    validateCurrentStep,
    submitGoodsDonation,
    resetForm,
    fetchEventGoodsTypes
  } = useGoodsDonationStore();

  // Fetch enabled goods types when component mounts or campaignId changes
  React.useEffect(() => {
    if (campaignId) {
      fetchEventGoodsTypes(campaignId);
    }
  }, [campaignId, fetchEventGoodsTypes]);

  const campaign = {
    id: campaignId,
    title: 'Build a Community Library',
    description: 'Help us create a safe learning space for children in underserved communities.',
    icon: '🏘️',
    category: 'Community'
  };

  const handleNextStep = () => {
    if (validateCurrentStep() && currentStep < 3) {
      nextStep();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    const success = await submitGoodsDonation(campaignId);
    
    if (success) {
      navigate('/donor/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoodsStep
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            enabledGoodsTypes={enabledGoodsTypes}
          />
        );
      case 2:
        return (
          <DropoffStep
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <ConfirmationStep
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
      <GoodsDonationHeader campaign={campaign} />
      
      <GoodsStepProgress currentStep={currentStep} />
      
      <div className="mb-8">
        {renderStep()}
      </div>

      <GoodsStepNavigation
        currentStep={currentStep}
        totalSteps={3}
        onPrevious={handlePrevStep}
        onNext={handleNextStep}
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default GoodsDonationPage;
