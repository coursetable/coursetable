import React, { useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';

import { sortCourses } from '../../utilities/courseUtilities';
import { useWorksheet } from '../../contexts/worksheetContext';
import { useSearch } from '../../contexts/searchContext';
import Results from '../Search/Results';

/**
 * Render expanded worksheet list after maximize button is clicked
 */

function WorksheetList() {
  const [isList, setView] = useState(true);
  const { courses, worksheetLoading } = useWorksheet();

  const { ordering, numFriends, isLoggedIn } = useSearch();

  const WorksheetData = useMemo(() => {
    // Apply sorting order.
    return sortCourses(courses, ordering, numFriends);
  }, [ordering, courses, numFriends]);

  return (
    <div>
      <Row className="p-0 m-0">
        {/* Catalog Search Search */}
        <Col md={12} className="m-0 px-0 pb-3">
          <div className="d-flex justify-content-center">
            <Results
              data={WorksheetData}
              isList={isList}
              setView={setView}
              loading={worksheetLoading}
              multiSeasons={false}
              isLoggedIn={isLoggedIn}
              numFriends={numFriends}
              page="worksheet"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default WorksheetList;
