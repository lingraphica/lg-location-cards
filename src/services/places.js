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
  
  try {
    // Try real Google Places API first
    const realBusinesses = await searchRealPlaces(location, radius);
    if (realBusinesses && realBusinesses.length > 0) {
      console.log('Found real businesses:', realBusinesses);
      return realBusinesses;
    }
  } catch (error) {
    console.warn('Real API failed, using mock data:', error);
  }
  
  // Fallback to mock data
  await new Promise(resolve => setTimeout(resolve, 1000));
  const mockBusinesses = generateLocationBasedBusinesses(location);
  console.log('Generated location-based businesses:', mockBusinesses);
  return mockBusinesses;
};

const searchRealPlaces = async (location, radius) => {
  // Check if Google Maps is available with retries
  let retries = 0;
  const maxRetries = 10; // Wait up to 5 seconds
  
  while (retries < maxRetries) {
    if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService) {
      break;
    }
    
    console.log(`Waiting for Google Maps API to load... (attempt ${retries + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, 500));
    retries++;
  }
  
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    throw new Error('Google Maps Places library failed to load after retries');
  }

  const service = new window.google.maps.places.PlacesService(document.createElement('div'));
  
  // Search for different business types
  const businessTypes = [
    { type: 'grocery_or_supermarket', category: 'Grocery' },
    { type: 'cafe', category: 'Coffee Shop' },
    { type: 'florist', category: 'Florist' },
    { type: 'restaurant', category: 'Restaurant' },
    { type: 'pharmacy', category: 'Pharmacy' },
    { type: 'gas_station', category: 'Gas Station' },
    { type: 'bank', category: 'Bank' },
    { type: 'hair_care', category: 'Barber' },
    { type: 'book_store', category: 'Bookstore' },
    { type: 'real_estate_agency', category: 'Real Estate' },
    { type: 'moving_company', category: 'Moving & Storage' },
    { type: 'storage', category: 'Storage' }
  ];
  
  const allBusinesses = [];

  for (const { type, category } of businessTypes) {
    try {
      const places = await new Promise((resolve, reject) => {
        const request = {
          location: new window.google.maps.LatLng(location.lat, location.lng),
          radius: radius,
          type: type
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results || []);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });

      if (places.length > 0) {
        // Take up to 2 closest businesses of this type
        const selectedPlaces = places.slice(0, 2);
        
        for (const place of selectedPlaces) {
          const business = {
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            distance: calculateDistance(
              location.lat, location.lng,
              place.geometry.location.lat(), place.geometry.location.lng()
            ).toFixed(1),
            rating: place.rating || 'N/A',
            category: category,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            place_id: place.place_id,
            photos: [] // Will be populated by getDetails call
          };
          
          // Get photos using new Place class API
          try {
            const { Place } = await window.google.maps.importLibrary('places');
            
            const placeInstance = new Place({
              id: place.place_id
            });
            
            await placeInstance.fetchFields({ 
              fields: ['photos'] 
            });
            
            if (placeInstance.photos) {
              business.photos = placeInstance.photos.slice(0, 3).map(photo => ({
                photoUri: photo.getURI({ maxHeight: 400 }),
                height: photo.height,
                width: photo.width,
                authorAttributions: photo.authorAttributions
              }));
              console.log(`Got ${business.photos.length} photos with getURI for ${business.name}`);
            }
          } catch (error) {
            console.warn(`Failed to get photos for ${place.name}:`, error);
          }
          
          allBusinesses.push(business);
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch ${type} places:`, error);
    }
  }

  return allBusinesses;
};

// Get photo URL from Google Places photo reference
export const getPlacePhotoUrl = (photoReference, maxWidth = 400) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!photoReference || !apiKey) {
    return null;
  }
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;
};

// Get the best photo for a business
export const getBusinessPhoto = (business) => {
  console.log(`getBusinessPhoto called for ${business.name}`, business);
  
  if (!business.photos || business.photos.length === 0) {
    console.log(`No photos available for ${business.name}`);
    return null;
  }
  
  const photo = business.photos[0];
  
  // Use new Place class photoUri
  if (photo.photoUri) {
    console.log(`Got photo URI for ${business.name}:`, photo.photoUri);
    return photo.photoUri;
  }
  
  console.warn(`No photoUri found for ${business.name}`, photo);
  return null;
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