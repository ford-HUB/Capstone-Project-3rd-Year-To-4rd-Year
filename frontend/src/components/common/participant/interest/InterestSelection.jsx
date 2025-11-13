import React from "react";
import InterestCard from "./cards/InterestCard";
import EmptyState from "./EmptyState";

const InterestSelection = ({ selectedInterests, onInterestToggle, onSaveInterests, isLoading }) => {
    const interests = [
      { id: 1, name: 'Donation Drives', icon: '🎁', description: 'Help organize and distribute donations to communities in need' },
      { id: 2, name: 'Community Outreach', icon: '🤝', description: 'Connect with local communities and build lasting relationships' },
      { id: 3, name: 'Health & Wellness', icon: '❤️', description: 'Support health programs and wellness initiatives' },
      { id: 4, name: 'Education Support', icon: '📚', description: 'Assist in educational programs and tutoring activities' },
      { id: 5, name: 'Youth Engagement', icon: '🌟', description: 'Mentor and engage with young people in the community' },
      { id: 6, name: 'Environmental Programs', icon: '🌱', description: 'Participate in environmental conservation and sustainability projects' },
      { id: 7, name: 'Disaster & Relief', icon: '🚨', description: 'Provide emergency response and disaster relief support' },
      { id: 8, name: 'Cultural Events', icon: '🎭', description: 'Help organize and participate in cultural celebrations and events' },
      { id: 9, name: 'Senior Care', icon: '👴', description: 'Support elderly community members with companionship and care' },
      { id: 10, name: 'Technology Training', icon: '💻', description: 'Teach digital literacy and technology skills to community members' },
      { id: 11, name: 'Food Security', icon: '🍽️', description: 'Help with food banks, meal preparation, and nutrition programs' },
      { id: 12, name: 'Mental Health Support', icon: '🧠', description: 'Assist in mental health awareness and support programs' }
    ];

    // Calculate total selected interests (use selectedInterests as the source of truth)
    const totalSelected = selectedInterests.length;
  
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Volunteer Interests</h2>
          <p className="text-gray-600">
            Choose the volunteer activities that interest you the most. 
            This helps us show you relevant opportunities.
          </p>
        </div>
  
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Available Interest Categories ({totalSelected} selected)
            </h3>
            <button
                disabled={selectedInterests.length === 0 || isLoading}
                onClick={onSaveInterests}
                className={`px-6 py-2 ${selectedInterests.length ? `bg-green-600 hover:bg-green-700 text-white cursor-pointer`: 'bg-gray-300 text-gray-600 cursor-not-allowed'}  rounded-lg font-medium transition-colors`}
              >
                {
                    isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Save Interests'
                }
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                isSelected={selectedInterests.includes(interest.name)}
                onToggle={onInterestToggle}
              />
            ))}
          </div>
        </div>
  
        {selectedInterests.length === 0 && <EmptyState />}
      </div>
    );
};

export default InterestSelection