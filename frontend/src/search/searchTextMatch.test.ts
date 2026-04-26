import { describe, it, expect } from 'vitest';
import { matchesSearchText, searchMatchQuality } from './searchTextMatch';
import type { CatalogListing } from '../queries/api';
import type { Crn } from '../queries/graphql-types';

function makeListing(
  overrides: {
    subject?: string;
    number?: string;
    title?: string;
    description?: string | null;
    professors?: string[];
    buildingCodes?: string[];
  } = {},
): CatalogListing {
  return {
    subject: overrides.subject ?? 'CPSC',
    number: overrides.number ?? '201',
    course_code: `${overrides.subject ?? 'CPSC'} ${overrides.number ?? '201'}`,
    crn: 10001 as unknown as Crn,
    school: 'YC',
    course: {
      title: overrides.title ?? 'Introduction to Computer Science',
      description: overrides.description ?? null,
      course_professors: (overrides.professors ?? []).map((name) => ({
        professor: { professor_id: 1, name },
      })),
      course_meetings: (overrides.buildingCodes ?? []).map((code) => ({
        days_of_week: 0,
        start_time: '10:00',
        end_time: '11:00',
        location: { room: '101', building: { code } },
      })),
    },
  } as unknown as CatalogListing;
}

const defaultOpts = { searchDescription: false };
const withDescription = { searchDescription: true };

// Existing matching behavior

describe('matchesSearchText — subject code prefix matching', () => {
  it('matches subject code by prefix (lowercase token)', () => {
    const listing = makeListing({ subject: 'CPSC' });
    expect(matchesSearchText(listing, ['cpsc'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cps'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cp'], defaultOpts)).toBe(true);
  });

  it('is case insensitive', () => {
    const listing = makeListing({ subject: 'CPSC' });
    expect(matchesSearchText(listing, ['cpsc'], defaultOpts)).toBe(true);
    expect(
      matchesSearchText(listing, ['CPSC'.toLowerCase()], defaultOpts),
    ).toBe(true);
  });

  it('does not match a non-prefix of the subject code', () => {
    const listing = makeListing({ subject: 'CPSC' });
    expect(matchesSearchText(listing, ['psc'], defaultOpts)).toBe(false);
  });
});

