export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = isDev
  ? 'https://localhost:3001'
  : import.meta.env.VITE_API_ENDPOINT;

export const GRAPHQL_API_ENDPOINT = isDev
  ? 'https://localhost:8085'
  : import.meta.env.VITE_API_ENDPOINT + '/ferry';

export const CUR_SEASON = '202401';
