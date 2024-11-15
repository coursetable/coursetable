export type Course = {
  crn: number;
  color: string;
  hidden: boolean | null;
};

export type CourseWithMetadata = {
  season: number;
  worksheetNumber: number;
} & Course;

export type FlatWsMetadata = {
  season: number;
  worksheetNumber: number;
  worksheetName: string;
};

export type SeasonMappedWsMetadata = {
  [season: string]: { [worksheetNumber: number]: { worksheetName: string } };
};

export type SeasonMappedWorksheet = {
  [season: string]: {
    [worksheetNumber: number]: {
      worksheetName: string;
      courses: Course[];
    };
  };
};