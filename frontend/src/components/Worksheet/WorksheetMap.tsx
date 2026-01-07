import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { useShallow } from 'zustand/react/shallow';

import FriendsDropdown from './FriendsDropdown';
import SeasonDropdown from './SeasonDropdown';
import WorksheetCalendarList from './WorksheetCalendarList';
import WorksheetNumDropdown from './WorksheetNumberDropdown';
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
const PAN_BOUNDS_PAD = 0.35;
const MAX_BOUNDS_VISCOSITY = 0.9;
const ALLOW_ZOOM_OUT_STEPS = 1;
const INITIAL_RELAX_MS = 1000;

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

function ResetViewControl({
  initialBoundsRef,
  initialOptionsRef,
}: {
  readonly initialBoundsRef: MutableRefObject<L.LatLngBounds | null>;
  readonly initialOptionsRef: MutableRefObject<L.FitBoundsOptions | null>;
}) {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control({ position: 'topleft' });
    control.onAdd = () => {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', '', container);
      button.setAttribute('href', '#');
      button.setAttribute('role', 'button');
      button.setAttribute('aria-label', 'Reset view');
      button.innerHTML = '&#x2316;';
      button.style.fontSize = '18px';
      button.style.lineHeight = '26px';
      button.style.width = '30px';
      button.style.height = '30px';
      button.style.textAlign = 'center';
      button.style.textDecoration = 'none';
      button.style.color = '#2c3e50';
      button.style.background = '#fff';
      button.style.cursor = 'pointer';

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.on(button, 'click', L.DomEvent.stop);
      L.DomEvent.on(button, 'click', () => {
        if (!initialBoundsRef.current || !initialOptionsRef.current) return;
        map.fitBounds(initialBoundsRef.current, initialOptionsRef.current);
      });
      return container;
    };
    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map, initialBoundsRef, initialOptionsRef]);

  return null;
}

