import { decompressFromEncodedURIComponent } from 'lz-string';
import { toast } from 'react-toastify';
import { z } from 'zod';
import type { StateCreator } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { shallow } from 'zustand/shallow';
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
type WorksheetView = 'calendar' | 'list';

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
  curWorksheet: UserWorksheets;

  // These define which courses the store contains
  viewedPerson: 'me' | NetId;
  viewedSeason: Season;
  viewedWorksheetNumber: number;
  viewedWorksheetName: string;

  // An exotic worksheet is one that is imported via the URL or file upload.
  // Exotic worksheets do not have a corresponding worksheet in the worksheets
  // data structure and do not use any of the other worksheet-related data.
  exoticWorksheet:
    | { data: ExoticWorksheet; worksheets: UserWorksheets }
    | undefined;
  isExoticWorksheet: boolean;
  isViewedWorksheetPrivate: boolean;
  // A readonly worksheet is anything that doesn't belong to the user—either
  // exotic or a friend's worksheet.
  isReadonlyWorksheet: boolean;

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
  setCurWorksheet: (worksheet: UserWorksheets) => void;

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

  setSeasonCodes: (seasons: Season[]) => void;

  setWorksheetInfo: (
    courses: WorksheetState['courses'],
    worksheetLoading: WorksheetState['worksheetLoading'],
    worksheetError: WorksheetState['worksheetError'],
  ) => void;
}

export interface WorksheetSlice extends WorksheetState, WorksheetActions {}

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

function parseCoursesFromURL(): WorksheetState['exoticWorksheet'] {
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
  curWorksheet: new Map(),
  setCurWorksheet(worksheet) {
    set({ curWorksheet: worksheet });
  },
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
  exoticWorksheet: parseCoursesFromURL(),
  isExoticWorksheet: false,
  isReadonlyWorksheet: false,
  exitExoticWorksheet() {
    set({ exoticWorksheet: undefined });
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
  setSeasonCodes(seasons) {
    set({ seasonCodes: seasons });
  },
  courses: [],
  viewedWorksheetName: 'Main Worksheet',
  isViewedWorksheetPrivate: false,
  worksheetLoading: false,
  worksheetError: null,
  setWorksheetInfo(courses, worksheetLoading, worksheetError) {
    set({ courses, worksheetLoading, worksheetError });
  },
});

// Subscriptions and Effects
// Although not ideal, a subscription is the simplest way
// to handle computed values in a memoized fashion in Zustand.
// Effects should be used for values with React dependencies
export const useWorksheetSubscriptions = () => {
  const { setCurWorksheet, setSeasonCodes } = useStore.getState(); // Non-reactive function references

  useStore.subscribe(
    (state) => ({
      worksheets: state.worksheets,
      friends: state.friends,
      viewedPerson: state.viewedPerson,
    }),
    ({ worksheets, friends, viewedPerson }) => {
      const whenNotDefined: UserWorksheets = new Map();
      if (viewedPerson === 'me') setCurWorksheet(worksheets ?? whenNotDefined);
      else
        setCurWorksheet(friends?.[viewedPerson]?.worksheets ?? whenNotDefined);
    },
    { equalityFn: shallow },
  );

  useStore.subscribe(
    (state) => ({
      curWorksheet: state.curWorksheet,
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
    }),
    ({ curWorksheet, viewedSeason, viewedWorksheetNumber }) => {
      useStore.setState({
        isViewedWorksheetPrivate:
          curWorksheet.get(viewedSeason)?.get(viewedWorksheetNumber)?.private ??
          false,
      });
    },
    { equalityFn: shallow },
  );

  useStore.subscribe(
    (state) => ({
      exoticWorksheet: state.exoticWorksheet,
      curWorksheet: state.curWorksheet,
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
    }),
    ({
      exoticWorksheet,
      curWorksheet,
      viewedSeason,
      viewedWorksheetNumber,
    }) => {
      useStore.setState({
        viewedWorksheetName:
          exoticWorksheet?.data.name ??
          curWorksheet.get(viewedSeason)?.get(viewedWorksheetNumber)?.name ??
          (viewedWorksheetNumber === 0
            ? 'Main Worksheet'
            : 'Unnamed Worksheet'),
      });
    },
    {
      equalityFn: shallow,
    },
  );

  useStore.subscribe(
    (state) => ({
      isExoticWorksheet: state.isExoticWorksheet,
      viewedPerson: state.viewedPerson,
    }),
    ({ isExoticWorksheet, viewedPerson }) => {
      useStore.setState({
        isReadonlyWorksheet: isExoticWorksheet || viewedPerson !== 'me',
      });
    },
    { equalityFn: shallow },
  );

  useStore.subscribe(
    (state) => state.exoticWorksheet,
    (exoticWorksheet) =>
      useStore.setState({ isExoticWorksheet: Boolean(exoticWorksheet) }),
  );

  useStore.subscribe(
    (state) => state.worksheets,
    (worksheets) => {
      setSeasonCodes(seasonsWithDataFirst(allSeasons, worksheets));
    },
  );
};

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
      curWorksheet: state.curWorksheet,
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

  setWorksheetInfo(courses, worksheetLoading, worksheetError);
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
