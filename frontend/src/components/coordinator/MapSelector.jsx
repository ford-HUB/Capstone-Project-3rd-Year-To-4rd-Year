import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const MapSelector = ({ onSelect, defaultValue }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(defaultValue || '');
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const scriptRef = useRef(null);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.google?.maps) {
      initMap();
      return;
    }

    // Create script element if it doesn't exist
    if (!scriptRef.current) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is not defined in environment variables');
        setIsLoading(false);
        return;
      }

      scriptRef.current = document.createElement('script');
      scriptRef.current.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      scriptRef.current.async = true;
      scriptRef.current.defer = true;
      scriptRef.current.onload = initMap;
      document.head.appendChild(scriptRef.current);
    }

    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (map) {
        // Clean up event listeners
        window.google?.maps?.event?.clearInstanceListeners(map);
      }
      if (marker) {
        // Clean up marker
        marker.setMap(null);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    // Default center (Philippines)
    const defaultCenter = { lat: 10.3157, lng: 123.8854 };

    // Create the map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 15,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Create a marker using AdvancedMarkerElement
    let markerInstance;
    if (window.google.maps.marker?.AdvancedMarkerElement) {
      markerInstance = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: defaultCenter,
        draggable: true
      });
    } else {
      // Fallback to regular Marker if AdvancedMarkerElement is not available
      markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        position: defaultCenter,
        draggable: true,
        animation: window.google.maps.Animation.DROP
      });
    }

    // If there's a default value, try to geocode it
    if (defaultValue) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: defaultValue }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          mapInstance.setCenter(location);
          markerInstance.position = location;
        }
      });
    }

    // Add click listener to map
    mapInstance.addListener('click', (e) => {
      markerInstance.position = e.latLng;
      updateLocationInfo(e.latLng);
    });

    // Add dragend listener to marker
    if (markerInstance instanceof window.google.maps.Marker) {
      markerInstance.addListener('dragend', () => {
        updateLocationInfo(markerInstance.getPosition());
      });
    } else {
      markerInstance.addListener('dragend', (e) => {
        updateLocationInfo(markerInstance.position);
      });
    }

    setMap(mapInstance);
    setMarker(markerInstance);
    setIsLoading(false);
  };

  const updateLocationInfo = (latLng) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setSelectedLocation(address);
        onSelect(address);
      }
    });
  };

  return (
    <div className="w-full space-y-2">
      {/* Selected Location Display */}
      <div className="relative">
        <input
          type="text"
          value={selectedLocation}
          readOnly
          placeholder={!import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Please configure Google Maps API key" : "Click on the map to select location..."}
          className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg border shadow-sm"
      >
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-500">
              {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
                ? "Missing Google Maps API key" 
                : "Loading map..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSelector; 