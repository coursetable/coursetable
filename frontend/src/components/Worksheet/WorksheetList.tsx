import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../contexts/searchContext';
import { useWorksheet, WorksheetCourse } from '../../contexts/worksheetContext';
import { useCourseData } from '../../contexts/ferryContext';
import { sortCourses, linkDataToCourses } from '../../utilities/course';
import Results from '../Search/Results';

function WorksheetList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [linkCourses, setLinkCourses] = useState<WorksheetCourse[]>([]);
  const { courses, worksheetLoading, curSeason } = useWorksheet();

  const {
    filters: { selectSortBy, sortOrder },
    numFriends,
  } = useSearch();

  const worksheetData = useMemo(
    () => {
      if (linkCourses.length == 0) {
        return sortCourses(
            courses.map((course) => course.listing),
            { key: selectSortBy.value.value, type: sortOrder.value },
            numFriends,
          )
      } else {
        return sortCourses(
          linkCourses.map((course) => course.listing),
          { key: selectSortBy.value.value, type: sortOrder.value },
          numFriends,
        )
      }
    },
    [selectSortBy, sortOrder, courses, linkCourses, numFriends],
  );

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData([curSeason]);

  useEffect(() => {
    const data = searchParams.get("ws");
    if (!data) return;
    const courseObjects = linkDataToCourses(courseData, curSeason, data);
    setLinkCourses(courseObjects);
  }, [])

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