describe('matchesSearchText — course number prefix matching', () => {
  it('matches course number by prefix', () => {
    const listing = makeListing({ number: '201' });
    expect(matchesSearchText(listing, ['201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['20'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['2'], defaultOpts)).toBe(true);
  });

  it('handles letter-prefix course numbers', () => {
    // "S470": searching "470" matches because the leading letter is stripped
    const listing = makeListing({ number: 'S470' });
    expect(matchesSearchText(listing, ['470'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['s470'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['s4'], defaultOpts)).toBe(true);
  });
});

describe('matchesSearchText — title substring matching', () => {
  it('matches a substring in the title', () => {
    const listing = makeListing({ title: 'Introduction to Computer Science' });
    expect(matchesSearchText(listing, ['introduction'], defaultOpts)).toBe(
      true,
    );
    expect(matchesSearchText(listing, ['intro'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['computer'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['science'], defaultOpts)).toBe(true);
  });

  it('does not match text not in the title', () => {
    const listing = makeListing({ title: 'Data Structures' });
    expect(matchesSearchText(listing, ['algorithms'], defaultOpts)).toBe(false);
  });
});

describe('matchesSearchText — description matching', () => {
  it('does not search description when option is false', () => {
    const listing = makeListing({
      title: 'Intro',
      description: 'This course covers algorithms',
    });
    expect(matchesSearchText(listing, ['algorithms'], defaultOpts)).toBe(false);
  });

  it('searches description when option is true', () => {
    const listing = makeListing({
      title: 'Intro',
      description: 'This course covers algorithms',
    });
    expect(matchesSearchText(listing, ['algorithms'], withDescription)).toBe(
      true,
    );
  });
});

describe('matchesSearchText — professor name matching', () => {
  it('matches a substring of a professor name', () => {
    const listing = makeListing({ professors: ['Dana Angluin'] });
    expect(matchesSearchText(listing, ['angluin'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['dana'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['ang'], defaultOpts)).toBe(true);
  });

  it('does not match a professor not on the course', () => {
    const listing = makeListing({ professors: ['Dana Angluin'] });
    expect(matchesSearchText(listing, ['einstein'], defaultOpts)).toBe(false);
  });
});

describe('matchesSearchText — building code prefix matching', () => {
  it('matches building code by prefix', () => {
    const listing = makeListing({ buildingCodes: ['WTS'] });
    expect(matchesSearchText(listing, ['wts'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['wt'], defaultOpts)).toBe(true);
  });

  it('does not match a non-prefix of building code', () => {
    const listing = makeListing({ buildingCodes: ['WTS'] });
    expect(matchesSearchText(listing, ['ts'], defaultOpts)).toBe(false);
  });
});

describe('matchesSearchText — multi-token AND logic', () => {
  it('requires all tokens to match (AND)', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
    });
    expect(matchesSearchText(listing, ['cpsc', '201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cpsc', '999'], defaultOpts)).toBe(
      false,
    );
  });

  it('tokens can match different fields', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
      professors: ['Dana Angluin'],
    });
    expect(matchesSearchText(listing, ['cpsc', 'angluin'], defaultOpts)).toBe(
      true,
    );
  });

  it('returns true for empty token list', () => {
    const listing = makeListing();
    expect(matchesSearchText(listing, [], defaultOpts)).toBe(true);
  });
});

// Subject full-name matching

describe('matchesSearchText — subject full-name matching', () => {
  it('"computer" matches CPSC via subject name "Computer Science"', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures and Programming Techniques',
    });
    expect(matchesSearchText(listing, ['computer'], defaultOpts)).toBe(true);
  });

  it('"computer science" matches CPSC via subject name', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures and Programming Techniques',
    });
    expect(
      matchesSearchText(listing, ['computer', 'science'], defaultOpts),
    ).toBe(true);
  });

  it('"economics" matches ECON via subject name', () => {
    const listing = makeListing({
      subject: 'ECON',
      title: 'Intermediate Microeconomics',
    });
    expect(matchesSearchText(listing, ['economics'], defaultOpts)).toBe(true);
  });

  it('"psychology" matches PSYC via subject name', () => {
    const listing = makeListing({
      subject: 'PSYC',
      title: 'Research Methods in Psychology',
    });
    expect(matchesSearchText(listing, ['psychology'], defaultOpts)).toBe(true);
  });

  it('"mathematics" matches MATH via subject name', () => {
    const listing = makeListing({
      subject: 'MATH',
      title: 'Linear Algebra',
    });
    expect(matchesSearchText(listing, ['mathematics'], defaultOpts)).toBe(true);
  });

  it('existing exact queries still work (regression)', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
    });
    expect(matchesSearchText(listing, ['cpsc'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cpsc', '201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['intro'], defaultOpts)).toBe(true);
  });

  it('does not match a random word via subject name', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures',
    });
    expect(matchesSearchText(listing, ['biology'], defaultOpts)).toBe(false);
  });
});

// Fuzzy (typo tolerance) matching

