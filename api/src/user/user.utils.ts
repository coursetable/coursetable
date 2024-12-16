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
