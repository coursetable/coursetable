import React, { useMemo } from 'react';

import { useSearch } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { sortCourses } from '../../utilities/course';
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
