import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeolocation";
import Button from "../components/Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

const parisLatLng = [21.153676882284522, 79.07032012939455];

function Map() {
    const { cities } = useCities();
    const [mapLat, mapLng] = useUrlPosition();
    const [mapPosition, setMapPosition] = useState(parisLatLng);

    const {
        position: geoLocationPosition,
        isLoading: isLoadingPosition,
        getGeoLocation,
    } = useGeoLocation();

    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            if (geoLocationPosition)
                setMapPosition([
                    geoLocationPosition.lat,
                    geoLocationPosition.lng,
                ]);
        },
        [geoLocationPosition]
    );

    return (
        <div className={styles.mapContainer}>
            {!geoLocationPosition && (
                <Button type="position" onClick={getGeoLocation}>
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            )}

            <MapContainer
                className={styles.map}
                center={mapPosition}
                zoom={5}
                scrollWheelZoom={true}
            >
                <ChangeCenter position={mapPosition} />
                <DetectClick />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(function (city) {
                    return (
                        <Marker
                            position={[city.position.lat, city.position.lng]}
                            key={city.id}
                        >
                            <Popup>
                                <span>{city.emoji}</span>
                                <span>{city.cityName}</span>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);

    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    });
}

export default Map;
