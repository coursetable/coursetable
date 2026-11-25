import type { CatalogListing } from '../queries/api';
import type { Crn } from '../queries/graphql-types';

export interface WorksheetCourse {
  crn: Crn;
  color: string;
  // Position of the color in the worksheet's theme; null for custom colors
  colorIndex: number | null;
  listing: CatalogListing;
  hidden: boolean | null;
}
