import { useState, useEffect } from 'react';
import Map from '../components/Map';
import CardGrid from '../components/CardGrid';
import FolderNavigation from '../components/FolderNavigation';
import useGeolocation from '../hooks/useGeolocation';
import { searchNearbyPlaces } from '../services/places';

function Home() {
  const { location, loading: locationLoading, error } = useGeolocation();
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);

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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nearby Businesses
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover local businesses in your immediate vicinity with our interactive map and business cards.
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800">
            Location access denied. Using default location (Downtown Portland).
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Map View</h2>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <Map />
            </div>
          </div>
          
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Local Businesses 
              {(locationLoading || placesLoading) && <span className="text-sm text-gray-500">(Loading...)</span>}
              {places.length > 0 && <span className="text-sm text-green-600">✨ Real location data</span>}
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6 max-h-80 overflow-y-auto">
              {placesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Finding nearby businesses...</p>
                  </div>
                </div>
              ) : (
                <CardGrid locations={places} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <FolderNavigation businesses={places} onCardPress={handleCardPress} />
        </div>
      </div>
    </div>
  );
}

export default Home;