describe('matchesSearchText — typo tolerance', () => {
  it('"algorthms" fuzzy-matches title word "Algorithms"', () => {
    const listing = makeListing({ title: 'Design and Analysis of Algorithms' });
    expect(matchesSearchText(listing, ['algorthms'], defaultOpts)).toBe(true);
  });

  it('"intrduction" fuzzy-matches title word "Introduction"', () => {
    const listing = makeListing({
      title: 'Introduction to Computer Science',
    });
    expect(matchesSearchText(listing, ['intrduction'], defaultOpts)).toBe(true);
  });

  it('"calclus" fuzzy-matches title word "Calculus"', () => {
    const listing = makeListing({ title: 'Calculus of Functions' });
    expect(matchesSearchText(listing, ['calclus'], defaultOpts)).toBe(true);
  });

  it('"psycology" fuzzy-matches subject name "Psychology"', () => {
    const listing = makeListing({
      subject: 'PSYC',
      title: 'Research Methods',
    });
    expect(matchesSearchText(listing, ['psycology'], defaultOpts)).toBe(true);
  });

  it('"shakspeare" fuzzy-matches professor name "Shakespeare"', () => {
    const listing = makeListing({
      title: 'English Literature',
      professors: ['William Shakespeare'],
    });
    expect(matchesSearchText(listing, ['shakspeare'], defaultOpts)).toBe(true);
  });

  it('short tokens (<=2 chars) do not fuzzy-match', () => {
    const listing = makeListing({ subject: 'MATH', title: 'Data Structures' });
    // "ds" should not fuzzy-match "Data" or "Structures"
    expect(matchesSearchText(listing, ['ds'], defaultOpts)).toBe(false);
  });

  it('fuzzy match respects multi-token AND', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Introduction to Algorithms',
    });
    // Both tokens must match: "cpsc" exact + "algorthms" fuzzy
    expect(matchesSearchText(listing, ['cpsc', 'algorthms'], defaultOpts)).toBe(
      true,
    );
    // "algorthms" fuzzy matches but "xyz" matches nothing
    expect(matchesSearchText(listing, ['algorthms', 'xyz'], defaultOpts)).toBe(
      false,
    );
  });

  it('does not fuzzy-match subject codes', () => {
    // "cpss" is 1 edit from "cpsc" but subject codes are exact-only
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures',
    });
    expect(matchesSearchText(listing, ['cpss'], defaultOpts)).toBe(false);
  });

  it('does not fuzzy-match course numbers', () => {
    const listing = makeListing({
      number: '201',
      title: 'Data Structures',
    });
    // "202" is 1 edit from "201" but numbers are exact-only
    expect(matchesSearchText(listing, ['202'], defaultOpts)).toBe(false);
  });

  it('regression: exact queries still work unchanged', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
      professors: ['Dana Angluin'],
    });
    expect(matchesSearchText(listing, ['cpsc'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['intro'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cpsc', '201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['angluin'], defaultOpts)).toBe(true);
  });

  it('rejects typos that exceed the max edit distance', () => {
    const listing = makeListing({ title: 'Algorithms' });
    // "algrthms" has 2 edits from "algorithms" — still within maxDist=2
    expect(matchesSearchText(listing, ['algrthms'], defaultOpts)).toBe(true);
    // "algrtms" has 3 edits — exceeds maxDist=2
    expect(matchesSearchText(listing, ['algrtms'], defaultOpts)).toBe(false);
  });

  it('handles adjacent transpositions better than plain Levenshtein', () => {
    const listing = makeListing({ title: 'Algorithms' });
    // "algorihtms" — one transposition (th→ht), OSA distance 1
    expect(matchesSearchText(listing, ['algorihtms'], defaultOpts)).toBe(true);
    // "algorihtm" — transposition + missing 's', OSA distance 2
    // (would be Levenshtein 3 and fail without transposition support)
    expect(matchesSearchText(listing, ['algorihtm'], defaultOpts)).toBe(true);
  });

  it('"alogirhtms" is still too distant (3 transpositions)', () => {
    const listing = makeListing({ title: 'Algorithms' });
    // 3 separate transpositions → OSA distance 3 > maxDist 2
    expect(matchesSearchText(listing, ['alogirhtms'], defaultOpts)).toBe(false);
  });

  it('transposition works for short tokens (length 3–4, maxDist 1)', () => {
    const listing = makeListing({ title: 'The Art of Data' });
    // "teh" → "the": one transposition, OSA distance 1
    expect(matchesSearchText(listing, ['teh'], defaultOpts)).toBe(true);
    // "daat" → "data": one transposition, OSA distance 1
    expect(matchesSearchText(listing, ['daat'], defaultOpts)).toBe(true);
  });
});

