import { useState } from 'react';
import BusinessFolder from './BusinessFolder';
import AACCard from './AACCard';
import { getTalkFolders } from '../data/talkFolders';

function FolderNavigation({ onCardPress }) {
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Get first 6 local Talk folders
  const localFolders = getTalkFolders().slice(0, 6);
  
  // Get cards from first folder to fill remaining grid spaces
  const defaultCards = getTalkFolders()[0]?.cards.slice(0, 18) || [];

  const handleFolderSelect = (folder) => {
    setSelectedFolder(selectedFolder?.id === folder.id ? null : folder);
  };

  const handleBackToMain = () => {
    setSelectedFolder(null);
  };

  // Show folder contents when selected
  if (selectedFolder) {
    const cards = selectedFolder.cards || [];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedFolder.name} Cards
          </h3>
          <button
            onClick={handleBackToMain}
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

  // Main 6x4 grid: 6 folders + 18 cards
  return (
    <div className="grid grid-cols-6 gap-3">
      {/* First row: 6 local folders */}
      {localFolders.map((folder) => (
        <BusinessFolder
          key={folder.id}
          category={folder.name}
          icon={folder.icon}
          count={`${folder.cards?.length || 0} cards`}
          onClick={() => handleFolderSelect(folder)}
          isActive={selectedFolder?.id === folder.id}
        />
      ))}
      
      {/* Remaining 3 rows: 18 cards from default folder */}
      {defaultCards.map((card, index) => (
        <AACCard
          key={`default-${index}`}
          text={card.text}
          symbol={card.symbol}
          onPress={onCardPress}
          size="medium"
        />
      ))}
    </div>
  );
}

export default FolderNavigation;