import { useState, useEffect } from 'react';
import { getCurrentPosition } from '../services/location';

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const position = await getCurrentPosition();
        setLocation(position);
      } catch (err) {
        setError(err.message);
        setLocation({
          lat: 45.5190,
          lng: -122.6787
        });
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    getCurrentPosition()
      .then(setLocation)
      .catch((err) => {
        setError(err.message);
        setLocation({
          lat: 45.5190,
          lng: -122.6787
        });
      })
      .finally(() => setLoading(false));
  };

  return { location, loading, error, refetch };
}

export default useGeolocation;