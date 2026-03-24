import type { CatalogListing } from '../queries/api';
import type { Crn } from '../queries/graphql-types';

export interface WorksheetCourse {
  crn: Crn;
  color: string;
  listing: CatalogListing;
  hidden: boolean | null;
}
