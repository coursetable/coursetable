import chroma from 'chroma-js';
import type {
  ListingFragment,
  ListingRatingsFragment,
} from '../generated/graphql';

// TODO: api should provide a typing SDK
export type Listing = ListingFragment & ListingRatingsFragment;

export function isEqual<T>(a: T, b: T): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => isEqual(b[i], x));
  } else if (a && typeof a === 'object' && b && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) => isEqual(a[key as never], b[key as never]));
  }
  return a === b;
}
// Stable based on crn and season
const startColor = '#aab8c2'; // Lighter grey
const endColor = '#7eb6ff'; // Lighter blue
export function generateRandomColor(identifier: string) {
  // Calculate a hash from the identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  // Normalize the hash to a value between 0 and 1
  // to use it for color interpolation
  const normalizedHash = (Math.abs(hash) % 1000) / 1000;

  // Interpolate between startColor and endColor based on normalizedHash
  return chroma.scale([startColor, endColor])(normalizedHash);
}
