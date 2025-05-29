import { useState } from 'react';
import BusinessFolder from './BusinessFolder';
import AACCard from './AACCard';
import { getTalkFolders } from '../data/talkFolders';
import { getCachedOrGenerateCards } from '../services/aacGenerator';

function LocationOverlay({ isOpen, onClose, businesses, userLocation }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [generatedSubfolders, setGeneratedSubfolders] = useState({});
  const [loading, setLoading] = useState(false);
  const [navLevel, setNavLevel] = useState('main'); // 'main', 'subfolders', 'cards'

  if (!isOpen) return null;

  // Get 3 local folders
  const localFolders = getTalkFolders().slice(0, 3);
  
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
      'Bank': '🏦'
    };
    return icons[category] || '🏪';
  };

  const businessCategories = getBusinessCategories();

  // Generate Google Maps static image URL
  const getMapImageUrl = () => {
    if (!userLocation) return null;
    const { lat, lng } = userLocation;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=200x150&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
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
    
    const business = businesses.find(b => b.category === category.category);
    if (business && !generatedSubfolders[category.category]) {
      setLoading(true);
      try {
        console.log(`Generating cards for ${business.name}`);
        const subfolders = await getCachedOrGenerateCards(business.name, business.category, business.address);
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
          {/* Main Grid: 3 local + 3 business folders */}
          <div className="grid grid-cols-6 gap-4">
            {/* Local Folders (left 3) */}
            {localFolders.map((folder) => (
              <BusinessFolder
                key={`local-${folder.id}`}
                category={folder.name}
                icon={folder.icon}
                count="local talk\nlibrary cards"
                onClick={() => handleLocalFolderClick(folder)}
                isActive={selectedFolder?.id === folder.id}
              />
            ))}

            {/* Business Category Folders (right 3) */}
            {businessCategories.map((cat, index) => (
              <BusinessFolder
                key={`business-${index}`}
                category={cat.category}
                icon={cat.icon}
                count={cat.count}
                onClick={() => handleBusinessFolderClick(cat)}
                isActive={selectedFolder?.category === cat.category}
              />
            ))}
          </div>

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
                <div className="grid grid-cols-6 gap-4">
                  {(generatedSubfolders[selectedFolder.category] || []).slice(0, 6).map((subfolder, index) => (
                    <BusinessFolder
                      key={`subfolder-${index}`}
                      category={subfolder.name}
                      icon={subfolder.icon}
                      count="18 cards"
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
              <div className="grid grid-cols-6 gap-3">
                {(() => {
                  let cards = [];
                  if (selectedSubfolder) {
                    // AI-generated subfolder cards
                    cards = selectedSubfolder.cards || [];
                  } else if (selectedFolder) {
                    // Local folder cards
                    cards = selectedFolder.cards || [];
                  }
                  
                  return cards.slice(0, 18).map((card, index) => (
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
              Choose from 3 local folders or 3 business categories to access communication cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationOverlay;