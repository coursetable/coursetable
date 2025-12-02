import { useEffect } from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { memoize } from 'proxy-memoize';
import { toast } from 'react-toastify';
import { z } from 'zod';
import type { StateCreator } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { CUR_SEASON } from '../config';
import {
  seasons as allSeasons,
  useWorksheetInfo,
} from '../contexts/ferryContext';
import type { Option } from '../contexts/searchContext';
import type { CatalogListing, UserWorksheets } from '../queries/api';
import {
  type Season,
  type Crn,
  type NetId,
  crnSchema,
  seasonSchema,
} from '../queries/graphql-types';
import { type Store, useStore } from '../store';

// Utility Types
export type WorksheetView = 'calendar' | 'list' | 'map';

export interface WorksheetCourse {
  crn: Crn;
  color: string;
  listing: CatalogListing;
  hidden: boolean | null;
}

const exoticWorksheetSchema = z.object({
  season: seasonSchema,
  name: z.string(),
  courses: z.array(
    z.object({
      crn: crnSchema,
      color: z.string(),
      hidden: z.boolean(),
    }),
  ),
});

export type ExoticWorksheet = z.infer<typeof exoticWorksheetSchema>;

// Slice Types
interface WorksheetState {
  // These define which courses the store contains
  viewedPerson: 'me' | NetId;
  viewedSeason: Season;
  viewedWorksheetNumber: number;

  // An exotic worksheet is one that is imported via the URL or file upload.
  // Exotic worksheets do not have a corresponding worksheet in the worksheets
  // data structure and do not use any of the other worksheet-related data.
  exoticWorksheet:
    | { data: ExoticWorksheet; worksheets: UserWorksheets }
    | undefined;

  // Affect visual display
  worksheetView: WorksheetView;
  hoverCourse: Crn | null;

  // These are used to select the worksheet
  seasonCodes: Season[];
  // Controls which courses are displayed
  courses: WorksheetCourse[];
  worksheetLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  worksheetError: {} | null;
}

interface WorksheetActions {
  changeViewedPerson: (newPerson: WorksheetState['viewedPerson']) => void;
  changeViewedSeason: (seasonCode: WorksheetState['viewedSeason']) => void;
  changeViewedWorksheetNumber: (
    worksheetNumber: WorksheetState['viewedWorksheetNumber'],
  ) => void;

  // When powering features like conflicting schedules and deciding which
  // worksheet the toggle button should affect, we need to pick a number when
  // given the course's season. We cannot use viewedWorksheetNumber, because
  // if we are viewing worksheet 2 of season X, there's no reason that worksheet
  // 2 of season Y should be the same thing or even exist. Therefore, this
  // function returns 0 unless (viewedPerson, viewedSeason) = ('me', seasonCode)
  getRelevantWorksheetNumber: (seasonCode: Season) => number;

  exitExoticWorksheet: () => void;

  changeWorksheetView: (view: WorksheetState['worksheetView']) => void;
  setHoverCourse: (course: WorksheetState['hoverCourse']) => void;

  setWorksheetInfo: (
    courses: WorksheetState['courses'],
    worksheetLoading: WorksheetState['worksheetLoading'],
    worksheetError: WorksheetState['worksheetError'],
  ) => void;
}

// Memoized Values
interface WorksheetSliceMemo {
  worksheetMemo: {
    getCurWorksheet: (state: Store) => UserWorksheets;
    getSeasonCodes: (state: Store) => Season[];
    getIsExoticWorksheet: (state: Store) => boolean;
    getIsReadonlyWorksheet: (state: Store) => boolean;
    getViewedWorksheetName: (state: Store) => string;
    getIsViewedWorksheetPrivate: (state: Store) => boolean;
  };
}

export interface WorksheetSlice
  extends WorksheetState,
    WorksheetActions,
    WorksheetSliceMemo {}

// Utility Functions
function seasonsWithDataFirst(
  seasons: Season[],
  worksheets: UserWorksheets | undefined,
) {
  if (!worksheets) return seasons;
  return seasons.toSorted((a, b) => {
    const aHasData = worksheets.has(a);
    const bHasData = worksheets.has(b);
    if (aHasData && !bHasData) return -1;
    if (!aHasData && bHasData) return 1;
    return Number(b) - Number(a);
  });
}

export function parseCoursesFromURL(): WorksheetState['exoticWorksheet'] {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has('ws')) return undefined;
  const serial = decompressFromEncodedURIComponent(searchParams.get('ws')!);
  const parsed: unknown = JSON.parse(serial);
  const courses = exoticWorksheetSchema.safeParse(parsed);
  if (!courses.success) {
    toast.error('Invalid worksheet data from URL');
    return undefined;
  }
  return {
    data: courses.data,
    worksheets: new Map([
      [
        courses.data.season,
        new Map([
          [
            0,
            {
              name: courses.data.name,
              courses: courses.data.courses,
              private: false,
            },
          ],
        ]),
      ],
    ]),
  };
}

