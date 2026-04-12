import type { Crn, Season } from '../queries/graphql-types';

type WishlistListingRow = {
  courseCode: string;
  crn: Crn;
  listingId: number;
  season: Season;
  sameCourseId: number;
  title: string;
  profName?: string;
  avgWorkload?: number | null;
  avgRating?: number | null;
};

/** Enriched wishlist row (same-course grouped) for UI and helpers */
export type WishlistItemWithListings = {
  crn: Crn;
  courseCodes: string[];
  sameCourseId: number;
  season: Season;
  listings: WishlistListingRow[];
};
