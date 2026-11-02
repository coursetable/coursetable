import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { useShallow } from 'zustand/react/shallow';

import buildingCoordinates from '../../../data/buildingCoordinates';
import { useWorksheetInfo } from '../../../hooks/useFerry';
import { useModalHistory } from '../../../hooks/useModalHistory';
import type { Season } from '../../../queries/graphql-types';
import { useStore } from '../../../store';
import {
  basemapAttribution,
  basemapUrl,
  groupCoursesByBuilding,
  type MarkerGroup,
} from '../../../utilities/map';
import { getMarkerIcon } from '../../Worksheet/mapMarkerIcon';
import styles from './BuildingMapPreview.module.css';

const MAX_FIT_ZOOM = 17;
// Leaves room for the marker height and the zoom control
const FIT_PADDING: [number, number] = [40, 48];

// The popover animates in, so the map may mount with a stale size
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const timeout = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(timeout);
  }, [map]);
  return null;
}

// Worksheet courses can arrive after mount, once the season's catalog loads
function FitBounds({ bounds }: { readonly bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, {
      padding: FIT_PADDING,
      maxZoom: MAX_FIT_ZOOM,
      animate: false,
    });
  }, [map, bounds]);
  return null;
}

function BuildingMapPreview({
  buildingCode,
  lat,
  lng,
  seasonCode,
}: {
  readonly buildingCode: string;
  readonly lat: number;
  readonly lng: number;
  readonly seasonCode: Season;
}) {
  const navigate = useNavigate();
  const { closeModal } = useModalHistory();
  const {
    worksheets,
    viewedPerson,
    viewedSeason,
    changeViewedPerson,
    changeViewedSeason,
    changeWorksheetView,
  } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      viewedPerson: state.viewedPerson,
      viewedSeason: state.viewedSeason,
      changeViewedPerson: state.changeViewedPerson,
      changeViewedSeason: state.changeViewedSeason,
      changeWorksheetView: state.changeWorksheetView,
    })),
  );
  const worksheetNumber = useStore((state) =>
    state.getRelevantWorksheetNumber(seasonCode),
  );
  const { data: courses } = useWorksheetInfo(
    worksheets,
    seasonCode,
    worksheetNumber,
  );

  const groups = useMemo((): MarkerGroup[] => {
    const { markers } = groupCoursesByBuilding(courses);
    if (markers.some((group) => group.code === buildingCode)) return markers;
    return [
      {
        code: buildingCode,
        name: buildingCoordinates[buildingCode]?.name ?? buildingCode,
        lat,
        lng,
        rooms: [],
        courses: [],
      },
      ...markers,
    ];
  }, [courses, buildingCode, lat, lng]);

  const bounds = useMemo(
    () => L.latLngBounds(groups.map((group) => [group.lat, group.lng])),
    [groups],
  );

  return (
    <>
      <MapContainer
        className={styles.map}
        center={[lat, lng]}
        zoom={MAX_FIT_ZOOM}
        attributionControl={false}
        keyboard={false}
      >
        <TileLayer
          url={basemapUrl(document.documentElement.dataset.theme)}
          attribution={basemapAttribution}
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={19}
        />
        {groups.map((group) => {
          // A course can meet in the same building more than once
          const courseCodes = [
            ...new Set(group.courses.map((c) => c.listing.course_code)),
          ];
          return (
            <Marker
              key={group.code}
              position={[group.lat, group.lng]}
              icon={getMarkerIcon(
                group.code === buildingCode ? 'hovered' : 'default',
              )}
            >
              <Tooltip direction="top" offset={[0, -41]}>
                <strong>{group.name}</strong>
                {courseCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </Tooltip>
            </Marker>
          );
        })}
        <FitBounds bounds={bounds} />
        <InvalidateSizeOnMount />
      </MapContainer>
      <div className={styles.footer}>
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            // Match what the pins show: the user's worksheet for this season
            if (viewedPerson !== 'me') changeViewedPerson('me');
            if (viewedSeason !== seasonCode) changeViewedSeason(seasonCode);
            changeWorksheetView('map');
            closeModal();
            void navigate('/worksheet');
          }}
        >
          Open worksheet map
        </Button>
        <div className={styles.attribution}>
          &copy; OpenStreetMap contributors &copy; CARTO
        </div>
      </div>
    </>
  );
}

export default BuildingMapPreview;
