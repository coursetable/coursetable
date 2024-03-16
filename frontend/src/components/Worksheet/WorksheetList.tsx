import React, { useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';

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
    <Row className="p-0 m-0">
      <Col md={12} className="m-0 px-0 pb-3">
        <div className="d-flex justify-content-center">
          <Results
            data={worksheetData}
            loading={worksheetLoading}
            multiSeasons={false}
            page="worksheet"
          />
        </div>
      </Col>
    </Row>
  );
}

export default WorksheetList;
