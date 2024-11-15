import type {
  CourseWithMetadata,
  FlatWsMetadata,
  SeasonMappedWorksheet,
  SeasonMappedWsMetadata,
} from './user.types.js';

export function worksheetCoursesToWorksheets(
  worksheetCourses: CourseWithMetadata[],
  wsMetadata: FlatWsMetadata[],
) {
  const mappedWsMetadata = flatWsMetadataToMapping(wsMetadata);

  const res: {
    [netId: string]: SeasonMappedWorksheet;
  } = {};
  for (const course of worksheetCourses) {
    if (
      !mappedWsMetadata[course.netId]?.[course.season]?.[course.worksheetNumber]
    ) {
      // Somehow, a worksheet has no associated metadata in the DB.
      return undefined;
    }
    res[course.netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    res[course.netId]![course.season] ??= {};

    res[course.netId]![course.season]![course.worksheetNumber] ??= {
      worksheetName:
        mappedWsMetadata[course.netId]![course.season]![course.worksheetNumber]!
          .worksheetName,
      courses: [],
    };
    res[course.netId]![course.season]![course.worksheetNumber]!.courses.push({
      crn: course.crn,
      color: course.color,
      hidden: course.hidden,
    });
  }
  return res;
}

function flatWsMetadataToMapping(wsMetadata: FlatWsMetadata[]): {
  [netId: string]: SeasonMappedWsMetadata;
} {
  const mappedWsMetadata: {
    [netId: string]: SeasonMappedWsMetadata;
  } = {};
  wsMetadata.forEach(({ netId, season, worksheetNumber, worksheetName }) => {
    mappedWsMetadata[netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    mappedWsMetadata[netId][season] ??= {};
    mappedWsMetadata[netId][season][worksheetNumber] ??= { worksheetName };
  });
  return mappedWsMetadata;
}

export function getNextAvailableWsNumber(worksheetNumbers: number[]): number {
  if (worksheetNumbers.length === 0) return 1;
  const last = Math.max(...worksheetNumbers);
  return last + 1;
}
