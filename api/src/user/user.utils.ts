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
