import React, { useMemo } from 'react';

import { sortCourses } from '../../utilities/course';
import { useWorksheet } from '../../contexts/worksheetContext';
import { useSearch } from '../../contexts/searchContext';
import Results from '../Search/Results';

function WorksheetList() {
  const { courses, worksheetLoading } = useWorksheet();

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
