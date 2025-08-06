import React, { useEffect, useRef, useState } from 'react';

const MapBase = ({ apiKey }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const loadScript = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      window.initMap = initMap;
      document.body.appendChild(script);
    };

    const initMap = () => {
      const defaultCenter = { lat: 10.3157, lng: 123.8854 }; // Cebu
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
      });

      mapInstance.addListener('click', (e) => {
        const clicked = e.latLng;
        if (marker) marker.setMap(null);

        const newMarker = new window.google.maps.Marker({
          position: clicked,
          map: mapInstance,
        });

        setMarker(newMarker);
      });

      setMap(mapInstance);
    };

    loadScript();
  }, [apiKey]);

  return (
    <div className="rounded-md overflow-hidden shadow border border-gray-100 h-[560px]">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapBase;
