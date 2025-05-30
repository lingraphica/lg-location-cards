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

  const handleCustomShopClick = () => {
    // Mock custom flower shop data
    const customShop = {
      category: "Bella's Flowers",
      name: "Bella's Flowers"
    };
    
    setSelectedFolder(customShop);
    setNavLevel('subfolders');
    setSelectedSubfolder(null);
    
    // Create custom subfolders with photos
    const customSubfolders = [
      {
        name: "Occasions",
        icon: "💒",
        photo: "/photos/occasions-subfolder.jpg", // Wedding bouquet or elegant arrangement
        cards: [
          { text: "Wedding", symbol: "👰", photo: "/photos/wedding-bouquet.jpg" },
          { text: "Birthday", symbol: "🎂", photo: "/photos/birthday-flowers.jpg" },
          { text: "Sympathy", symbol: "🕊️", photo: "/photos/sympathy-wreath.jpg" },
          { text: "Anniversary", symbol: "💕", photo: "/photos/anniversary-roses.jpg" },
          { text: "Graduation", symbol: "🎓", photo: "/photos/graduation-flowers.jpg" },
          { text: "Get Well", symbol: "🌸", photo: "/photos/get-well-flowers.jpg" },
          { text: "Thank You", symbol: "🙏", photo: "/photos/thank-you-bouquet.jpg" },
          { text: "Congratulations", symbol: "🎉", photo: "/photos/congrats-flowers.jpg" }
        ]
      },
      {
        name: "Flower Types",
        icon: "🌹",
        photo: "/photos/flower-types-subfolder.jpg", // Colorful mixed flower display
        cards: [
          { text: "Roses", symbol: "🌹", photo: "/photos/red-roses.jpg" },
          { text: "Tulips", symbol: "🌷", photo: "/photos/yellow-tulips.jpg" },
          { text: "Sunflowers", symbol: "🌻", photo: "/photos/bright-sunflowers.jpg" },
          { text: "Lilies", symbol: "🪷", photo: "/photos/white-lilies.jpg" },
          { text: "Daisies", symbol: "🌼", photo: "/photos/white-daisies.jpg" },
          { text: "Orchids", symbol: "🌺", photo: "/photos/purple-orchids.jpg" },
          { text: "Carnations", symbol: "🌸", photo: "/photos/pink-carnations.jpg" },
          { text: "Peonies", symbol: "🌸", photo: "/photos/peony-flowers.jpg" }
        ]
      },
      {
        name: "Services",
        icon: "🚚",
        photo: "/photos/services-subfolder.jpg", // Florist arranging flowers or delivery van
        cards: [
          { text: "Same Day Delivery", symbol: "🚚", photo: "/photos/flower-delivery.jpg" },
          { text: "Custom Arrangement", symbol: "💐", photo: "/photos/flower-arranging.jpg" },
          { text: "Design Consultation", symbol: "👩‍🌾", photo: "/photos/florist-consultation.jpg" },
          { text: "Care Instructions", symbol: "💧", photo: "/photos/flower-care.jpg" },
          { text: "Bespoke Design", symbol: "🎨", photo: "/photos/custom-design.jpg" },
          { text: "Wedding Package", symbol: "💒", photo: "/photos/wedding-planning.jpg" },
          { text: "Event Styling", symbol: "🎪", photo: "/photos/event-decoration.jpg" },
          { text: "Weekly Delivery", symbol: "📅", photo: "/photos/flower-subscription.jpg" }
        ]
      },
      {
        name: "Colors",
        icon: "🎨",
        photo: "/photos/colors-subfolder.jpg", // Colorful flower arrangements showing different colors
        cards: [
          { text: "Red", symbol: "🔴", photo: "/photos/red-flowers.jpg" },
          { text: "Pink", symbol: "🩷", photo: "/photos/pink-flowers.jpg" },
          { text: "White", symbol: "⚪", photo: "/photos/white-flowers.jpg" },
          { text: "Yellow", symbol: "🟡", photo: "/photos/yellow-flowers.jpg" },
          { text: "Purple", symbol: "🟣", photo: "/photos/purple-flowers.jpg" },
          { text: "Orange", symbol: "🟠", photo: "/photos/orange-flowers.jpg" },
          { text: "Mixed Colors", symbol: "🌈", photo: "/photos/mixed-flowers.jpg" },
          { text: "Pastel Tones", symbol: "🎀", photo: "/photos/pastel-flowers.jpg" }
        ]
      }
    ];
    
    setGeneratedSubfolders(prev => ({
      ...prev,
      "Bella's Flowers": customSubfolders
    }));
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
            
            {/* Custom Flower Shop folder (1 column) */}
            <BusinessFolder
              key="custom-shop"
              category="Bella's Flowers"
              icon="🌺"
              count="Custom"
              photo="/photos/bella-flowers-main.jpg"
              onClick={() => handleCustomShopClick()}
              isActive={selectedFolder?.category === "Bella's Flowers"}
              isCustom={true}
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
                      photo={subfolder.photo}
                      onClick={() => handleSubfolderClick(subfolder)}
                      isActive={selectedSubfolder?.name === subfolder.name}
                      isCustom={selectedFolder.category === "Bella's Flowers"}
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
                      photo={card.photo}
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