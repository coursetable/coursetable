import clsx from 'clsx';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';

import styles from './mapMarkerIcon.module.css';

const markerIconCache = new Map<string, L.DivIcon>();
export function getMarkerIcon(variant: string) {
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
