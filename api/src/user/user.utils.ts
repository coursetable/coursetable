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

export function getFirstAvailableWsNumber(worksheetNumbers: number[]) {
  // Equivalent to finding the MEX (minimum excluded) element of this array.
  let firstAvailableWsNumber = 1;
  for (const existingWsNum of worksheetNumbers) {
    if (existingWsNum === firstAvailableWsNumber) {
      firstAvailableWsNumber += 1;
    } else if (existingWsNum > firstAvailableWsNumber) {
      break;
    }
  }
  return firstAvailableWsNumber;
}