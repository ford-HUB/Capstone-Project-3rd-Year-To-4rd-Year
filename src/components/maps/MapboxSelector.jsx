import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxSelector = ({ onSelect, defaultValue }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(defaultValue || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    }

    if (!map.current && mapContainer.current) {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [123.8854, 10.3157], // Default center (Philippines)
        zoom: 15
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Create a marker
      marker.current = new mapboxgl.Marker({
        draggable: true,
        color: '#3B82F6' // Blue color matching your theme
      })
        .setLngLat([123.8854, 10.3157])
        .addTo(map.current);

      // If there's a default value, try to geocode it
      if (defaultValue) {
        fetchLocationCoordinates(defaultValue);
      }

      // Add click listener to map
      map.current.on('click', (e) => {
        marker.current.setLngLat(e.lngLat);
        updateLocationInfo(e.lngLat);
      });

      // Add dragend listener to marker
      marker.current.on('dragend', () => {
        const lngLat = marker.current.getLngLat();
        updateLocationInfo(lngLat);
      });

      map.current.on('load', () => {
        setIsLoading(false);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const fetchLocationCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.setCenter([lng, lat]);
        marker.current.setLngLat([lng, lat]);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const updateLocationInfo = async (lngLat) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setSelectedLocation(address);
        onSelect(address);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Selected Location Display */}
      <div className="relative">
        <input
          type="text"
          value={selectedLocation}
          readOnly
          placeholder={!mapboxgl.accessToken ? "Please configure Mapbox access token" : "Click on the map to select location..."}
          className="w-full px-3 py-2 pl-10 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-[400px] rounded-lg shadow-sm bg-gray-50"
      >
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">
              {!mapboxgl.accessToken 
                ? "Missing Mapbox access token" 
                : "Loading map..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapboxSelector; 