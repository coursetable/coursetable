import { getListingId } from './course';
import type { Crn, Season } from '../queries/graphql-types';

/** Parses `course-modal` query value like `202501-12345` into listing ids. */
export function parseCourseModalQuery(courseModalQuery: string | null):
  | {
      seasonCode: Season;
      crn: Crn;
      listingId: number;
    }
  | undefined {
  if (!courseModalQuery || !/^\d{6}-\d{5}$/u.test(courseModalQuery))
    return undefined;
  const [seasonCode, crn] = courseModalQuery.split('-') as [Season, string];
  if (!seasonCode || !crn) return undefined;
  const crnNum = Number.parseInt(crn, 10) as Crn;
  return {
    seasonCode,
    crn: crnNum,
    listingId: getListingId(seasonCode, crnNum),
  };
}
