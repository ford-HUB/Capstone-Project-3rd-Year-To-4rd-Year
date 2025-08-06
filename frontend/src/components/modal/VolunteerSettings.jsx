import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useEventStore } from '../../store/participant/useEventStore';

// Schema for form validation
const settingsSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest')
});

// Interest options
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

const VolunteerSettings = ({ isOpen, onClose, userData }) => {
  const { updateInterest, interest } = useEventStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      interests: []
    }
  });

  // Initialize selected interests when component mounts or userData changes
  useEffect(() => {
    if (userData?.interest || interest) {
      const userInterests = interest || userData?.interest || [];
      const initialInterests = interests
        .filter(item => userInterests.includes(item.name))
        .map(item => item.id);
      setSelectedInterests(initialInterests);
      // Update form value
      setValue('interests', userInterests);
    }
  }, [userData, interest, setValue]);

  const toggleInterest = (interestId) => {
    if (!isEditing) return;
    
    const newSelectedInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    setSelectedInterests(newSelectedInterests);
    
    // Update form value with interest names
    const selectedInterestNames = interests
      .filter(item => newSelectedInterests.includes(item.id))
      .map(item => item.name);
    
    setValue('interests', selectedInterestNames, { shouldValidate: true });
  };

  const onSubmit = async () => {
    try {
      console.log('Form submitted!'); // Debug log
      setIsLoading(true);
      // Get the names of selected interests
      const selectedInterestNames = interests
        .filter(item => selectedInterests.includes(item.id))
        .map(item => item.name);

      console.log('Selected Interest Names:', selectedInterestNames);
      
      const success = await updateInterest(selectedInterestNames)
      if(!success) return
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update interests');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsGeneralSettingsOpen(!isGeneralSettingsOpen)}
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-700 hover:text-gray-900"
              aria-expanded={isGeneralSettingsOpen}
            >
              <span>Account Information</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  isGeneralSettingsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isGeneralSettingsOpen && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Volunteer Interests */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Volunteer Interests</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              ) : (
                <span className="text-sm text-gray-500">Select your interests</span>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              Choose the areas that interest you the most to personalize your experience
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interests.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  aria-pressed={selectedInterests.includes(item.id)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                    selectedInterests.includes(item.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!isEditing ? 'opacity-75 cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-center">{item.name}</div>
                </button>
              ))}
            </div>
            {errors.interests && (
              <p className="text-red-500 text-sm mt-2">{errors.interests.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original interests
                  const originalInterests = interests
                    .filter(item => (interest || userData?.interest || []).includes(item.name))
                    .map(item => item.id);
                  setSelectedInterests(originalInterests);
                  setValue('interests', interest || userData?.interest || []);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || selectedInterests.length === 0}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  selectedInterests.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VolunteerSettings;