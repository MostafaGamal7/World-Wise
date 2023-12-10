import { useState } from "react";

export function useGeolocation(defaultPosition = 0, isGetCount) {
  const [isLoading, setIsLoading] = useState(false);
  const [countClicks, setCountClicks] = useState(0);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  const { lat, lng } = position;

  function getPosition() {
    if (isGetCount) setCountClicks((count) => count + 1);

    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return {
    isLoading,
    countClicks,
    error,
    lat,
    lng,
    getPosition,
  };
}