function ViewportGuards({
  bounds,
  markerLatLngs,
}: {
  readonly bounds: L.LatLngBounds | null;
  readonly markerLatLngs: L.LatLng[];
}) {
  const map = useMap();
  const correctingRef = useRef(false);
  const skipCorrectionRef = useRef(false);
  const initialBoundsRef = useRef<L.LatLngBounds | null>(null);
  const initialOptionsRef = useRef<L.FitBoundsOptions | null>(null);
  const priorMinZoomRef = useRef<number | null>(null);
  const priorViscosityRef = useRef<number | undefined>(undefined);
  const fitTimeoutRef = useRef<number | null>(null);
  const relaxTimeoutRef = useRef<number | null>(null);
  const relaxGuardsRef = useRef(false);
  const pendingFitRef = useRef(true);

  const getPadding = useCallback(() => {
    const size = map.getSize();
    return [Math.max(size.x * 0.08, 40), Math.max(size.y * 0.08, 40)] as [
      number,
      number,
    ];
  }, [map]);

  const applyFitBounds = useCallback(
    (animate: boolean) => {
      if (!bounds) return;
      const padding = getPadding();
      initialBoundsRef.current = bounds;
      initialOptionsRef.current = { padding, maxZoom: 17 };

      map.fitBounds(bounds, { padding, maxZoom: 17, animate });
      map.setMaxBounds(bounds.pad(PAN_BOUNDS_PAD));
      if (priorViscosityRef.current === undefined)
        priorViscosityRef.current = map.options.maxBoundsViscosity;

      L.Util.setOptions(map, { maxBoundsViscosity: MAX_BOUNDS_VISCOSITY });

      if (priorMinZoomRef.current === null)
        priorMinZoomRef.current = map.getMinZoom();
      if (fitTimeoutRef.current) window.clearTimeout(fitTimeoutRef.current);

      fitTimeoutRef.current = window.setTimeout(() => {
        const currentZoom = map.getZoom();
        map.setMinZoom(Math.max(0, currentZoom - ALLOW_ZOOM_OUT_STEPS));
      }, 0);
      skipCorrectionRef.current = true;
    },
    [bounds, getPadding, map],
  );

  const startRelax = useCallback((onFinish?: () => void) => {
    relaxGuardsRef.current = true;
    if (relaxTimeoutRef.current) window.clearTimeout(relaxTimeoutRef.current);

    relaxTimeoutRef.current = window.setTimeout(() => {
      relaxGuardsRef.current = false;
      onFinish?.();
    }, INITIAL_RELAX_MS);
  }, []);

  useEffect(() => {
    if (!bounds) {
      if (fitTimeoutRef.current) {
        window.clearTimeout(fitTimeoutRef.current);
        fitTimeoutRef.current = null;
      }
      if (relaxTimeoutRef.current) {
        window.clearTimeout(relaxTimeoutRef.current);
        relaxTimeoutRef.current = null;
      }
      if (priorMinZoomRef.current !== null)
        map.setMinZoom(priorMinZoomRef.current);

      if (priorViscosityRef.current !== undefined) {
        L.Util.setOptions(map, {
          maxBoundsViscosity: priorViscosityRef.current,
        });
      }
      map.setMaxBounds(undefined);
      return () => {};
    }

    const size = map.getSize();
    if (size.x > 0 && size.y > 0) {
      applyFitBounds(false);
      pendingFitRef.current = false;
      startRelax();
    } else {
      pendingFitRef.current = true;
      startRelax();
    }
    const handleResize = () => {
      const nextSize = map.getSize();
      if (nextSize.x > 0 && nextSize.y > 0 && pendingFitRef.current) {
        startRelax(() => {
          applyFitBounds(false);
          pendingFitRef.current = false;
        });
        return;
      }
      if (nextSize.x > 0 && nextSize.y > 0) {
        applyFitBounds(false);
        startRelax();
      }
    };
    map.on('resize', handleResize);

    return () => {
      map.off('resize', handleResize);
      if (fitTimeoutRef.current) {
        window.clearTimeout(fitTimeoutRef.current);
        fitTimeoutRef.current = null;
      }
      if (relaxTimeoutRef.current) {
        window.clearTimeout(relaxTimeoutRef.current);
        relaxTimeoutRef.current = null;
      }
    };
  }, [applyFitBounds, bounds, map, startRelax]);

  useEffect(() => {
    if (!bounds || !markerLatLngs.length) return () => {};

    const handleViewChange = () => {
      if (relaxGuardsRef.current) return;
      if (skipCorrectionRef.current) {
        skipCorrectionRef.current = false;
        return;
      }
      if (correctingRef.current) {
        correctingRef.current = false;
        return;
      }
      const view = map.getBounds();
      if (markerLatLngs.some((latLng) => view.contains(latLng))) return;

      const center = map.getCenter();
      const nearest = markerLatLngs.reduce((closest, current) =>
        center.distanceTo(current) < center.distanceTo(closest)
          ? current
          : closest,
      );
      correctingRef.current = true;
      map.panInside(nearest, { padding: getPadding(), animate: true });
    };

    map.on('moveend', handleViewChange);
    map.on('zoomend', handleViewChange);
    return () => {
      map.off('moveend', handleViewChange);
      map.off('zoomend', handleViewChange);
    };
  }, [bounds, getPadding, map, markerLatLngs]);

  useEffect(
    () => () => {
      if (priorMinZoomRef.current !== null)
        map.setMinZoom(priorMinZoomRef.current);

      if (priorViscosityRef.current !== undefined) {
        L.Util.setOptions(map, {
          maxBoundsViscosity: priorViscosityRef.current,
        });
      }
      map.setMaxBounds(undefined);
    },
    [map],
  );

  return (
    <ResetViewControl
      initialBoundsRef={initialBoundsRef}
      initialOptionsRef={initialOptionsRef}
    />
  );
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
  const { courses, hoverCourse, isMobile, isExoticWorksheet } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      hoverCourse: state.hoverCourse,
      isMobile: state.isMobile,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
    })),
  );

  const { markers, missing } = useLocationGroups(courses);
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const highlightTimeout = useRef<number | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const hasLoadedOnce = useRef(false);
  const spinnerTimeoutRef = useRef<number | null>(null);

  // Only show spinner after 0.5s of loading to avoid flash on cached loads
  useEffect(() => {
    if (mapLoading) {
      spinnerTimeoutRef.current = window.setTimeout(() => {
        setShowSpinner(true);
      }, 500);
    } else {
      if (spinnerTimeoutRef.current) {
        window.clearTimeout(spinnerTimeoutRef.current);
        spinnerTimeoutRef.current = null;
      }
      setShowSpinner(false);
    }
    return () => {
      if (spinnerTimeoutRef.current) 
        window.clearTimeout(spinnerTimeoutRef.current);
      
    };
  }, [mapLoading]);

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
  const markerLatLngs = useMemo(
    () => markers.map((marker) => L.latLng(marker.lat, marker.lng)),
    [markers],
  );

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
      {isMobile && !isExoticWorksheet && (
        <div className={styles.dropdowns}>
          <WorksheetNumDropdown mobile />
          <div className="d-flex">
            <SeasonDropdown mobile />
            <FriendsDropdown mobile />
          </div>
        </div>
      )}
      <SurfaceComponent className={styles.mapCard}>
        {markers.length ? (
          <>
            <div
              className={clsx(
                styles.mapWrapper,
                mapLoading && styles.mapBlurred,
              )}
            >
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
                  eventHandlers={{
                    load() {
                      if (!hasLoadedOnce.current) {
                        hasLoadedOnce.current = true;
                        setMapLoading(false);
                      }
                    },
                  }}
                />
                {markers.map((group) => {
                  const isHovered =
                    hoverCourse &&
                    group.courses.some((course) => course.crn === hoverCourse);
                  const isSelected = highlightedCode === group.code;
                  const variant =
                    (isSelected ? 'selected' : '') +
                    (isHovered ? '-hovered' : '');
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
                <ViewportGuards bounds={bounds} markerLatLngs={markerLatLngs} />
                <MapClickReset onReset={() => setTemporaryHighlight(null)} />
              </MapContainer>
            </div>
            {showSpinner && (
              <div
                className={clsx(
                  styles.mapLoadingOverlay,
                  !mapLoading && styles.mapLoadingOverlayHidden,
                )}
              >
                <div className={styles.mapLoadingSpinner} />
                <span className={styles.mapLoadingText}>Loading map...</span>
              </div>
            )}
          </>
        ) : (
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
