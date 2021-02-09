import React, { createContext, useContext, useMemo, useState } from 'react';
import { useSessionStorageState } from './browserStorage';

export type Option = {
  label: string;
  value: string;
  color?: string;
};

export type sortType = 'desc' | 'asc' | undefined;

type Store = {
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
};

const SearchContext = createContext<Store | undefined>(undefined);
SearchContext.displayName = 'SearchContext';

const defaultOptions: Option[] = [];
const defaultOverallBounds = [1, 5];
const defaultWorkloadBounds = [1, 5];
const defaultSeason: Option[] = [{ value: '202101', label: 'Spring 2021' }];

export const defaultFilters = {
  defaultOptions,
  defaultOverallBounds,
  defaultWorkloadBounds,
  defaultSeason,
};

/**
 * Stores the user's search, filters, and sorts
 */
export const SearchProvider: React.FC = ({ children }) => {
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

  const store = useMemo(
    () => ({
      // Context state.
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

      // Update methods.
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
    }),
    [
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
    ]
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext)!;
