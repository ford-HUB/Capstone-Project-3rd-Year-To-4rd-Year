import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const PlacesAutocomplete = ({ onSelect, defaultValue }) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const initAutocomplete = () => {
    if (autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.AutocompleteService();
  };

  const handleInput = async (value) => {
    setInputValue(value);
    setShowDropdown(true);

    if (!value.trim() || !autocompleteRef.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await autocompleteRef.current.getPlacePredictions({
        input: value,
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'PH' } // Restrict to Philippines
      });
      
      setPredictions(response.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
    setIsLoading(false);
  };

  const handleSelect = (prediction) => {
    setInputValue(prediction.description);
    setShowDropdown(false);
    onSelect(prediction.description);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Predictions Dropdown */}
      {showDropdown && (predictions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handleSelect(prediction)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {prediction.structured_formatting.main_text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlacesAutocomplete; 