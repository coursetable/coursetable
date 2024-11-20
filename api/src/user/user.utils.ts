type WorksheetNamespaceProps = {
  season: number;
  worksheetNumber: number;
  netId: string;
};

type WorksheetCourse = {
  crn: number;
  color: string;
  hidden: boolean | null;
};

type WorksheetMetadata = {
  name: string;
};

export function worksheetCoursesToWorksheets(
  worksheetCourses: (WorksheetNamespaceProps & WorksheetCourse)[],
  wsMetadata: (WorksheetNamespaceProps & WorksheetMetadata)[],
) {
  const res: {
    [netId: string]: {
      [season: string]: {
        [worksheetNumber: number]: { name: string; courses: WorksheetCourse[] };
      };
    };
  } = {};
  wsMetadata.forEach(({ netId, season, worksheetNumber, name }) => {
    res[netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    res[netId][season] ??= {};
    res[netId][season][worksheetNumber] ??= { name, courses: [] };
  });
  for (const course of worksheetCourses) {
    res[course.netId] ??= {};
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    res[course.netId]![course.season] ??= {};
    res[course.netId]![course.season]![course.worksheetNumber] ??= {
      name:
        // We don't store the name of the main worksheet in the database, so
        // we have to hardcode it here so front end doesn't handle it
        // differently. The main worksheet is invariant: it can't be renamed
        course.worksheetNumber === 0
          ? 'Main Worksheet'
          : '[Error: name not found]',
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

export function getNextAvailableWsNumber(worksheetNumbers: number[]): number {
  if (worksheetNumbers.length === 0) return 1;
  const last = Math.max(...worksheetNumbers);
  return last + 1;
}
