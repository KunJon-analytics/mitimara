"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// A "provider" is used to encapsulate only the
// components that needs the state in this context
type LocationType = { latitude: number | null; longitude: number | null };

type LocationContextType = {
  location: LocationType;
  loading: boolean;
  getLocation: () => void;
  error: string | null;
};

type LocationProviderProps = {
  children: ReactNode;
  locationTimeout?: number;
};

const defaultTimeout = 10 * 1000; // defaults to a 10s tiemout

export const LocationContext = createContext<LocationContextType | null>(null);

export function LocationProvider({
  children,
  locationTimeout,
}: LocationProviderProps) {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  const [watcher, setWatcher] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearWatch = () => {
    if (watcher !== null) {
      navigator.geolocation.clearWatch(watcher);
    }
    clearTimeout(timer);
    setWatcher(null);
    setTimer(undefined);
  };

  const handleLocationSuccess: PositionCallback = ({
    coords: { latitude, longitude },
  }) => {
    clearWatch();
    setLocation({ latitude, longitude });
    setLoading(false);
    setError(null);
  };

  const handleLocationError: PositionErrorCallback = (error) => {
    clearWatch();
    setLocation({ latitude: null, longitude: null });
    setLoading(false);
    setError(error.message);
  };

  const getLocation = useCallback(() => {
    const timeout = setTimeout(() => {
      clearWatch();
      setLoading(false);
    }, locationTimeout || defaultTimeout);
    setTimer(timeout);
    if (navigator.geolocation) {
      const locationWatchId = navigator.geolocation.watchPosition(
        handleLocationSuccess,
        handleLocationError,
        { enableHighAccuracy: true }
      );
      setLoading(true);
      setError(null);
      setWatcher(locationWatchId);
    } else {
      clearWatch();
      setError("Geolocation is not currently supported by your browser.");
    }
  }, [locationTimeout, clearWatch, handleLocationError, handleLocationSuccess]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <LocationContext.Provider value={{ loading, location, getLocation, error }}>
      {children}
    </LocationContext.Provider>
  );
}

const useCurrentLocation = () => {
  const locationContext = useContext(LocationContext);

  if (!locationContext) {
    throw new Error(
      "useClient has to be used within <LocationContext.Provider>"
    );
  }

  return locationContext;
};

export default useCurrentLocation;
