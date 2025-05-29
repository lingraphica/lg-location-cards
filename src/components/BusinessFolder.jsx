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
      <div className={`relative mt-3 h-28 bg-gradient-to-b from-slate-200 to-slate-300 rounded-lg border border-slate-500 shadow-lg z-10
        ${isActive ? 'from-blue-200 to-blue-300 border-blue-600' : 'hover:from-slate-100 hover:to-slate-200'}`}>
        
        {/* Folder content */}
        <div className="flex flex-col items-center justify-center h-full p-3">
          <div className="text-3xl mb-1" role="img" aria-label={category}>
            {icon}
          </div>
          <h3 className="font-bold text-gray-800 text-sm text-center leading-tight">
            {category}
          </h3>
          <p className="text-xs text-gray-600 mt-1 text-center leading-tight">
            {count.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < count.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </button>
  );
}

export default BusinessFolder;