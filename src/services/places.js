import axios from 'axios';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

// Map Google place types to our AAC categories
const mapGoogleTypeToCategory = (types) => {
  const typeMapping = {
    'grocery_or_supermarket': 'Grocery',
    'supermarket': 'Grocery',
    'cafe': 'Coffee Shop',
    'coffee': 'Coffee Shop',
    'florist': 'Florist',
    'pharmacy': 'Pharmacy',
    'drugstore': 'Pharmacy',
    'hair_care': 'Barber',
    'beauty_salon': 'Barber',
    'book_store': 'Bookstore',
    'restaurant': 'Restaurant',
    'food': 'Restaurant',
    'store': 'Store',
    'establishment': 'Business'
  };

  for (const type of types) {
    if (typeMapping[type]) {
      return typeMapping[type];
    }
  }
  
  // Default category
  return 'Business';
};

// Calculate distance between two lat/lng points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

export const searchNearbyPlaces = async (location, radius = 1000) => {
  console.log(`Searching for places near ${location.lat}, ${location.lng}`);
  
  // For hackathon demo: Use location-based mock data to simulate real API
  // Google Places API has CORS restrictions for direct browser calls
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate realistic businesses based on actual location
  const mockBusinesses = generateLocationBasedBusinesses(location);
  
  console.log('Generated location-based businesses:', mockBusinesses);
  return mockBusinesses;
};

// Generate realistic businesses based on location
const generateLocationBasedBusinesses = (location) => {
  const businesses = [
    {
      id: 1,
      name: getLocalBusinessName(location, 'Grocery'),
      address: generateNearbyAddress(location),
      distance: (Math.random() * 0.8 + 0.1).toFixed(1),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category: "Grocery",
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01
    },
    {
      id: 2, 
      name: getLocalBusinessName(location, 'Coffee Shop'),
      address: generateNearbyAddress(location),
      distance: (Math.random() * 0.8 + 0.1).toFixed(1),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category: "Coffee Shop",
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01
    },
    {
      id: 3,
      name: getLocalBusinessName(location, 'Florist'),
      address: generateNearbyAddress(location),
      distance: (Math.random() * 0.8 + 0.1).toFixed(1),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category: "Florist",
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01
    }
  ];
  
  return businesses;
};

const getLocalBusinessName = (location, category) => {
  const names = {
    'Grocery': ['Local Market', 'Corner Store', 'Fresh Foods', 'Neighborhood Grocery', 'Daily Market'],
    'Coffee Shop': ['Bean There', 'Local Brew', 'Corner Coffee', 'Daily Grind', 'Neighborhood Cafe'],
    'Florist': ['Bloom & Co', 'Petal Perfect', 'Local Flowers', 'Garden Fresh', 'Flower Power']
  };
  
  const categoryNames = names[category] || ['Local Business'];
  return categoryNames[Math.floor(Math.random() * categoryNames.length)];
};

const generateNearbyAddress = (location) => {
  const streetNumbers = [123, 456, 789, 234, 567, 890];
  const streetNames = ['Main St', 'Oak Ave', 'Pine St', 'Cedar Rd', 'Elm Dr', 'Maple Way'];
  
  const number = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const street = streetNames[Math.floor(Math.random() * streetNames.length)];
  
  return `${number} ${street}`;
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${GOOGLE_PLACES_API_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,formatted_phone_number,opening_hours,website',
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};