import { getIconForText } from '../services/iconService';

function AACCard({ text, symbol, onPress, size = "medium", photo }) {
  const handleClick = () => {
    // Use enhanced voice service for better quality
    import('../services/voiceService').then(({ voiceService }) => {
      voiceService.speak(text, {
        rate: 0.85,
        pitch: 1.0,
        volume: 0.9
      });
    });
    
    if (onPress) {
      onPress(text);
    }
  };

  const sizeClasses = {
    small: "h-18 text-sm",
    medium: "h-24 text-base",
    large: "h-28 text-lg"
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} w-full bg-gradient-to-br from-purple-50 to-blue-50 
                 hover:from-purple-100 hover:to-blue-100 active:from-purple-200 active:to-blue-200 
                 border border-purple-200 hover:border-purple-300 rounded-xl 
                 flex flex-col items-center justify-center p-3 
                 transition-all duration-300 transform hover:scale-105 
                 shadow-lg hover:shadow-xl focus:outline-none 
                 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
    >
      <div className="mb-2 flex items-center justify-center">
        {photo ? (
          <img 
            src={photo} 
            alt={text}
            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
            onError={(e) => {
              // Fallback to icon if photo fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`${photo ? 'hidden' : 'flex'} items-center justify-center`}>
          {getIconForText(text, symbol)}
        </div>
      </div>
      <span className="text-center font-semibold leading-tight px-1 text-gray-800">
        {text}
      </span>
    </button>
  );
}

export default AACCard;