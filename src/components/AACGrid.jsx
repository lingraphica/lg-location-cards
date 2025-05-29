import AACCard from './AACCard';

function AACGrid({ businesses = [], onCardPress }) {
  const generateCommunicationCards = (topBusinesses) => {
    if (!topBusinesses || topBusinesses.length === 0) {
      return [];
    }

    const cards = [
      { text: "I want to go", symbol: "🚗" },
      { text: "How far is it?", symbol: "📍" },
      { text: "What time do you close?", symbol: "🕐" },
      { text: "Do you have parking?", symbol: "🅿️" },
      { text: "I need help", symbol: "🙋" },
      { text: "Thank you", symbol: "🙏" },
      { text: "How much does it cost?", symbol: "💰" },
      { text: "I want to buy", symbol: "🛒" },
      { text: "Where is the bathroom?", symbol: "🚻" },
      { text: "I'm looking for", symbol: "👀" },
      { text: "Can you help me?", symbol: "❓" },
      { text: "I need directions", symbol: "🧭" },
      { text: "Is this available?", symbol: "✅" },
      { text: "I want to order", symbol: "📝" },
      { text: "How long will it take?", symbol: "⏰" },
      { text: "I'll come back later", symbol: "↩️" },
      { text: "Do you accept cards?", symbol: "💳" },
      { text: "Where do I pay?", symbol: "💵" },
      { text: "Can I make an appointment?", symbol: "📅" },
      { text: "Goodbye", symbol: "👋" }
    ];

    return cards;
  };

  const communicationCards = generateCommunicationCards(businesses.slice(0, 3));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Communication Cards
        </h3>
        <p className="text-sm text-gray-600">
          Tap any card to speak the phrase aloud
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {communicationCards.map((card, index) => (
          <AACCard
            key={index}
            text={card.text}
            symbol={card.symbol}
            onPress={onCardPress}
            size="medium"
          />
        ))}
      </div>
      
      {businesses.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Cards generated for nearby businesses:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {businesses.slice(0, 3).map((business, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {business.name} - {business.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AACGrid;