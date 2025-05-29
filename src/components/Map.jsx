import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '280px'
};

const center = {
  lat: 45.5190,
  lng: -122.6787
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  return isLoaded ? (
    <div className="w-full h-70 rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {/* Child components, such as markers, info windows, etc. */}
      </GoogleMap>
    </div>
  ) : (
    <div className="w-full h-70 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-600">Loading Map...</div>
    </div>
  );
}

export default Map;