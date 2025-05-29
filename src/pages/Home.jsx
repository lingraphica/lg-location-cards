import { useState, useEffect } from 'react';
import Map from '../components/Map';
import CardGrid from '../components/CardGrid';
import FolderNavigation from '../components/FolderNavigation';
import LocationOverlay from '../components/LocationOverlay';
import useGeolocation from '../hooks/useGeolocation';
import { searchNearbyPlaces } from '../services/places';

function Home() {
  const { location, loading: locationLoading, error } = useGeolocation();
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleCardPress = (text) => {
    console.log('AAC Card pressed:', text);
  };

  const fetchNearbyPlaces = async (userLocation) => {
    setPlacesLoading(true);
    setPlacesError(null);
    
    try {
      console.log('Fetching nearby places for location:', userLocation);
      const nearbyPlaces = await searchNearbyPlaces(userLocation, 1000);
      console.log('Found places:', nearbyPlaces);
      
      // Filter to only our target categories and limit to 3
      const targetCategories = ['Grocery', 'Coffee Shop', 'Florist', 'Pharmacy', 'Barber', 'Bookstore'];
      const filteredPlaces = nearbyPlaces
        .filter(place => targetCategories.includes(place.category))
        .slice(0, 3);
      
      setPlaces(filteredPlaces);
    } catch (err) {
      console.error('Error fetching places:', err);
      setPlacesError(err.message);
      
      // Fallback to mock data
      const mockPlaces = [
        {
          id: 1,
          name: "Pioneer Market",
          address: "716 SW Morrison St",
          distance: "0.1",
          rating: "4.3",
          category: "Grocery"
        },
        {
          id: 2,
          name: "Pearl District Coffee",
          address: "532 NW 12th Ave",
          distance: "0.2",
          rating: "4.6",
          category: "Coffee Shop"
        },
        {
          id: 3,
          name: "Downtown Florist",
          address: "421 SW 5th Ave",
          distance: "0.1",
          rating: "4.8",
          category: "Florist"
        }
      ];
      setPlaces(mockPlaces);
    } finally {
      setPlacesLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchNearbyPlaces(location);
    }
  }, [location]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Communication Board
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tap folders and cards to communicate. Click the ✨ for location-specific options.
        </p>
      </div>

      {/* Main 6x4 Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6 relative">
        <FolderNavigation businesses={places} onCardPress={handleCardPress} />
        
        {/* Sparkle Icon */}
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        >
          <span className="text-2xl">✨</span>
        </button>
      </div>

      {/* Location Overlay */}
      <LocationOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        businesses={places}
        userLocation={location}
      />
    </div>
  );
}

export default Home;