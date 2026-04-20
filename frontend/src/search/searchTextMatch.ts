import type { CatalogListing } from '../queries/api';
import { subjects } from '../utilities/constants';

/**
 * Returns true if the listing matches all search tokens (AND across tokens).
 * Tokens are expected to be lowercase.
 */
export function matchesSearchText(
  listing: CatalogListing,
  tokens: string[],
  options: { searchDescription: boolean },
): boolean {
  for (const token of tokens) {
    // First character of the course number
    const numberFirstChar = listing.number.charAt(0);
    if (
      listing.subject.toLowerCase().startsWith(token) ||
      listing.number.toLowerCase().startsWith(token) ||
      // For course numbers that start with a letter,
      // exclude this letter when comparing with the search token
      (/\D/u.test(numberFirstChar) &&
        listing.number
          .toLowerCase()
          .startsWith(numberFirstChar.toLowerCase() + token)) ||
      (options.searchDescription &&
        listing.course.description?.toLowerCase().includes(token)) ||
      listing.course.title.toLowerCase().includes(token) ||
      // Also match against department name ("Computer Science" for CPSC)
      subjects[listing.subject]?.toLowerCase().includes(token) ||
      listing.course.course_professors.some((p) =>
        p.professor.name.toLowerCase().includes(token),
      ) ||
      listing.course.course_meetings.some(({ location }) =>
        // Do not match on room numbers
        location?.building.code.toLowerCase().startsWith(token),
      )
    )
      continue;

    return false;
  }

  return true;
}
