import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import useURLPosition from "../hooks/useURLPosition";

import Button from "./Button";

/* eslint-disable*/

function Map() {
  const [mapPosition, setMapPosition] = useState([
    30.0405664305846, 31.267089843750004,
  ]);
  const { cities } = useCities();
  const {
    isLoading: isLoadingLocation,
    lat: latPosition,
    lng: lngPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useURLPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (latPosition && lngPosition)
        setMapPosition([latPosition, lngPosition]);
    },
    [latPosition, lngPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!latPosition && !lngPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingLocation ? (
            <span>Loading...</span>
          ) : (
            <span>Use your position</span>
          )}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenterPosition position={mapPosition} />
        <ClickPosition />
      </MapContainer>
    </div>
  );
}

function ChangeCenterPosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function ClickPosition() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
