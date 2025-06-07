import React, { useState } from 'react';
import { X } from 'lucide-react';

const InterestSelection = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const interests = [
    { id: 1, name: 'Academic Support', icon: '📚' },
    { id: 2, name: 'Career Development', icon: '💼' },
    { id: 3, name: 'Student Life', icon: '🎓' },
    { id: 4, name: 'Health & Wellness', icon: '🏥' },
    { id: 5, name: 'Technology', icon: '💻' },
    { id: 6, name: 'Research', icon: '🔬' },
    { id: 7, name: 'Arts & Culture', icon: '🎨' },
    { id: 8, name: 'Sports', icon: '⚽' }
  ];

  const categories = [
    { id: 1, name: 'Counseling Services', icon: '🤝' },
    { id: 2, name: 'Academic Advising', icon: '📖' },
    { id: 3, name: 'Financial Aid', icon: '💰' },
    { id: 4, name: 'Student Organizations', icon: '👥' },
    { id: 5, name: 'Campus Events', icon: '🎉' },
    { id: 6, name: 'Health Services', icon: '🏥' },
    { id: 7, name: 'Career Services', icon: '💼' },
    { id: 8, name: 'Technical Support', icon: '🔧' }
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest.id)
        ? prev.filter(id => id !== interest.id)
        : [...prev, interest.id]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category.id)
        ? prev.filter(id => id !== category.id)
        : [...prev, category.id]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedInterests.length > 0) {
      setStep(2);
    } else if (step === 2 && selectedCategories.length > 0) {
      onComplete({ interests: selectedInterests, categories: selectedCategories });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-[90%] max-w-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {step === 1 ? 'Select Your Interests' : 'Choose Categories'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            {step === 1 
              ? 'Choose the areas that interest you the most to personalize your experience'
              : 'Select specific categories you want to focus on'
            }
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(step === 1 ? interests : categories).map((item) => (
              <button
                key={item.id}
                onClick={() => step === 1 ? toggleInterest(item) : toggleCategory(item)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  (step === 1 ? selectedInterests : selectedCategories).includes(item.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium">{item.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 1 ? selectedInterests.length === 0 : selectedCategories.length === 0}
            className={`ml-auto px-6 py-2 rounded-lg font-medium transition-colors ${
              (step === 1 ? selectedInterests.length > 0 : selectedCategories.length > 0)
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 1 ? 'Next' : 'Get Started'}
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestSelection; 