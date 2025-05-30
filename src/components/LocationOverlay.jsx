import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import BusinessFolder from './BusinessFolder';
import AACCard from './AACCard';
import { getTalkFolders } from '../data/talkFolders';
import { getCachedOrGenerateCards } from '../services/aacGenerator';
import { getBusinessPhoto } from '../services/places';

// Static array to prevent reloading
const libraries = ['places'];

function LocationOverlay({ isOpen, onClose, businesses, userLocation }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [generatedSubfolders, setGeneratedSubfolders] = useState({});
  const [loading, setLoading] = useState(false);
  const [navLevel, setNavLevel] = useState('main'); // 'main', 'subfolders', 'cards'

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  if (!isOpen) return null;

  // Get 3 business categories
  const getBusinessCategories = () => {
    const categoryCount = {};
    businesses.forEach(business => {
      const category = business.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).slice(0, 3).map(([category, count]) => ({
      category,
      count: `${count} found`,
      icon: getBusinessIcon(category)
    }));
  };

  const getBusinessIcon = (category) => {
    const icons = {
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
    return icons[category] || '🏪';
  };

  const businessCategories = getBusinessCategories();

  // Mini map component
  const MiniMap = () => {
    if (!isLoaded || !userLocation) {
      return (
        <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-gray-600 text-xs">📍 Loading...</div>
        </div>
      );
    }

    return (
      <div className="w-full h-28 rounded-lg overflow-hidden border border-gray-300">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={userLocation}
          zoom={15}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          }}
        >
          <Marker position={userLocation} />
        </GoogleMap>
      </div>
    );
  };

  const handleLocalFolderClick = (folder) => {
    // For local folders, show cards directly
    setSelectedFolder(folder);
    setNavLevel('cards');
  };

  const handleBusinessFolderClick = async (category) => {
    // For business folders, generate and show subfolders
    setSelectedFolder(category);
    setNavLevel('subfolders');
    setSelectedSubfolder(null); // Clear any previous subfolder selection
    
    const business = businesses.find(b => b.category === category.category);
    if (business) {
      setLoading(true);
      try {
        console.log(`Generating cards for ${business.name}`);
        const subfolders = await getCachedOrGenerateCards(business.name, business.category, business.address);
        // Always update the subfolders for this category, even if cached
        setGeneratedSubfolders(prev => ({
          ...prev,
          [category.category]: subfolders
        }));
      } catch (error) {
        console.error('Failed to generate AAC cards:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubfolderClick = (subfolder) => {
    setSelectedSubfolder(subfolder);
    setNavLevel('cards');
  };

  const resetOverlay = () => {
    setSelectedFolder(null);
    setSelectedSubfolder(null);
    setNavLevel('main');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Location Cards</h2>
          <button
            onClick={resetOverlay}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content - Always show main grid, then expand below */}
        <div className="space-y-6">
          {/* Top Row: Mini map + Business folders */}
          <div className="grid grid-cols-5 gap-4">
            {/* Mini Map (takes 1 column) */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Location</h3>
              <MiniMap />
            </div>
            
            {/* Business Category Folders (3 columns) */}
            {businessCategories.map((cat, index) => {
              return (
                <BusinessFolder
                  key={`business-${index}`}
                  category={cat.category}
                  icon={cat.icon}
                  count={cat.count}
                  onClick={() => handleBusinessFolderClick(cat)}
                  isActive={selectedFolder?.category === cat.category}
                />
              );
            })}
            
            {/* Placeholder folder (1 column) */}
            <BusinessFolder
              key="placeholder"
              category="Coming Soon"
              icon="❓"
              count=""
              onClick={() => {}} // Does nothing
              isActive={false}
            />
          </div>
          
          {/* Business Info Row - Show when business folder selected */}
          {selectedFolder && selectedFolder.category && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {selectedFolder.category} Businesses Near You
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {businesses
                  .filter(b => b.category === selectedFolder.category)
                  .slice(0, 3)
                  .map((business, index) => {
                    const photoUrl = getBusinessPhoto(business);
                    console.log(`Business ${index} (${business.name}) photoUrl:`, photoUrl);
                    console.log(`Business ${index} photos array:`, business.photos);
                    
                    return (
                      <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                        {photoUrl && (
                          <img 
                            src={photoUrl} 
                            alt={business.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              console.log(`Image failed to load for ${business.name}:`, photoUrl);
                              e.target.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              console.log(`Image loaded successfully for ${business.name}:`, photoUrl);
                            }}
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 text-sm">{business.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{business.address}</p>
                        {business.rating && (
                          <p className="text-xs text-yellow-600 mt-1">⭐ {business.rating}</p>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}

          {/* Subfolders Row - Show when business folder selected and keep visible */}
          {(navLevel === 'subfolders' || navLevel === 'cards') && selectedFolder && selectedFolder.category && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedFolder.category} Communication Categories
              </h3>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating personalized AAC cards...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {(generatedSubfolders[selectedFolder.category] || []).slice(0, 4).map((subfolder, index) => (
                    <BusinessFolder
                      key={`subfolder-${index}`}
                      category={subfolder.name}
                      icon={subfolder.icon}
                      count="8 cards"
                      onClick={() => handleSubfolderClick(subfolder)}
                      isActive={selectedSubfolder?.name === subfolder.name}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cards Grid - Show when any folder/subfolder selected */}
          {navLevel === 'cards' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedSubfolder?.name || selectedFolder.name} Cards
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {(() => {
                  let cards = [];
                  if (selectedSubfolder) {
                    // AI-generated subfolder cards
                    cards = selectedSubfolder.cards || [];
                  }
                  
                  return cards.slice(0, 8).map((card, index) => (
                    <AACCard
                      key={index}
                      text={card.text}
                      symbol={card.symbol}
                      onPress={(text) => console.log('Card pressed:', text)}
                      size="medium"
                    />
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Choose from 3 business categories to access communication cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationOverlay;