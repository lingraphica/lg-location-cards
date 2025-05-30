// Wikimedia Commons API service for fetching category images

const WIKIMEDIA_API_URL = 'https://commons.wikimedia.org/w/api.php';

// Map business categories to Wikimedia search terms
const getCategorySearchTerm = (category) => {
  const searchTerms = {
    'Grocery': 'grocery store supermarket',
    'Coffee Shop': 'coffee shop cafe',
    'Florist': 'flower shop florist',
    'Pharmacy': 'pharmacy drugstore',
    'Barber': 'barber shop haircut',
    'Bookstore': 'bookstore library books',
    'Restaurant': 'restaurant dining',
    'Gas Station': 'gas station fuel',
    'Bank': 'bank building finance',
    'Real Estate': 'real estate house building',
    'Moving & Storage': 'moving truck storage',
    'Storage': 'storage facility warehouse'
  };
  
  return searchTerms[category] || category.toLowerCase();
};

// Cache for images to avoid repeated API calls
const imageCache = new Map();

export const getBusinessImage = async (category) => {
  // Check cache first
  if (imageCache.has(category)) {
    return imageCache.get(category);
  }

  try {
    const searchTerm = getCategorySearchTerm(category);
    
    // Search for images on Wikimedia Commons
    const searchResponse = await fetch(
      `${WIKIMEDIA_API_URL}?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&srlimit=5`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`Search request failed: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.search?.length) {
      throw new Error('No images found');
    }
    
    // Get the first image result
    const firstResult = searchData.query.search[0];
    const filename = firstResult.title.replace('File:', '');
    
    // Get the actual image URL
    const imageResponse = await fetch(
      `${WIKIMEDIA_API_URL}?action=query&format=json&origin=*&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=200`
    );
    
    if (!imageResponse.ok) {
      throw new Error(`Image request failed: ${imageResponse.status}`);
    }
    
    const imageData = await imageResponse.json();
    const pages = imageData.query?.pages;
    
    if (!pages) {
      throw new Error('No image data found');
    }
    
    const pageKey = Object.keys(pages)[0];
    const imageInfo = pages[pageKey]?.imageinfo?.[0];
    
    if (!imageInfo?.thumburl) {
      throw new Error('No thumbnail URL found');
    }
    
    const imageUrl = imageInfo.thumburl;
    
    // Cache the result
    imageCache.set(category, imageUrl);
    
    return imageUrl;
    
  } catch (error) {
    console.warn(`Failed to fetch image for ${category}:`, error);
    
    // Fallback to emoji if API fails
    const fallbackEmojis = {
      'Grocery': '🛒',
      'Coffee Shop': '☕',
      'Florist': '🌸',
      'Pharmacy': '💊',
      'Barber': '✂️',
      'Bookstore': '📚',
      'Restaurant': '🍽️',
      'Gas Station': '⛽',
      'Bank': '🏦',
      'Real Estate': '🏘️',
      'Moving & Storage': '📦',
      'Storage': '🏪'
    };
    
    const fallback = fallbackEmojis[category] || '🏪';
    imageCache.set(category, fallback);
    return fallback;
  }
};

// Clear cache function for debugging
export const clearImageCache = () => {
  imageCache.clear();
  console.log('Wikimedia image cache cleared');
};