import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useEventStore } from '../../store/participant/useEventStore.js';

const InterestSelection = ({ isOpen, onClose, onComplete}) => {
  const { addInterests } = useEventStore()
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
  { id: 1, name: 'Donation Drives', icon: '🎁' },
  { id: 2, name: 'Community Outreach', icon: '🤝' },
  { id: 3, name: 'Health & Wellness', icon: '❤️' },
  { id: 4, name: 'Education Support', icon: '📚' },
  { id: 5, name: 'Youth Engagement', icon: '🌟' },
  { id: 6, name: 'Environmental Programs', icon: '🌱' },
  { id: 7, name: 'Disaster & Relief', icon: '🚨' },
  { id: 8, name: 'Cultural Events', icon: '🎭' }
];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest.id)
        ? prev.filter(id => id !== interest.id)
        : [...prev, interest.id]
    );
  };

    const handleComplete = async () => {
    if (selectedInterests.length > 0) {
      const selectedInterstNames = interests
        .filter(interest => selectedInterests.includes(interest.id))
        .map(interest => interest.name);

      console.log(selectedInterstNames);

      const success = await addInterests(selectedInterstNames);
      if (!success) return;

      onClose();

      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-[90%] max-w-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Select Your Interests</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Choose the areas that interest you the most to personalize your experience
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {interests.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleInterest(item)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedInterests.includes(item.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium">{item.name}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            disabled={selectedInterests.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedInterests.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestSelection;