// Alias expansion

describe('matchesSearchText — alias expansion', () => {
  it('"cs" matches CPSC via alias', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures',
    });
    expect(matchesSearchText(listing, ['cs'], defaultOpts)).toBe(true);
  });

  it('"cs" with course number matches CPSC course', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
    });
    expect(matchesSearchText(listing, ['cs', '201'], defaultOpts)).toBe(true);
  });

  it('"cs" still matches subject codes starting with CS', () => {
    const listing = makeListing({
      subject: 'CSEC',
      title: 'Computer Science and Economics',
    });
    expect(matchesSearchText(listing, ['cs'], defaultOpts)).toBe(true);
  });

  it('"orgo" matches courses with "Organic" in the title', () => {
    const listing = makeListing({
      subject: 'CHEM',
      title: 'Organic Chemistry',
    });
    expect(matchesSearchText(listing, ['orgo'], defaultOpts)).toBe(true);
  });

  it('"orgo" does not match unrelated chemistry courses', () => {
    const listing = makeListing({
      subject: 'CHEM',
      title: 'Physical Chemistry',
    });
    expect(matchesSearchText(listing, ['orgo'], defaultOpts)).toBe(false);
  });

  it('"polisci" matches PLSC via alias', () => {
    const listing = makeListing({
      subject: 'PLSC',
      title: 'Introduction to Political Science',
    });
    expect(matchesSearchText(listing, ['polisci'], defaultOpts)).toBe(true);
  });

  it('"psych" already matches PSYC without alias (via subject name)', () => {
    const listing = makeListing({
      subject: 'PSYC',
      title: 'Research Methods',
    });
    expect(matchesSearchText(listing, ['psych'], defaultOpts)).toBe(true);
  });

  it('"econ" already matches ECON without alias (via subject code prefix)', () => {
    const listing = makeListing({
      subject: 'ECON',
      title: 'Intermediate Microeconomics',
    });
    expect(matchesSearchText(listing, ['econ'], defaultOpts)).toBe(true);
  });

  it('"ml" has no alias and does not match "Machine Learning"', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Machine Learning',
    });
    expect(matchesSearchText(listing, ['ml'], defaultOpts)).toBe(false);
  });

  it('"ai" has no alias and does not match "Artificial Intelligence"', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Artificial Intelligence',
    });
    expect(matchesSearchText(listing, ['ai'], defaultOpts)).toBe(false);
  });

  it('alias expansion preserves multi-token AND', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '365',
      title: 'Design and Analysis of Algorithms',
    });
    expect(matchesSearchText(listing, ['cs', '365'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cs', '999'], defaultOpts)).toBe(false);
  });
});

// Match quality tiers

