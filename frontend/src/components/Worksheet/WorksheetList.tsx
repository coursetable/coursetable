import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSearch } from '../../contexts/searchContext';
import { useStore } from '../../store';
import { sortCourses } from '../../utilities/course';
import Results from '../Search/Results';

function WorksheetList() {
  const { courses, worksheetLoading } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      worksheetLoading: state.worksheetLoading,
    })),
  );

  const {
    filters: { selectSortBy, sortOrder },
    numFriends,
  } = useSearch();

  const worksheetData = useMemo(
    () =>
      sortCourses(
        courses.map((course) => course.listing),
        { key: selectSortBy.value.value, type: sortOrder.value },
        numFriends,
      ),
    [selectSortBy, sortOrder, courses, numFriends],
  );

  return (
    <Results
      data={worksheetData}
      loading={worksheetLoading}
      multiSeasons={false}
      page="worksheet"
    />
  );
}

export default WorksheetList;
