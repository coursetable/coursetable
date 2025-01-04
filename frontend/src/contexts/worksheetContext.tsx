import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import { seasons as allSeasons, useWorksheetInfo } from './ferryContext';
import type { Option } from './searchContext';
import { CUR_SEASON } from '../config';
import type { UserWorksheets, CatalogListing } from '../queries/api';
import {
  type Season,
  type Crn,
  type NetId,
  crnSchema,
  seasonSchema,
} from '../queries/graphql-types';
import { useStore } from '../store';
import { useSessionStorageState } from '../utilities/browserStorage';

type WorksheetView = 'calendar' | 'list';

export type WorksheetCourse = {
  crn: Crn;
  color: string;
  listing: CatalogListing;
  hidden: boolean | null;
};

type Store = {
  // These define which courses the store contains
  viewedPerson: 'me' | NetId;
  viewedSeason: Season;
  viewedWorksheetNumber: number;
  myViewedWorksheetNumber: number;
  changeViewedPerson: (newPerson: 'me' | NetId) => void;
  changeViewedSeason: (seasonCode: Season) => void;
  changeViewedWorksheetNumber: (worksheetNumber: number) => void;

  // When powering features like conflicting schedules and deciding which
  // worksheet the toggle button should affect, we need to pick a number when
  // given the course's season. We cannot use viewedWorksheetNumber, because
  // if we are viewing worksheet 2 of season X, there's no reason that worksheet
  // 2 of season Y should be the same thing or even exist. Therefore, this
  // function returns 0 unless (viewedPerson, viewedSeason) = ('me', seasonCode)
  getRelevantWorksheetNumber: (seasonCode: Season) => number;

  // An exotic worksheet is one that is imported via the URL or file upload.
  // Exotic worksheets do not have a corresponding worksheet in the worksheets
  // data structure and do not use any of the other worksheet-related data.
  isExoticWorksheet: boolean;
  // A readonly worksheet is anything that doesn't belong to the user—either
  // exotic or a friend's worksheet.
  isReadonlyWorksheet: boolean;
  exitExoticWorksheet: () => void;

  // Affect visual display
  worksheetView: WorksheetView;
  hoverCourse: Crn | null;
  changeWorksheetView: (view: WorksheetView) => void;
  setHoverCourse: React.Dispatch<React.SetStateAction<Crn | null>>;

  // These are used to select the worksheet
  seasonCodes: Season[];
  worksheetOptions: { [worksheetNumber: number]: Option<number> };
  myWorksheetOptions: { [worksheetNumber: number]: Option<number> };

  // Controls which courses are displayed
  courses: WorksheetCourse[];
  worksheetLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  worksheetError: {} | null;
};

const WorksheetContext = createContext<Store | undefined>(undefined);
WorksheetContext.displayName = 'WorksheetContext';

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

function parseCoursesFromURL():
  | { data: ExoticWorksheet; worksheets: UserWorksheets }
  | undefined {
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
          [0, { name: courses.data.name, courses: courses.data.courses }],
        ]),
      ],
    ]),
  };
}

