import LocationCard from './LocationCard';

function CardGrid({ locations = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.length > 0 ? (
        locations.map((location, index) => (
          <LocationCard key={location.id || index} location={location} />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <div className="text-gray-500 text-lg">No locations found</div>
          <div className="text-gray-400 text-sm mt-2">
            Try adjusting your search criteria or location
          </div>
        </div>
      )}
    </div>
  );
}

export default CardGrid;