import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourseData } from '../../contexts/ferryContext';
import { useSearch } from '../../contexts/searchContext';
import {
  useWorksheet,
  type WorksheetCourse,
} from '../../contexts/worksheetContext';
import { sortCourses, linkDataToCourses } from '../../utilities/course';
import Results from '../Search/Results';

function WorksheetList() {
  const [searchParams] = useSearchParams();
  const [linkCourses, setLinkCourses] = useState<WorksheetCourse[]>([]);
  const { courses, worksheetLoading, viewedSeason } = useWorksheet();

  const {
    filters: { selectSortBy, sortOrder },
    numFriends,
  } = useSearch();

  const worksheetData = useMemo(() => {
    if (linkCourses.length === 0) {
      return sortCourses(
        courses.map((course) => course.listing),
        { key: selectSortBy.value.value, type: sortOrder.value },
        numFriends,
      );
    }
    return sortCourses(
      linkCourses.map((course) => course.listing),
      { key: selectSortBy.value.value, type: sortOrder.value },
      numFriends,
    );
  }, [selectSortBy, sortOrder, courses, linkCourses, numFriends]);

  const {
    // TODO: unused: loading: coursesLoading,
    courses: courseData,
    // TODO: unused: error: courseLoadError,
  } = useCourseData([viewedSeason]);

  useEffect(() => {
    const data = searchParams.get('ws');
    if (!data) return;
    const courseObjects = linkDataToCourses(courseData, viewedSeason, data);
    setLinkCourses(courseObjects);
  }, [courseData, searchParams, viewedSeason]);

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