export function WorksheetProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { worksheets, friends } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      friends: state.friends,
    })),
  );
  const [exoticWorksheet, setExoticWorksheet] = useState(() =>
    parseCoursesFromURL(),
  );

  const [viewedPerson, setViewedPerson] = useSessionStorageState<'me' | NetId>(
    'viewedPerson',
    'me',
  );

  const [hoverCourse, setHoverCourse] = useState<Crn | null>(null);
  const [worksheetView, setWorksheetView] =
    useSessionStorageState<WorksheetView>('worksheetView', 'calendar');

  const curWorksheet: UserWorksheets = useMemo(() => {
    const whenNotDefined: UserWorksheets = new Map();
    if (viewedPerson === 'me') return worksheets ?? whenNotDefined;

    return friends?.[viewedPerson]?.worksheets ?? whenNotDefined;
  }, [worksheets, friends, viewedPerson]);

  const myCurWorksheet: UserWorksheets = useMemo(() => {
    const whenNotDefined: UserWorksheets = new Map();
    return worksheets ?? whenNotDefined;
  }, [worksheets]);

  // Maybe seasons without data should be disabled/hidden
  const seasonCodes = useMemo(
    () => seasonsWithDataFirst(allSeasons, worksheets),
    [worksheets],
  );
  const [viewedSeason, setViewedSeason] = useSessionStorageState(
    'viewedSeason',
    CUR_SEASON,
  );
  const [viewedWorksheetNumber, setViewedWorksheetNumber] =
    useSessionStorageState('viewedWorksheetNumber', 0);

  const [myViewedWorksheetNumber, setMyViewedWorksheetNumber] =
    useSessionStorageState('myViewedWorksheetNumber', 0);

  const [worksheetOptions, setWorksheetOptions] = useState<{
    [key: number]: Option<number>;
  }>({});

  const [myWorksheetOptions, setMyWorksheetOptions] = useState<{
    [key: number]: Option<number>;
  }>({});

  const {
    loading: worksheetLoading,
    error: worksheetError,
    data: courses,
  } = useWorksheetInfo(
    exoticWorksheet?.worksheets ?? curWorksheet,
    exoticWorksheet?.data.season ?? viewedSeason,
    exoticWorksheet ? 0 : viewedWorksheetNumber,
  );

  const changeViewedSeason = useCallback(
    (newSeason: Season) => {
      setViewedSeason(newSeason);
      setViewedWorksheetNumber(0);
      setMyViewedWorksheetNumber(0);
    },
    [setViewedWorksheetNumber, setMyViewedWorksheetNumber, setViewedSeason],
  );

  const changeViewedWorksheetNumber = useCallback(
    (wsNumber: number) => {
      setViewedWorksheetNumber(wsNumber);
      if (viewedPerson === 'me') setMyViewedWorksheetNumber(wsNumber);
    },
    [viewedPerson, setViewedWorksheetNumber, setMyViewedWorksheetNumber],
  );

  useEffect(() => {
    let entries: [number, Option<number>][] = [];

    if (myCurWorksheet.get(viewedSeason)) {
      entries = Array.from(myCurWorksheet.get(viewedSeason)!.entries()).map(
        ([wsNumber, wsInfo]) => [
          wsNumber,
          {
            label: wsInfo.name,
            value: wsNumber,
          },
        ],
      );
    }

    const newOptions = Object.fromEntries(entries) as {
      [key: number]: Option<number>;
    };

    // We must populate a "ghost" main WS if none exists in the DB.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    newOptions[0] ||= {
      label: 'Main Worksheet',
      value: 0,
    };

    setMyWorksheetOptions(newOptions);

    if (!newOptions[myViewedWorksheetNumber]) setMyViewedWorksheetNumber(0);
  }, [
    myCurWorksheet,
    viewedSeason,
    myViewedWorksheetNumber,
    setMyWorksheetOptions,
    setMyViewedWorksheetNumber,
  ]);

  useEffect(() => {
    let entries: [number, Option<number>][] = [];

    if (curWorksheet.get(viewedSeason)) {
      entries = Array.from(curWorksheet.get(viewedSeason)!.entries()).map(
        ([wsNumber, wsInfo]) => [
          wsNumber,
          {
            label: wsInfo.name,
            value: wsNumber,
          },
        ],
      );
    }

    const newOptions = Object.fromEntries(entries) as {
      [key: number]: Option<number>;
    };

    // We must populate a "ghost" main WS if none exists in the DB.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    newOptions[0] ||= {
      label: 'Main Worksheet',
      value: 0,
    };

    setWorksheetOptions(newOptions);

    if (!newOptions[viewedWorksheetNumber]) changeViewedWorksheetNumber(0);
  }, [
    curWorksheet,
    viewedSeason,
    viewedWorksheetNumber,
    setWorksheetOptions,
    changeViewedWorksheetNumber,
  ]);

  const changeWorksheetView = useCallback(
    (view: WorksheetView) => {
      setWorksheetView(view);
      // Scroll back to top when changing views
      window.scrollTo({ top: 0, left: 0 });
    },
    [setWorksheetView],
  );

  const changeViewedPerson = useCallback(
    (newPerson: 'me' | NetId) => {
      // Can't use the general handler here because person hasn't yet changed
      newPerson === 'me'
        ? setViewedWorksheetNumber(myViewedWorksheetNumber)
        : setViewedWorksheetNumber(0);
      setViewedPerson(newPerson);
    },
    [myViewedWorksheetNumber, setViewedPerson, setViewedWorksheetNumber],
  );

  const getRelevantWorksheetNumber = useCallback(
    (seasonCode: Season) => {
      if (viewedPerson !== 'me' || seasonCode !== viewedSeason) return 0;
      return viewedWorksheetNumber;
    },
    [viewedPerson, viewedSeason, viewedWorksheetNumber],
  );

  const exitExoticWorksheet = useCallback(() => {
    setExoticWorksheet(undefined);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('ws');
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${searchParams}`,
    );
  }, []);

  const isExoticWorksheet = Boolean(exoticWorksheet);
  const isReadonlyWorksheet = isExoticWorksheet || viewedPerson !== 'me';

  const store = useMemo(
    () => ({
      seasonCodes,
      viewedSeason,
      viewedWorksheetNumber,
      myViewedWorksheetNumber,
      viewedPerson,
      getRelevantWorksheetNumber,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,
      myWorksheetOptions,
      isExoticWorksheet,
      isReadonlyWorksheet,
      exitExoticWorksheet,
      changeViewedSeason,
      changeViewedPerson,
      setHoverCourse,
      changeWorksheetView,
      changeViewedWorksheetNumber,
    }),
    [
      seasonCodes,
      viewedSeason,
      viewedWorksheetNumber,
      myViewedWorksheetNumber,
      viewedPerson,
      getRelevantWorksheetNumber,
      courses,
      hoverCourse,
      worksheetView,
      worksheetLoading,
      worksheetError,
      worksheetOptions,
      myWorksheetOptions,
      isExoticWorksheet,
      isReadonlyWorksheet,
      changeViewedSeason,
      changeViewedPerson,
      changeWorksheetView,
      changeViewedWorksheetNumber,
      exitExoticWorksheet,
    ],
  );

  return (
    <WorksheetContext.Provider value={store}>
      {children}
    </WorksheetContext.Provider>
  );
}

export const useWorksheet = () => useContext(WorksheetContext)!;
