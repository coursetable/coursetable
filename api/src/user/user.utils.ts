export function worksheetCoursesToWorksheets(
  worksheetCourses: {
    netId: string;
    crn: number;
    season: number;
    worksheetNumber: number;
    color: string;
  }[],
) {
  const res: {
    [netId: string]: {
      [season: string]: {
        [worksheetNumber: number]: {
          crn: number;
          color: string;
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
    });
  }
  return res;
}

export function wishlistCoursesToWishlist(
  wishlistCourses: {
    netId: string;
    courseCode: string;
  }[],
) {
  const res: {
    [netId: string]: {
      courseCode: string;
    }[];
  } = {};
  for (const course of wishlistCourses) {
    res[course.netId] ??= [];
    res[course.netId]!.push({
      courseCode: course.courseCode,
    });
  }
  return res;
}
