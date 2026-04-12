import seasonsData from '../generated/seasons.json';
import type { Season } from '../queries/graphql-types';

export const seasons = seasonsData as Season[];
