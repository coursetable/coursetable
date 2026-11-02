import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';

import { useLocationGroups } from '../../../hooks/useLocationGroups';
import { useStore } from '../../../store';
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
  buildingCode,
  lat,
  lng,
}: {
  readonly buildingCode: string;
  readonly lat: number;
  readonly lng: number;
}) {
  const navigate = useNavigate();
  const { courses, changeWorksheetView } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      changeWorksheetView: state.changeWorksheetView,
    })),
  );
  const { markers } = useLocationGroups(courses);
  const otherMarkers = useMemo(
    () => markers.filter((group) => group.code !== buildingCode),
    [markers, buildingCode],
  );

  return (
    <div>
      <MapContainer
        className={styles.map}
        center={[lat, lng]}
        zoom={16}
        zoomControl
        attributionControl={false}
        scrollWheelZoom
      >
        <TileLayer
          url={basemapUrl(document.documentElement.dataset.theme)}
          attribution={basemapAttribution}
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />
        {otherMarkers.map((group) => (
          <CircleMarker
            key={group.code}
            center={[group.lat, group.lng]}
            radius={7}
            pathOptions={{ className: styles.otherMarker }}
          >
            <Tooltip>
              <strong>{group.name}</strong>
              <div>
                {group.courses
                  .slice(0, 3)
                  .map((course) => course.listing.course_code)
                  .join(', ')}
                {group.courses.length > 3 && ` +${group.courses.length - 3}`}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
        <Marker position={[lat, lng]} icon={icon} zIndexOffset={1000} />
        <InvalidateSizeOnMount />
      </MapContainer>
      <div className={styles.footer}>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            changeWorksheetView('map');
            void navigate('/worksheet');
          }}
        >
          Open worksheet map
        </Button>
        <div className={styles.caption}>
          {otherMarkers.length > 0 && (
            <div>
              <span className={styles.legendDot} /> Your worksheet classes
            </div>
          )}
          <div>{basemapAttribution}</div>
        </div>
      </div>
    </div>
  );
}

export default BuildingMapPreview;
