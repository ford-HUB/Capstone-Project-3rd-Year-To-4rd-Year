import React from "react";
import InterestSelection from "../../../components/common/participant/interest/InterestSelection";
import { useEventStore } from '../../../store/participant/useEventStore.js';

const InterestTab = ({ hasInterest, currentInterest, setActiveTab }) => {
    const { addInterests, updateInterest } = useEventStore()
    const [selectedInterests, setSelectedInterests] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false)

    React.useEffect(() => {
        console.log('InterestTab - hasInterest:', hasInterest);
        console.log('InterestTab - currentInterest:', currentInterest);
    }, [hasInterest, currentInterest]);

    // Initialize selectedInterests with currentInterest when component mounts or currentInterest changes
    React.useEffect(() => {
        if (currentInterest && currentInterest.length > 0) {
            console.log('Setting selectedInterests to:', currentInterest);
            setSelectedInterests(currentInterest);
        }
    }, [currentInterest.length]);
  
    const handleInterestToggle = (interest) => {
        setSelectedInterests(prev => {
            const newSelection = prev.includes(interest.name)
              ? prev.filter(name => name !== interest.name)
              : [...prev, interest.name];
            console.log('Updated selectedInterests:', newSelection);
            return newSelection;
        });
    };
  
    const handleSaveInterests = async () => {
        console.log('Saving interests:', selectedInterests);
        setLoading(true)
        let success = false
        try {
            if (hasInterest) {
                console.log('Updating existing interests');
                success = await updateInterest(selectedInterests);
            } else {
                console.log('Adding new interests');
                success = await addInterests(selectedInterests);
            }
        } finally {
            setLoading(false)
            setActiveTab('profile')
        }
        if(!success) return
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InterestSelection
            hasInterest={hasInterest}
            currentInterest={currentInterest}
            selectedInterests={selectedInterests}
            onInterestToggle={handleInterestToggle}
            onSaveInterests={handleSaveInterests}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
};
  
export default InterestTab;