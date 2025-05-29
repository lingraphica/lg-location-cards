function BusinessFolder({ category, icon, count, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg' 
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg shadow-md'
      }`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="text-4xl mb-1" role="img" aria-label={category}>
          {icon}
        </div>
        <div className="text-center">
          <h3 className="font-bold text-gray-900 text-base mb-1">
            {category}
          </h3>
          <p className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {count} nearby
          </p>
        </div>
      </div>
    </button>
  );
}

export default BusinessFolder;