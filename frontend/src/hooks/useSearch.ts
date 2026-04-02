import { useMemo, type SetStateAction } from 'react';

import { defaultFilters, emptyFilters } from '../search/searchConstants';
import type { FilterList, Filters } from '../search/searchTypes';
import type { SearchSlice } from '../slices/SearchSlice';
import { useStore } from '../store';
import { isEqual } from '../utilities/common';

function buildFilterHandles(
  searchFilters: Filters,
  setSearchFilter: SearchSlice['setSearchFilter'],
): FilterList {
  return Object.fromEntries(
    (Object.keys(searchFilters) as (keyof Filters)[]).map((key) => [
      key,
      {
        value: searchFilters[key],
        set(v: SetStateAction<(typeof searchFilters)[typeof key]>) {
          setSearchFilter(key, v);
        },
        isDefault: isEqual(searchFilters[key], defaultFilters[key]),
        isNonEmpty: !isEqual(searchFilters[key], emptyFilters[key]),
        resetToDefault() {
          setSearchFilter(key, defaultFilters[key]);
        },
        resetToEmpty() {
          setSearchFilter(key, emptyFilters[key]);
        },
      },
    ]),
  ) as FilterList;
}

export function useSearch() {
  const searchFilters = useStore((s) => s.searchFilters);
  const setSearchFilter = useStore((s) => s.setSearchFilter);
  const coursesLoading = useStore((s) => s.coursesLoading);
  const searchData = useStore((s) => s.searchData);
  const multiSeasons = useStore((s) => s.multiSeasons);
  const numFriends = useStore((s) => s.numFriends);
  const duration = useStore((s) => s.duration);
  const setSearchStartTime = useStore((s) => s.setSearchStartTime);

  const filters = useMemo(
    () => buildFilterHandles(searchFilters, setSearchFilter),
    [searchFilters, setSearchFilter],
  );

  return useMemo(
    () => ({
      filters,
      coursesLoading,
      searchData,
      multiSeasons,
      numFriends,
      duration,
      setStartTime: setSearchStartTime,
    }),
    [
      filters,
      coursesLoading,
      searchData,
      multiSeasons,
      numFriends,
      duration,
      setSearchStartTime,
    ],
  );
}
