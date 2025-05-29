function AACCard({ text, symbol, onPress, size = "medium" }) {
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
      {symbol && (
        <span className="text-2xl mb-2" role="img" aria-label={text}>
          {symbol}
        </span>
      )}
      <span className="text-center font-semibold leading-tight px-1 text-gray-800">
        {text}
      </span>
    </button>
  );
}

export default AACCard;