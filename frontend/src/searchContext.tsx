import posthog from 'posthog-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GroupedOptionsType, OptionsType } from 'react-select/src/types';
import { useSessionStorageState } from './browserStorage';
import { Listing, useCourseData, useFerry } from './components/FerryProvider';
import { getNumFB, getOverallRatings, sortCourses } from './courseUtilities';
import {
  areas,
  AreasType,
  skills,
  SkillsType,
  sortbyOptions,
  SortKeys,
} from './queries/Constants';
import { useUser } from './user';

export type Option = {
  label: string;
  value: string;
  color?: string;
  numeric?: boolean;
};

export type SortType = 'desc' | 'asc' | undefined;

export type OrderingType = {
  [key in SortKeys]?: SortType;
};

export type OptType =
  | OptionsType<Option>
  | GroupedOptionsType<Option>
  | undefined;

type Store = {
  canReset: boolean;
  searchText: string;
  select_subjects: Option[];
  select_skillsareas: Option[];
  overallBounds: number[];
  overallValueLabels: number[];
  workloadBounds: number[];
  workloadValueLabels: number[];
  select_seasons: Option[];
  select_schools: Option[];
  select_credits: Option[];
  hideCancelled: boolean;
  hideFirstYearSeminars: boolean;
  hideGraduateCourses: boolean;
  select_sortby: Option;
  sort_order: SortType;
  ordering: OrderingType;
  seasonsOptions: OptType;
  coursesLoading: boolean;
  searchData: Listing[];
  multiSeasons: boolean;
  isLoggedIn: boolean;
  num_fb: Record<string, string[]>;
  setCanReset: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSelectSubjects: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectSkillsAreas: React.Dispatch<React.SetStateAction<Option[]>>;
  setOverallBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setOverallValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setWorkloadBounds: React.Dispatch<React.SetStateAction<number[]>>;
  setWorkloadValueLabels: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectSeasons: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectSchools: React.Dispatch<React.SetStateAction<Option[]>>;
  setSelectCredits: React.Dispatch<React.SetStateAction<Option[]>>;
  setHideCancelled: React.Dispatch<React.SetStateAction<boolean>>;
  setHideFirstYearSeminars: React.Dispatch<React.SetStateAction<boolean>>;
  setHideGraduateCourses: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectSortby: React.Dispatch<React.SetStateAction<Option>>;
  setSortOrder: React.Dispatch<React.SetStateAction<SortType>>;
  setOrdering: React.Dispatch<React.SetStateAction<OrderingType>>;
  handleResetFilters: () => void;
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

const defaultOptions: Option[] = [];
const defaultOverallBounds = [1, 5];
const defaultWorkloadBounds = [1, 5];
const defaultSeason: Option[] = [{ value: '202101', label: 'Spring 2021' }];
const defaultSortOption: Option = sortbyOptions[0];
const defaultSortOrder: SortType = 'asc';
const defaultOrdering: OrderingType = { course_code: 'asc' };

export const defaultFilters = {
  defaultOptions,
  defaultOverallBounds,
  defaultWorkloadBounds,
  defaultSeason,
  defaultSortOption,
  defaultSortOrder,
  defaultOrdering,
};

/**
 * Stores the user's search, filters, and sorts
 */
export const SearchProvider: React.FC = ({ children }) => {
  const [canReset, setCanReset] = useSessionStorageState('canReset', false);

  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const [select_subjects, setSelectSubjects] = useSessionStorageState(
    'select_subjects',
    defaultOptions
  );
  const [select_skillsareas, setSelectSkillsAreas] = useSessionStorageState(
    'select_skillsareas',
    defaultOptions
  );

  // Bounds of course and workload ratings (1-5)
  const [overallBounds, setOverallBounds] = useSessionStorageState(
    'overallBounds',
    defaultOverallBounds
  );
  const [overallValueLabels, setOverallValueLabels] = useState(
    overallBounds !== defaultOverallBounds
      ? overallBounds
      : defaultOverallBounds
  );

  const [workloadBounds, setWorkloadBounds] = useSessionStorageState(
    'workloadBounds',
    defaultWorkloadBounds
  );
  const [workloadValueLabels, setWorkloadValueLabels] = useState(
    workloadBounds !== defaultWorkloadBounds
      ? workloadBounds
      : defaultWorkloadBounds
  );

  const [select_seasons, setSelectSeasons] = useSessionStorageState(
    'select_seasons',
    defaultSeason
  );

  const [select_schools, setSelectSchools] = useSessionStorageState(
    'select_schools',
    defaultOptions
  );
  const [select_credits, setSelectCredits] = useSessionStorageState(
    'select_credits',
    defaultOptions
  );

  // Does the user want to hide cancelled courses?
  const [hideCancelled, setHideCancelled] = useSessionStorageState(
    'hideCancelled',
    true
  );
  // Does the user want to hide first year seminars?
  const [
    hideFirstYearSeminars,
    setHideFirstYearSeminars,
  ] = useSessionStorageState('hideFirstYearSeminars', false);
  // Does the user want to hide graduate courses?
  const [hideGraduateCourses, setHideGraduateCourses] = useSessionStorageState(
    'hideGraduateCourses',
    false
  );

  // Fetch user context data
  const { user } = useUser();
  // Is the user logged in?
  const isLoggedIn = user.worksheet != null;

  // Object that holds a list of each fb friend taking a specific course
  const num_fb = useMemo(() => {
    if (!user.fbLogin || !user.fbWorksheets) return {};
    return getNumFB(user.fbWorksheets);
  }, [user.fbLogin, user.fbWorksheets]);

  // Search on page render?
  const [defaultSearch, setDefaultSearch] = useState(true);

  // State that controls sortby select
  const [select_sortby, setSelectSortby] = useSessionStorageState(
    'select_sortby',
    defaultSortOption
  );
  // State that determines sort order
  const [sort_order, setSortOrder] = useSessionStorageState<SortType>(
    'sort_order',
    defaultSortOrder
  );
  // State that determines sort order
  const [ordering, setOrdering] = useSessionStorageState(
    'ordering',
    defaultOrdering
  );
  // State to reset sortby dropdown and rating sliders
  const [reset_key, setResetKey] = useState(0);

  // populate seasons from database
  let seasonsOptions: OptType;
  const { seasons: seasonsData } = useFerry();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      const seasonOption: Option = {
        value: x.season_code,
        // capitalize term and add year
        label: `${x.term.charAt(0).toUpperCase() + x.term.slice(1)} ${x.year}`,
      };
      return seasonOption;
    });
  }

  const required_seasons = useMemo(() => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    if (select_seasons == null) {
      return [];
    }
    if (select_seasons.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasonsData.seasons.map((x) => x.season_code).slice(0, 15);
    }
    return select_seasons.map((x) => x.value);
  }, [isLoggedIn, select_seasons, seasonsData]);

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(required_seasons);

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const multiSeasons = required_seasons.length !== 1;

  const searchConfig = useMemo(() => {
    // skills and areas
    let processedSkillsAreas;
    let processedSkills;
    let processedAreas;
    if (select_skillsareas != null) {
      processedSkillsAreas = select_skillsareas.map((x) => {
        return x.value;
      });

      // match all languages
      if (processedSkillsAreas.includes('L')) {
        processedSkillsAreas = processedSkillsAreas.concat([
          'L1',
          'L2',
          'L3',
          'L4',
          'L5',
        ]);
      }

      // separate skills and areas
      processedSkills = processedSkillsAreas.filter((x: any): x is SkillsType =>
        skills.includes(x)
      );
      processedAreas = processedSkillsAreas.filter((x: any): x is AreasType =>
        areas.includes(x)
      );

      // set null defaults
      if (processedSkills.length === 0) {
        processedSkills = null;
      }
      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    // credits to filter
    let processedCredits;
    if (select_credits != null) {
      processedCredits = select_credits.map((x) => {
        return x.value;
      });
      // set null defaults
      if (processedCredits.length === 0) {
        processedCredits = null;
      }
    }

    // schools to filter
    let processedSchools;
    if (select_schools != null) {
      processedSchools = select_schools.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSchools.length === 0) {
        processedSchools = null;
      }
    }

    // subject to filter
    let processedSubjects;
    if (select_subjects != null) {
      processedSubjects = select_subjects.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSubjects.length === 0) {
        processedSubjects = null;
      }
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    const include_all_overalls =
      overallBounds[0] === 1 && overallBounds[1] === 5;

    const include_all_workloads =
      workloadBounds[0] === 1 && workloadBounds[1] === 5;

    // Variables to use in search query
    const search_variables = {
      search_text: searchText,
      // seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(processedCredits),
      schools: new Set(processedSchools),
      subjects: new Set(processedSubjects),
      min_overall: include_all_overalls ? null : overallBounds[0],
      max_overall: include_all_overalls ? null : overallBounds[1],
      min_workload: include_all_workloads ? null : workloadBounds[0],
      max_workload: include_all_workloads ? null : workloadBounds[1],
      extra_info: hideCancelled ? 'ACTIVE' : null,
      fy_sem: hideFirstYearSeminars ? false : null,
      grad_level: hideGraduateCourses ? false : null,
    };

    // Track search
    posthog.capture('search', {
      ...search_variables,
      search_text_clean: search_variables.search_text || '[none]',
    });

    return search_variables;
  }, [
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    overallBounds,
    select_credits,
    select_schools,
    select_skillsareas,
    select_subjects,
    workloadBounds,
    searchText,
  ]);

  const searchData = useMemo(() => {
    // Match search results with course data.
    if (coursesLoading || courseLoadError) return [];
    if (Object.keys(searchConfig).length === 0) return [];

    // Pre-processing for the search text.
    const tokens = (searchConfig.search_text || '')
      .split(/\s+/)
      .filter((x) => !!x)
      .map((token) => token.toLowerCase());

    const listings = required_seasons
      .map((season_code) => {
        if (!courseData[season_code]) return [];
        return [...courseData[season_code].values()];
      })
      .reduce((acc, cur) => acc.concat(cur), []);

    const filtered = listings.filter((listing) => {
      // Apply filters.
      const average_overall = Number(getOverallRatings(listing));
      if (
        searchConfig.min_overall !== null &&
        searchConfig.max_overall !== null &&
        (average_overall === null ||
          average_overall < searchConfig.min_overall ||
          average_overall > searchConfig.max_overall)
      ) {
        return false;
      }

      if (
        searchConfig.min_workload !== null &&
        searchConfig.max_workload !== null &&
        (listing.average_workload === null ||
          listing.average_workload < searchConfig.min_workload ||
          listing.average_workload > searchConfig.max_workload)
      ) {
        return false;
      }

      if (
        searchConfig.extra_info !== null &&
        searchConfig.extra_info !== listing.extra_info
      ) {
        return false;
      }

      if (
        searchConfig.fy_sem !== null &&
        searchConfig.fy_sem !== listing.fysem
      ) {
        return false;
      }

      if (
        searchConfig.grad_level !== null &&
        (listing.number === null ||
          // tests if first character is between 5-9
          (listing.number.charAt(0) >= '5' &&
            listing.number.charAt(0) <= '9') ||
          // otherwise if first character is not a number (i.e. summer classes), tests whether second character between 5-9
          ((listing.number.charAt(0) < '0' || listing.number.charAt(0) > '9') &&
            (listing.number.length <= 1 ||
              (listing.number.charAt(1) >= '5' &&
                listing.number.charAt(1) <= '9'))))
      ) {
        return false;
      }

      if (
        searchConfig.subjects.size !== 0 &&
        !searchConfig.subjects.has(listing.subject)
      ) {
        return false;
      }

      if (
        (searchConfig.areas.size !== 0 || searchConfig.skills.size !== 0) &&
        !listing.areas.some((v: any): v is AreasType =>
          searchConfig.areas.has(v)
        ) &&
        !listing.skills.some((v: any): v is SkillsType =>
          searchConfig.skills.has(v)
        )
      ) {
        return false;
      }

      if (
        searchConfig.credits.size !== 0 &&
        listing.credits !== null &&
        !searchConfig.credits.has(String(listing.credits))
      ) {
        return false;
      }

      if (
        searchConfig.schools.size !== 0 &&
        listing.school !== null &&
        !searchConfig.schools.has(listing.school)
      ) {
        return false;
      }

      // Handle search text. Each token must match something.
      for (const token of tokens) {
        if (
          listing.subject.toLowerCase().startsWith(token) ||
          listing.number.toLowerCase().startsWith(token) ||
          listing.title.toLowerCase().includes(token) ||
          listing.professor_names.some((professor) =>
            professor.toLowerCase().includes(token)
          )
        )
          continue;

        return false;
      }

      return true;
    });

    // Apply sorting order.
    return sortCourses(filtered, ordering, num_fb);
  }, [
    required_seasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
    ordering,
    num_fb,
  ]);

  const handleResetFilters = useCallback(() => {
    setSearchText('');
    setHideCancelled(true);
    setHideFirstYearSeminars(false);
    setHideGraduateCourses(false);
    setOverallBounds(defaultOverallBounds);
    setWorkloadBounds(defaultWorkloadBounds);
    setSelectSeasons(defaultSeason);
    setSelectSkillsAreas(defaultOptions);
    setSelectCredits(defaultOptions);
    setSelectSchools(defaultOptions);
    setSelectSubjects(defaultOptions);

    setSelectSortby(defaultSortOption);
    setSortOrder(defaultSortOrder);
    setOrdering(defaultOrdering);

    setResetKey(reset_key + 1);

    setCanReset(false);
  }, [
    reset_key,
    setSearchText,
    setSelectSubjects,
    setSelectSkillsAreas,
    setOverallBounds,
    setWorkloadBounds,
    setSelectSeasons,
    setSelectSchools,
    setSelectCredits,
    setHideCancelled,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setSelectSortby,
    setSortOrder,
    setOrdering,
    setCanReset,
  ]);

  // perform default search on load
  useEffect(() => {
    // only execute after seasons have been loaded
    if (defaultSearch && seasonsOptions) {
      setDefaultSearch(false);
      // setCanReset(false);
    }
  }, [seasonsOptions, defaultSearch]);

  // Set ordering in parent element whenever sortby or order changes
  useEffect(() => {
    const sortParams = select_sortby.value;
    const newOrdering: {
      [key in SortKeys]?: SortType;
    } = {
      [sortParams]: sort_order,
    };
    setOrdering(newOrdering);
  }, [select_sortby, sort_order, setOrdering]);

  const store = useMemo(
    () => ({
      // Context state.
      canReset,
      searchText,
      select_subjects,
      select_skillsareas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      select_seasons,
      select_schools,
      select_credits,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      select_sortby,
      sort_order,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      num_fb,

      // Update methods.
      setCanReset,
      setSearchText,
      setSelectSubjects,
      setSelectSkillsAreas,
      setOverallBounds,
      setOverallValueLabels,
      setWorkloadBounds,
      setWorkloadValueLabels,
      setSelectSeasons,
      setSelectSchools,
      setSelectCredits,
      setHideCancelled,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
    }),
    [
      canReset,
      searchText,
      select_subjects,
      select_skillsareas,
      overallBounds,
      overallValueLabels,
      workloadBounds,
      workloadValueLabels,
      select_seasons,
      select_schools,
      select_credits,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      select_sortby,
      sort_order,
      ordering,
      seasonsOptions,
      coursesLoading,
      searchData,
      multiSeasons,
      isLoggedIn,
      num_fb,
      setCanReset,
      setSearchText,
      setSelectSubjects,
      setSelectSkillsAreas,
      setOverallBounds,
      setOverallValueLabels,
      setWorkloadBounds,
      setWorkloadValueLabels,
      setSelectSeasons,
      setSelectSchools,
      setSelectCredits,
      setHideCancelled,
      setHideFirstYearSeminars,
      setHideGraduateCourses,
      setSelectSortby,
      setSortOrder,
      setOrdering,
      handleResetFilters,
    ]
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext)!;
