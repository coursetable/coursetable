import type { CatalogListing } from '../queries/api';
import { subjects } from '../utilities/constants';

/**
 * Optimal String Alignment distance (transposition-aware edit distance).
 * Like Levenshtein but adjacent transpositions cost 1 instead of 2.
 */
function editDistance(a: string, b: string, maxDist: number): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > maxDist) return maxDist + 1;
  if (m === 0) return n;
  if (n === 0) return m;

  // Three rows for transposition lookback: pp (i-2), p (i-1), c (i)
  let pp: number[] = new Array<number>(n + 1);
  let p: number[] = new Array<number>(n + 1);
  let c: number[] = new Array<number>(n + 1);

  for (let j = 0; j <= n; j++) p[j] = j;

  for (let i = 1; i <= m; i++) {
    c[0] = i;
    for (let j = 1; j <= n; j++) {
      c[j] =
        a.charCodeAt(i - 1) === b.charCodeAt(j - 1)
          ? p[j - 1]!
          : 1 + Math.min(p[j - 1]!, p[j]!, c[j - 1]!);
      if (
        i > 1 &&
        j > 1 &&
        a.charCodeAt(i - 1) === b.charCodeAt(j - 2) &&
        a.charCodeAt(i - 2) === b.charCodeAt(j - 1)
      )
        c[j] = Math.min(c[j]!, pp[j - 2]! + 1);
    }
    const tmp = pp;
    pp = p;
    p = c;
    c = tmp;
  }

  return p[n]!;
}

/** True if token fuzzy-matches any whitespace-delimited word in text. */
function fuzzyMatchesAnyWord(
  token: string,
  text: string,
  maxDist: number,
): boolean {
  for (const word of text.toLowerCase().split(/\s+/u)) 
    if (word && editDistance(token, word, maxDist) <= maxDist) return true;
  
  return false;
}

// Common student shorthand → tokens to also try
const searchAliases: { [key: string]: readonly string[] } = {
  cs: ['cpsc'],
  orgo: ['organic'],
  polisci: ['plsc'],
};

// Match quality tiers (higher = stronger match)
const Q_EXACT = 4; // Subject/number/building prefix
const Q_NAME = 3; // Subject full name
const Q_SUBSTR = 2; // Title/professor/description substring
const Q_FUZZY = 1; // Typo tolerance

/** Returns the match quality for a single token (0 = no match). */
function tokenMatchesListing(
  token: string,
  listing: CatalogListing,
  options: { searchDescription: boolean },
): number {
  const numberFirstChar = listing.number.charAt(0);

  // Structural code matches
  if (
    listing.subject.toLowerCase().startsWith(token) ||
    listing.number.toLowerCase().startsWith(token) ||
    (/\D/u.test(numberFirstChar) &&
      listing.number
        .toLowerCase()
        .startsWith(numberFirstChar.toLowerCase() + token)) ||
    listing.course.course_meetings.some(({ location }) =>
      location?.building.code.toLowerCase().startsWith(token),
    )
  )
    return Q_EXACT;

  // Subject full name ("Computer Science" for CPSC)
  if (subjects[listing.subject]?.toLowerCase().includes(token)) return Q_NAME;

  // Content substring matches
  if (
    listing.course.title.toLowerCase().includes(token) ||
    (options.searchDescription &&
      listing.course.description?.toLowerCase().includes(token)) ||
    listing.course.course_professors.some((p) =>
      p.professor.name.toLowerCase().includes(token),
    )
  )
    return Q_SUBSTR;

  // Fuzzy fallback
  const maxDist = token.length <= 2 ? 0 : token.length <= 4 ? 1 : 2;
  if (maxDist > 0) {
    const subjectName = subjects[listing.subject];
    if (
      fuzzyMatchesAnyWord(token, listing.course.title, maxDist) ||
      (subjectName !== undefined &&
        fuzzyMatchesAnyWord(token, subjectName, maxDist)) ||
      listing.course.course_professors.some((p) =>
        fuzzyMatchesAnyWord(token, p.professor.name, maxDist),
      )
    )
      return Q_FUZZY;
  }

  return 0;
}

/**
 * Returns a match quality score for the listing against all search tokens.
 * 0 = no match; 1–4 = matched (higher = stronger).
 * Overall quality is the minimum across all tokens (AND semantics).
 */
export function searchMatchQuality(
  listing: CatalogListing,
  tokens: string[],
  options: { searchDescription: boolean },
): number {
  if (tokens.length === 0) return Q_EXACT;

  let min = Q_EXACT;
  for (const token of tokens) {
    let q = tokenMatchesListing(token, listing, options);

    // Alias expansion fallback
    if (q === 0) {
      const aliases = searchAliases[token];
      if (aliases) {
        for (const alias of aliases) {
          const aq = tokenMatchesListing(alias, listing, options);
          if (aq > 0) {
            q = aq;
            break;
          }
        }
      }
    }

    if (q === 0) return 0;
    if (q < min) min = q;
  }

  return min;
}

/**
 * Returns true if the listing matches all search tokens (AND across tokens).
 * Tokens are expected to be lowercase.
 */
export function matchesSearchText(
  listing: CatalogListing,
  tokens: string[],
  options: { searchDescription: boolean },
): boolean {
  return searchMatchQuality(listing, tokens, options) > 0;
}
