import { describe, it, expect } from 'vitest';
import { matchesSearchText } from './searchTextMatch';
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
