import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import { basemapAttribution, basemapUrl } from '../../../utilities/map';
import styles from './BuildingMapPreview.module.css';

const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// The popover animates in, so the map may mount with a stale size
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const timeout = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(timeout);
  }, [map]);
  return null;
}

function BuildingMapPreview({
  lat,
  lng,
}: {
  readonly lat: number;
  readonly lng: number;
}) {
  return (
    <MapContainer
      className={styles.map}
      center={[lat, lng]}
      zoom={17}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url={basemapUrl(document.documentElement.dataset.theme)}
        attribution={basemapAttribution}
        subdomains={['a', 'b', 'c', 'd']}
        maxZoom={19}
      />
      <Marker position={[lat, lng]} icon={icon} />
      <InvalidateSizeOnMount />
    </MapContainer>
  );
}

export default BuildingMapPreview;
