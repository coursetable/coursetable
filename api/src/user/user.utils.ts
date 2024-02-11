export function worksheetCoursesToWorksheets(
  worksheetCourses: {
    netId: string;
    crn: number;
    season: number;
    worksheetNumber: number;
  }[],
) {
  const res: {
    [netId: string]: {
      [season: string]: {
        [worksheetNumber: number]: {
          crn: number;
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
    });
  }
  return res;
}
