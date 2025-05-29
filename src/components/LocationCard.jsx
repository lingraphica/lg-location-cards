function LocationCard({ location }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-102 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {location?.name || 'Location Name'}
          </h3>
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <span className="mr-2">📍</span>
            {location?.address || '123 Example Street, City, State'}
          </p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              🚶 {location?.distance || '0.5'} mi
            </span>
            <span className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              ⭐ {location?.rating || '4.5'}/5
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
          {location?.category || 'Restaurant'}
        </span>
        <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
          Open Now
        </span>
      </div>
    </div>
  );
}

export default LocationCard;