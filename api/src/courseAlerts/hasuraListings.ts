import { graphqlClient } from '../config.js';

const LISTINGS_FOR_ALERTS = `
query ListingsForCourseAlerts($listingIds: [Int!]!) {
  listings(where: { listing_id: { _in: $listingIds } }) {
    listing_id
    season_code
    crn
    course_code
    last_updated
    course {
      title
      last_updated
    }
  }
}
`;

export type ListingAlertRow = {
  listing_id: number;
  season_code: string;
  crn: number;
  course_code: string;
  last_updated: unknown;
  course: { title: string; last_updated: unknown };
};

export async function fetchListingsForAlerts(
  listingIds: number[],
): Promise<ListingAlertRow[]> {
  if (listingIds.length === 0) return [];
  const data = await graphqlClient.request<{
    listings: ListingAlertRow[];
  }>(LISTINGS_FOR_ALERTS, { listingIds });
  return data.listings;
}
