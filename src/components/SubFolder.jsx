function SubFolder({ name, icon, description, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-xl border transition-all duration-300 transform hover:scale-102 ${
        isActive 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg' 
          : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-lg shadow-md'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl flex-shrink-0" role="img" aria-label={name}>
          {icon}
        </div>
        <div className="text-left flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base mb-1 truncate">
            {name}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 text-gray-400">
          →
        </div>
      </div>
    </button>
  );
}

export default SubFolder;