describe('searchMatchQuality — quality tiers', () => {
  it('subject code prefix → quality 4', () => {
    const listing = makeListing({ subject: 'CPSC', title: 'Data Structures' });
    expect(searchMatchQuality(listing, ['cpsc'], defaultOpts)).toBe(4);
  });

  it('course number prefix → quality 4', () => {
    const listing = makeListing({ number: '201', title: 'Data Structures' });
    expect(searchMatchQuality(listing, ['201'], defaultOpts)).toBe(4);
  });

  it('building code prefix → quality 4', () => {
    const listing = makeListing({
      title: 'Intro',
      buildingCodes: ['WTS'],
    });
    expect(searchMatchQuality(listing, ['wts'], defaultOpts)).toBe(4);
  });

  it('subject full name → quality 3', () => {
    const listing = makeListing({
      subject: 'PSYC',
      title: 'Research Methods',
    });
    expect(searchMatchQuality(listing, ['psychology'], defaultOpts)).toBe(3);
  });

  it('alias expansion to subject code → quality 4', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Data Structures',
    });
    // Cs → cpsc → subject prefix match → same tier as direct prefix
    expect(searchMatchQuality(listing, ['cs'], defaultOpts)).toBe(4);
  });

  it('alias expansion to title substring → quality 2', () => {
    const listing = makeListing({
      subject: 'CHEM',
      title: 'Organic Chemistry',
    });
    // Orgo → organic → title substring match
    expect(searchMatchQuality(listing, ['orgo'], defaultOpts)).toBe(2);
  });

  it('title substring → quality 2', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Introduction to Computer Science',
    });
    expect(searchMatchQuality(listing, ['introduction'], defaultOpts)).toBe(2);
  });

  it('professor name → quality 2', () => {
    const listing = makeListing({
      title: 'Intro',
      professors: ['Dana Angluin'],
    });
    expect(searchMatchQuality(listing, ['angluin'], defaultOpts)).toBe(2);
  });

  it('fuzzy match → quality 1', () => {
    const listing = makeListing({ title: 'Algorithms' });
    expect(searchMatchQuality(listing, ['algorthms'], defaultOpts)).toBe(1);
  });

  it('no match → quality 0', () => {
    const listing = makeListing({ title: 'Data Structures' });
    expect(searchMatchQuality(listing, ['quantum'], defaultOpts)).toBe(0);
  });

  it('empty tokens → quality 4 (match everything)', () => {
    const listing = makeListing({ title: 'Anything' });
    expect(searchMatchQuality(listing, [], defaultOpts)).toBe(4);
  });
});

describe('searchMatchQuality — multi-token and ranking', () => {
  it('multi-token quality is minimum across tokens', () => {
    const listing = makeListing({
      subject: 'CPSC',
      title: 'Introduction to Algorithms',
    });
    // "cpsc" = 4 (subject prefix), "algorithms" = 2 (title substring)
    expect(
      searchMatchQuality(listing, ['cpsc', 'algorithms'], defaultOpts),
    ).toBe(2);
  });

  it('alias-expanded subject match ranks equal to direct prefix', () => {
    const cpsc = makeListing({ subject: 'CPSC', title: 'Data Structures' });
    const csec = makeListing({
      subject: 'CSEC',
      title: 'CS and Economics',
    });
    // Both are quality 4: CSEC via direct prefix, CPSC via alias → subject prefix
    expect(searchMatchQuality(csec, ['cs'], defaultOpts)).toBe(4);
    expect(searchMatchQuality(cpsc, ['cs'], defaultOpts)).toBe(4);
  });

  it('exact title match outranks fuzzy match', () => {
    const listing = makeListing({ title: 'Algorithms' });
    const exactQ = searchMatchQuality(listing, ['algorithms'], defaultOpts);
    const fuzzyQ = searchMatchQuality(listing, ['algorthms'], defaultOpts);
    expect(exactQ).toBeGreaterThan(fuzzyQ);
  });

  it('subject name match outranks title substring', () => {
    // "economics" matches ECON via subject name (quality 3)
    const econSubject = makeListing({
      subject: 'ECON',
      title: 'Intermediate Microeconomics',
    });
    // "economics" appears in "microeconomics" title substring (quality 2)
    const otherTitle = makeListing({
      subject: 'HIST',
      title: 'History of Economics',
    });
    expect(
      searchMatchQuality(econSubject, ['economics'], defaultOpts),
    ).toBeGreaterThan(
      searchMatchQuality(otherTitle, ['economics'], defaultOpts),
    );
  });

  it('existing boolean matching is unchanged', () => {
    const listing = makeListing({
      subject: 'CPSC',
      number: '201',
      title: 'Introduction to Computer Science',
      professors: ['Dana Angluin'],
    });
    expect(matchesSearchText(listing, ['cpsc'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['intro'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['cpsc', '201'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['angluin'], defaultOpts)).toBe(true);
    expect(matchesSearchText(listing, ['quantum'], defaultOpts)).toBe(false);
  });
});
