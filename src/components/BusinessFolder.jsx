function BusinessFolder({ category, icon, count, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full transition-all duration-200 hover:scale-105 ${
        isActive ? 'z-10' : ''
      }`}
    >
      {/* Folder tab */}
      <div className="absolute top-0 left-4 w-16 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-lg border-t border-l border-r border-slate-500 z-0"></div>
      
      {/* Folder body */}
      <div className={`relative mt-3 h-28 bg-gradient-to-b rounded-lg border shadow-lg z-10 ${
        isActive 
          ? 'from-slate-600 to-slate-700 border-slate-800 shadow-slate-400' 
          : 'from-slate-200 to-slate-300 border-slate-500 hover:from-slate-100 hover:to-slate-200'
      }`}>
        
        {/* Folder content */}
        <div className="flex flex-col items-center justify-center h-full p-3">
          <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
            <div className="text-4xl" role="img" aria-label={category}>
              {icon}
            </div>
          </div>
          <h3 className={`font-bold text-sm text-center leading-tight ${
            isActive ? 'text-white' : 'text-gray-800'
          }`}>
            {category}
          </h3>
        </div>
      </div>
    </button>
  );
}

export default BusinessFolder;