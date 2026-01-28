import type { GraphQLClient } from 'graphql-request';

type WorksheetData = {
  netId: string;
  season: number;
  worksheetNumber: number;
  courses: object[];
  // Other worksheet properties
};

type WorksheetMap<T extends WorksheetData> = {
  [netId: string]: {
    [season: string]: {
      [worksheetNumber: number]: Omit<
        T,
        'netId' | 'season' | 'worksheetNumber'
      >;
    };
  };
};

export function worksheetListToMap<T extends WorksheetData>(
  worksheetCourses: T[],
): WorksheetMap<T> {
  const res: WorksheetMap<T> = {};
  worksheetCourses.forEach(({ netId, season, worksheetNumber, ...data }) => {
    res[netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    res[netId][season] ??= {};
    res[netId][season][worksheetNumber] ??= data;
  });
  return res;
}

export function getNextAvailableWsNumber(worksheetNumbers: number[]): number {
  if (worksheetNumbers.length === 0) return 1;
  const last = Math.max(...worksheetNumbers);
  return last + 1;
}

export async function fetchSameCourseIdMappings(
  seasonCrnMap: Map<string, Set<number>>,
  graphqlClient: GraphQLClient,
  getSdk: (client: GraphQLClient) => {
    CrnToSameCourseId: (variables: {
      crns: number[];
      season: string;
    }) => Promise<{
      listings: {
        crn: number;
        course: { sameCourseId: number };
      }[];
    }>;
    AllCrnsForSameCourseIds: (variables: {
      sameCourseIds: number[];
      season: string;
    }) => Promise<{
      courses: {
        sameCourseId: number;
        listings: { crn: number }[];
      }[];
    }>;
  },
): Promise<{
  crnToSameCourseId: Map<string, number>;
  sameCourseIdToCrns: Map<number, number[]>;
}> {
  // Fetch sameCourseId for all CRNs using GraphQL
  const crnToSameCourseId = new Map<string, number>();
  for (const [seasonCode, crns] of seasonCrnMap.entries()) {
    if (crns.size === 0) continue;

    const data = await getSdk(graphqlClient).CrnToSameCourseId({
      crns: Array.from(crns),
      season: seasonCode,
    });

    for (const listing of data.listings) {
      const key = `${seasonCode}${listing.crn}`;
      crnToSameCourseId.set(key, listing.course.sameCourseId);
    }
  }

  // Collect all unique sameCourseIds
  const sameCourseIds = new Set<number>();
  for (const sameCourseId of crnToSameCourseId.values())
    sameCourseIds.add(sameCourseId);

  // Fetch ALL CRNs that have these sameCourseId values
  const sameCourseIdToCrns = new Map<number, number[]>();
  for (const [seasonCode] of seasonCrnMap.entries()) {
    if (sameCourseIds.size === 0) continue;

    const data = await getSdk(graphqlClient).AllCrnsForSameCourseIds({
      sameCourseIds: Array.from(sameCourseIds),
      season: seasonCode,
    });

    for (const course of data.courses) {
      if (!sameCourseIdToCrns.has(course.sameCourseId))
        sameCourseIdToCrns.set(course.sameCourseId, []);
      for (const listing of course.listings)
        sameCourseIdToCrns.get(course.sameCourseId)!.push(listing.crn);
    }
  }

  return { crnToSameCourseId, sameCourseIdToCrns };
}