export const createWorksheetSlice: StateCreator<
  Store,
  [],
  [],
  WorksheetSlice
> = (set, get) => ({
  viewedPerson: 'me',
  viewedSeason: CUR_SEASON,
  viewedWorksheetNumber: 0,
  changeViewedPerson(newPerson) {
    set({ viewedWorksheetNumber: 0, viewedPerson: newPerson });
  },
  changeViewedSeason(seasonCode) {
    set({ viewedWorksheetNumber: 0, viewedSeason: seasonCode });
  },
  changeViewedWorksheetNumber(worksheetNumber) {
    set({ viewedWorksheetNumber: worksheetNumber });
  },
  getRelevantWorksheetNumber(seasonCode) {
    if (get().viewedPerson !== 'me' || seasonCode !== get().viewedSeason)
      return 0;
    return get().viewedWorksheetNumber;
  },
  exoticWorksheet: undefined,
  exitExoticWorksheet() {
    set({
      exoticWorksheet: undefined,
    });
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('ws');
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${searchParams}`,
    );
  },
  worksheetView: 'calendar',
  hoverCourse: null,
  changeWorksheetView(view) {
    set({ worksheetView: view });
    window.scrollTo({ top: 0, left: 0 });
  },
  setHoverCourse(course) {
    set({ hoverCourse: course });
  },
  seasonCodes: [],
  courses: [],
  worksheetLoading: false,
  worksheetError: null,
  setWorksheetInfo(courses, worksheetLoading, worksheetError) {
    set({ courses, worksheetLoading, worksheetError });
  },
  worksheetMemo: {
    getCurWorksheet: memoize(
      (state: Store): UserWorksheets =>
        ((state.viewedPerson === 'me'
          ? state.worksheets
          : state.friends?.[state.viewedPerson]?.worksheets) ??
          new Map()) as UserWorksheets,
    ),
    getSeasonCodes: memoize((state: Store) =>
      seasonsWithDataFirst(allSeasons, state.worksheets),
    ),
    getIsExoticWorksheet: memoize((state: Store) =>
      Boolean(state.exoticWorksheet),
    ),
    // A readonly worksheet is anything that doesn't belong to the user—either
    // exotic or a friend's worksheet.
    getIsReadonlyWorksheet: memoize(
      (state: Store) =>
        state.worksheetMemo.getIsExoticWorksheet(state) ||
        state.viewedPerson !== 'me',
    ),
    getViewedWorksheetName: memoize(
      (state: Store) =>
        state.exoticWorksheet?.data.name ??
        state.worksheetMemo
          .getCurWorksheet(state)
          .get(state.viewedSeason)
          ?.get(state.viewedWorksheetNumber)?.name ??
        (state.viewedWorksheetNumber === 0
          ? 'Main Worksheet'
          : 'Unnamed Worksheet'),
    ),
    getIsViewedWorksheetPrivate: memoize(
      (state: Store) =>
        state.worksheetMemo
          .getCurWorksheet(state)
          .get(state.viewedSeason)
          ?.get(state.viewedWorksheetNumber)?.private ?? false,
    ),
  },
});

// Effects should be used for values with React dependencies
export const useWorksheetEffects = () => {
  const {
    exoticWorksheet,
    curWorksheet,
    viewedSeason,
    viewedWorksheetNumber,
    setWorksheetInfo,
  } = useStore(
    useShallow((state) => ({
      exoticWorksheet: state.exoticWorksheet,
      curWorksheet: state.worksheetMemo.getCurWorksheet(state),
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      setWorksheetInfo: state.setWorksheetInfo,
    })),
  );

  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: courses,
  } = useWorksheetInfo(
    exoticWorksheet?.worksheets ?? curWorksheet,
    exoticWorksheet?.data.season ?? viewedSeason,
    exoticWorksheet ? 0 : viewedWorksheetNumber,
  );
  useEffect(() => {
    setWorksheetInfo(courses, worksheetLoading, worksheetError);
  }, [courses, worksheetLoading, worksheetError, setWorksheetInfo]);
};

// Auxiliary Functions
export function useWorksheetNumberOptions(
  person: 'me' | NetId,
  season: Season,
): { [worksheetNumber: number]: Option<number> } {
  const { worksheets, friends } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      friends: state.friends,
    })),
  );
  const seasonWorksheet = (
    person === 'me' ? worksheets : friends?.[person]?.worksheets
  )?.get(season);
  const options = seasonWorksheet
    ? Object.fromEntries(
        [...seasonWorksheet.entries()].map(([key, value]) => [
          key,
          { value: key, label: value.name },
        ]),
      )
    : {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  options[0] ??= { value: 0, label: 'Main Worksheet' };
  return options;
}
