import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationHeader = ({ campaign }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button 
        onClick={() => navigate('/donor/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Campaigns
      </button>
      
      <div className="flex items-center gap-4">
        <div className="text-4xl">{campaign.icon}</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Make a Donation</h1>
          <p className="text-gray-600">{campaign.title}</p>
        </div>
      </div>
    </div>
  );
};

export default DonationHeader;
