import { CARTO_API_KEY } from '../config';

export const basemapUrl = (theme: string | undefined) =>
  `https://{s}.basemaps.cartocdn.com/${
    theme === 'dark' ? 'dark_all' : 'light_all'
  }/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;

export const basemapAttribution =
  '&copy; OpenStreetMap contributors &copy; CARTO';
