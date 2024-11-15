export function worksheetCoursesToWorksheets(
  worksheetCourses: {
    netId: string;
    crn: number;
    season: number;
    worksheetNumber: number;
    color: string;
    hidden: boolean | null;
  }[],
) {
  const res: {
    [netId: string]: {
      [season: string]: {
        [worksheetNumber: number]: {
          crn: number;
          color: string;
          hidden: boolean | null;
        }[];
      };
    };
  } = {};
  for (const course of worksheetCourses) {
    res[course.netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    res[course.netId]![course.season] ??= {};

    res[course.netId]![course.season]![course.worksheetNumber] ??= [];
    res[course.netId]![course.season]![course.worksheetNumber]!.push({
      crn: course.crn,
      color: course.color,
      hidden: course.hidden,
    });
  }
  return res;
}

export function getNextAvailableWsNumber(worksheetNumbers: number[]): number {
  if (worksheetNumbers.length === 0) return 1;
  const last = Math.max(...worksheetNumbers);
  return last + 1;
}

type Course = {
  crn: number;
  color: string;
  hidden: boolean | null;
};

type CourseWithMetadata = {
  season: number;
  worksheetNumber: number;
} & Course;

type FlatWsMetadata = {
  season: number;
  worksheetNumber: number;
  worksheetName: string;
};

type SeasonMappedWsMetadata = {
  [season: string]: { [worksheetNumber: number]: { worksheetName: string } };
};

type SeasonMappedWorksheet = {
  [season: string]: {
    [worksheetNumber: number]: {
      worksheetName: string;
      courses: Course[];
    };
  };
};

export function flatWsMetadataToMapping(
  allWorksheetMetadata: FlatWsMetadata[],
): SeasonMappedWsMetadata {
  const worksheetMap: SeasonMappedWsMetadata = {};

  allWorksheetMetadata.forEach(({ season, worksheetNumber, worksheetName }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    worksheetMap[season] ??= {};
    worksheetMap[season][worksheetNumber] ??= { worksheetName };
  });

  return worksheetMap;
}

export function constructWsWithMetadata(
  worksheets: CourseWithMetadata[],
  mappedWsMetadata: SeasonMappedWsMetadata,
): SeasonMappedWorksheet | undefined {
  const mappedWorksheets: SeasonMappedWorksheet = {};

  for (const worksheet of worksheets) {
    const { season, worksheetNumber, crn, color, hidden } = worksheet;

    if (!mappedWsMetadata[season]?.[worksheetNumber]) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    mappedWorksheets[season] ??= {};
    mappedWorksheets[season][worksheetNumber] ??= {
      worksheetName: mappedWsMetadata[season][worksheetNumber].worksheetName,
      courses: [],
    };

    mappedWorksheets[season][worksheetNumber].courses.push({
      crn,
      color,
      hidden,
    });
  }

  return mappedWorksheets;
}
