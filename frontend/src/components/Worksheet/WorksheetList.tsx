import React, { useState, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';

import { sortCourses } from '../../utilities/courseUtilities';
import { useWorksheet } from '../../contexts/worksheetContext';
import { useSearch } from '../../contexts/searchContext';
import Results from '../Search/Results';

/**
 * Render expanded worksheet list after maximize button is clicked
 */

const WorksheetList = () => {
  const [isList, setView] = useState(true);

  const { courses, worksheetLoading, showModal } = useWorksheet();

  const { ordering, num_fb, isLoggedIn } = useSearch();

  const WorksheetData = useMemo(() => {
    // Apply sorting order.
    return sortCourses(courses, ordering, num_fb);
  }, [ordering, courses, num_fb]);

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
              showModal={showModal}
              isLoggedIn={isLoggedIn}
              num_fb={num_fb}
              page="worksheet"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(WorksheetList);
