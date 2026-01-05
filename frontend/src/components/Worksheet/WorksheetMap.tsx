import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';

import WorksheetCalendarList from './WorksheetCalendarList';
import WorksheetStats from './WorksheetStats';
import buildingCoordinates from '../../data/buildingCoordinates';
import type { WorksheetCourse } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { SurfaceComponent } from '../Typography';

import styles from './WorksheetMap.module.css';

type MarkerGroup = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  rooms: string[];
  courses: WorksheetCourse[];
};

type MissingGroup = {
  code: string;
  name: string;
  count: number;
};

const defaultCenter: [number, number] = [41.313389, -72.925];
const HIGHLIGHT_DURATION_MS = 1800;

const markerIconCache = new Map<string, L.DivIcon>();
function getMarkerIcon(variant: string) {
  const markerImgClass = styles.markerImg ?? '';
  const markerInnerClass = styles.markerInner ?? '';
  if (!markerIconCache.has(variant)) {
    const wrapperClass = clsx(
      styles.markerIconWrapper,
      variant.includes('selected') && styles.markerIconSelected,
      variant.includes('hovered') && styles.markerIconHovered,
    );
    const html = `
      <div class="${wrapperClass}">
        <img class="${markerImgClass}" src="${markerIcon}" srcset="${markerIcon2x} 2x" alt="" />
        <span class="${markerInnerClass}"></span>
      </div>
    `;
    markerIconCache.set(
      variant,
      L.divIcon({
        className: styles.markerIconContainer,
        html,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    );
  }
  return markerIconCache.get(variant)!;
}

function FitBounds({ bounds }: { readonly bounds: L.LatLngBounds | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    const size = map.getSize();
    const padding: [number, number] = [
      Math.max(size.x * 0.08, 40),
      Math.max(size.y * 0.08, 40),
    ];
    map.fitBounds(bounds, { padding, maxZoom: 17 });
  }, [bounds, map]);
  return null;
}

function MapClickReset({ onReset }: { readonly onReset: () => void }) {
  useMapEvent('click', () => onReset());
  return null;
}

function useLocationGroups(courses: WorksheetCourse[]) {
  return useMemo(() => {
    const grouped = new Map<string, MarkerGroup>();
    const missing = new Map<string, MissingGroup>();

    for (const course of courses) {
      if (course.hidden) continue;
      for (const meeting of course.listing.course.course_meetings) {
        const { location } = meeting;
        if (!location) continue;
        const buildingCode = location.building.code;
        const buildingInfo = buildingCoordinates[buildingCode];
        if (!buildingInfo) {
          const friendlyName = buildingCode;
          const existing = missing.get(buildingCode) ?? {
            code: buildingCode,
            name: friendlyName,
            count: 0,
          };
          existing.count += 1;
          missing.set(buildingCode, existing);
          continue;
        }

        const group =
          grouped.get(buildingCode) ??
          ({
            code: buildingCode,
            name: buildingInfo.name ?? buildingCode,
            lat: buildingInfo.lat,
            lng: buildingInfo.lng,
            rooms: [],
            courses: [],
          } as MarkerGroup);
        if (meeting.location?.room) {
          if (!group.rooms.includes(meeting.location.room))
            group.rooms.push(meeting.location.room);
        }
        group.courses.push(course);
        grouped.set(buildingCode, group);
      }
    }

    const markers = [...grouped.values()].sort(
      (a, b) => b.courses.length - a.courses.length,
    );
    const missingList = [...missing.values()].sort((a, b) => b.count - a.count);
    return { markers, missing: missingList };
  }, [courses]);
}

function MarkerPopup({ group }: { readonly group: MarkerGroup }) {
  return (
    <div className={styles.popupContent}>
      <strong>{group.name}</strong>
      {group.rooms.length > 0 && (
        <div className={styles.popupRooms}>
          Rooms:{' '}
          {group.rooms.length > 3
            ? `${group.rooms.slice(0, 3).join(', ')}…`
            : group.rooms.join(', ')}
        </div>
      )}
      <ul className={styles.popupCourseList}>
        {group.courses.slice(0, 4).map((course) => (
          <li key={`${group.code}-${course.crn}`}>
            {course.listing.course_code}: {course.listing.course.title}
          </li>
        ))}
        {group.courses.length > 4 && <li>+{group.courses.length - 4} more…</li>}
      </ul>
    </div>
  );
}

function WorksheetMap() {
  const courses = useStore((state) => state.courses);
  const hoverCourse = useStore((state) => state.hoverCourse);

  const { markers, missing } = useLocationGroups(courses);
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const highlightTimeout = useRef<number | null>(null);

  const setTemporaryHighlight = useCallback((code: string | null) => {
    if (highlightTimeout.current) {
      window.clearTimeout(highlightTimeout.current);
      highlightTimeout.current = null;
    }
    setHighlightedCode(code);
    if (code) {
      highlightTimeout.current = window.setTimeout(() => {
        setHighlightedCode(null);
        highlightTimeout.current = null;
      }, HIGHLIGHT_DURATION_MS);
    }
  }, []);

  useEffect(
    () => () => {
      if (highlightTimeout.current)
        window.clearTimeout(highlightTimeout.current);
    },
    [],
  );

  useEffect(() => {
    if (
      highlightedCode &&
      !markers.some((marker) => marker.code === highlightedCode)
    )
      setHighlightedCode(null);
  }, [markers, highlightedCode]);

  const missingBuildingCodes = useMemo(
    () => new Set(missing.map((entry) => entry.code)),
    [missing],
  );

  const bounds = useMemo(() => {
    if (!markers.length) return null;
    return L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng]));
  }, [markers]);

  const [tileUrl, setTileUrl] = useState(() => {
    const currentTheme = document.documentElement.dataset.theme;
    return currentTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  });

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const nextTheme = root.dataset.theme;
      setTileUrl(
        nextTheme === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      );
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  const tileAttribution = '&copy; OpenStreetMap contributors &copy; CARTO';

  return (
    <div className={styles.container}>
      <SurfaceComponent className={styles.mapCard}>
        <MapContainer
          className={styles.map}
          center={defaultCenter}
          zoom={15}
          bounds={bounds ?? undefined}
          scrollWheelZoom
          preferCanvas
        >
          <TileLayer
            key={tileUrl}
            url={tileUrl}
            attribution={tileAttribution}
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={19}
          />
          {markers.map((group) => {
            const isHovered =
              hoverCourse &&
              group.courses.some((course) => course.crn === hoverCourse);
            const isSelected = highlightedCode === group.code;
            const variant =
              (isSelected ? 'selected' : '') + (isHovered ? '-hovered' : '');
            return (
              <Marker
                key={group.code}
                position={[group.lat, group.lng]}
                icon={getMarkerIcon(variant || 'default')}
                eventHandlers={{
                  click: () => setTemporaryHighlight(group.code),
                }}
              >
                <Popup>
                  <MarkerPopup group={group} />
                </Popup>
              </Marker>
            );
          })}
          {bounds && <FitBounds bounds={bounds} />}
          <MapClickReset onReset={() => setTemporaryHighlight(null)} />
        </MapContainer>

        {!markers.length && (
          <div className={styles.mapEmptyState}>
            <p>No mappable course locations yet.</p>
            <p className="mb-0 text-muted">
              Add courses with meeting locations to see them on the map.
            </p>
          </div>
        )}
      </SurfaceComponent>

      <div className={styles.sidebar}>
        <WorksheetStats />
        <WorksheetCalendarList
          showLocation
          showMissingLocationIcon
          highlightBuilding={highlightedCode}
          controlsMode="map"
          hideTooltipContext="map"
          missingBuildingCodes={missingBuildingCodes}
        />
      </div>
    </div>
  );
}

export default WorksheetMap;
