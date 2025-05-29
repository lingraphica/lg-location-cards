import { useState, useEffect } from 'react';
import BusinessFolder from './BusinessFolder';
import SubFolder from './SubFolder';
import AACCard from './AACCard';
import { businessCardData, getCategoryIcon, getSubfolders, getCards } from '../data/businessCards';
import { getCachedOrGenerateCards } from '../services/aacGenerator';
import { getTalkFolders } from '../data/talkFolders';

function FolderNavigation({ businesses, onCardPress }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [generatedSubfolders, setGeneratedSubfolders] = useState({});
  const [loading, setLoading] = useState(false);
  const [folderType, setFolderType] = useState(null); // 'local' or 'ai'

  // Get first 3 local Talk folders
  const localFolders = getTalkFolders().slice(0, 3);
  
  // Get first 3 AI business categories
  const getBusinessCategories = () => {
    const categoryCount = {};
    businesses.forEach(business => {
      const category = business.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).slice(0, 3).map(([category, count]) => ({
      category,
      count,
      icon: getCategoryIcon(category)
    }));
  };

  const businessCategories = getBusinessCategories();

  const handleLocalFolderSelect = (folder) => {
    setSelectedFolder(folder);
    setFolderType('local');
    setSelectedSubfolder(null);
  };

  const handleBusinessCategorySelect = async (category) => {
    setSelectedFolder(category);
    setFolderType('ai');
    setSelectedSubfolder(null);
    
    // Generate AI subfolders if not already generated
    const business = businesses.find(b => b.category === category);
    if (business && !generatedSubfolders[category]) {
      setLoading(true);
      try {
        console.log(`Generating cards for ${business.name}`);
        const subfolders = await getCachedOrGenerateCards(business.name, business.category, business.address);
        setGeneratedSubfolders(prev => ({
          ...prev,
          [category]: subfolders
        }));
      } catch (error) {
        console.error('Failed to generate AAC cards:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubfolderSelect = (subfolder) => {
    setSelectedSubfolder(subfolder);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setSelectedSubfolder(null);
    setFolderType(null);
  };

  // Render cards when a subfolder is selected
  if (selectedSubfolder) {
    let cards = [];
    
    if (folderType === 'local') {
      // Get cards from local Talk folder
      const folder = localFolders.find(f => f.name === selectedFolder);
      cards = folder?.cards || [];
    } else if (folderType === 'ai') {
      // Get cards from AI generated subfolders
      const generatedCards = generatedSubfolders[selectedFolder];
      if (generatedCards) {
        const subfolder = generatedCards.find(sf => sf.name === selectedSubfolder.name);
        cards = subfolder?.cards || [];
      }
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {folderType === 'local' ? selectedSubfolder : selectedSubfolder.name} Cards
              {folderType === 'ai' && <span className="ml-2 text-sm text-green-600">✨ AI Generated</span>}
            </h3>
            <p className="text-sm text-gray-600">
              Tap any card to speak the phrase aloud
            </p>
          </div>
          <button
            onClick={handleBackToFolders}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
        
        <div className="grid grid-cols-6 gap-3">
          {cards.map((card, index) => (
            <AACCard
              key={index}
              text={card.text}
              symbol={card.symbol}
              onPress={onCardPress}
              size="medium"
            />
          ))}
        </div>
      </div>
    );
  }

  // Render subfolders when a folder is selected
  if (selectedFolder) {
    let subfolders = [];
    
    if (folderType === 'local') {
      // For local folders, create 2 subfolders by splitting the 18 cards
      const folder = localFolders.find(f => f.name === selectedFolder);
      if (folder) {
        const midpoint = Math.ceil(folder.cards.length / 2);
        subfolders = [
          `${folder.name} Part 1`,
          `${folder.name} Part 2`
        ];
      }
    } else if (folderType === 'ai') {
      // For AI folders, use generated subfolders
      const generatedCards = generatedSubfolders[selectedFolder];
      subfolders = generatedCards || [];
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedFolder} Options
              {folderType === 'ai' && subfolders.length > 0 && <span className="ml-2 text-sm text-green-600">✨ AI Generated</span>}
            </h3>
            <p className="text-sm text-gray-600">
              Choose a communication category
              {loading && <span className="ml-2 text-blue-600">🤖 Generating AAC cards...</span>}
            </p>
          </div>
          <button
            onClick={handleBackToFolders}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     rounded-lg transition-colors text-sm font-medium text-gray-700"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating personalized AAC cards...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {folderType === 'local' ? (
              subfolders.map((subfolderName, index) => (
                <SubFolder
                  key={index}
                  name={subfolderName}
                  icon={index === 0 ? "📝" : "📋"}
                  description={`${subfolderName} communication cards`}
                  onClick={() => handleSubfolderSelect(subfolderName)}
                  isActive={false}
                />
              ))
            ) : (
              subfolders.map((subfolder, index) => (
                <SubFolder
                  key={index}
                  name={subfolder.name}
                  icon={subfolder.icon}
                  description={subfolder.description}
                  onClick={() => handleSubfolderSelect(subfolder)}
                  isActive={false}
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Main view: Show 6 folders (3 local + 3 AI)
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Communication Folders
        </h3>
        <p className="text-sm text-gray-600">
          Choose from local communication folders or AI-generated business cards
        </p>
      </div>
      
      <div className="grid grid-cols-6 gap-6">
        {/* Local Talk Folders (first 3) */}
        {localFolders.map((folder) => (
          <BusinessFolder
            key={`local-${folder.id}`}
            category={folder.name}
            icon={folder.icon}
            count="18 cards"
            onClick={() => handleLocalFolderSelect(folder.name)}
            isActive={false}
          />
        ))}
        
        {/* AI Business Categories (next 3) */}
        {businessCategories.map((cat, index) => (
          <BusinessFolder
            key={`ai-${index}`}
            category={cat.category}
            icon={cat.icon}
            count={`${cat.count} found`}
            onClick={() => handleBusinessCategorySelect(cat.category)}
            isActive={false}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            📱 Local Talk Folders
          </h4>
          <p className="text-sm text-blue-700">
            General communication cards for everyday use
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">
            🤖 AI Business Cards
          </h4>
          <p className="text-sm text-green-700">
            Context-specific cards for nearby businesses
          </p>
        </div>
      </div>
    </div>
  );
}

export default FolderNavigation;