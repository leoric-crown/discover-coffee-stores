import { useState } from "react";

const useLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLongResult, setLatLongResult] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const handleLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLatLongResult(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsFindingLocation(false);
  };
  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  return {
    latLongResult,
    handleLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useLocation;
