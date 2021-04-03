import React, { useState, useMemo } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { BsArrowLeft } from 'react-icons/bs';
import SearchResults from './SearchResults';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';

// import { useEffect, useState, useRef, useMemo } from 'react';
import styles from './WorksheetExpandedList.module.css';
import select_styles from './WorksheetRowDropdown.module.css';
import { useUser } from '../user';
import SortbyReactSelect from './SortByReactSelect';
import { SurfaceComponent } from './StyledComponents';
import { getNumFB, sortCourses } from '../courseUtilities';
import styled from 'styled-components';
import { useWorksheet } from '../worksheetContext';
import { useSearch } from '../searchContext';

const StyledExpandLink = styled(Button)`
  color: ${({ theme }) => theme.text[1]};
  font-weight: normal;
  &:hover {
    text-decoration: none !important;
    color: ${({ theme }) => theme.primary};
  }
  &:focus {
    box-shadow: none !important;
  }
`;

/**
 * Render expanded worksheet list after maximize button is clicked
 */

const WorksheetExpandedList = () => {
  const { user } = useUser();
  const [isList, setView] = useState(true);

  const { courses, cur_expand, handleCurExpand } = useWorksheet();

  const { ordering, num_fb } = useSearch();

  const WorksheetData = useMemo(() => {
    // Apply sorting order.
    return sortCourses(courses, ordering, num_fb);
  }, [ordering, courses, num_fb]);

  return (
    <div className={styles.container}>
      <Row className="mx-auto">
        {/* Worksheet courses in search results format */}
        <Col md={9} className="pr-3 pl-0">
          <SearchResults
            data={WorksheetData}
            expanded={cur_expand !== 'list'}
            isLoggedIn
            isList={isList}
            setView={setView}
            num_fb={num_fb}
          />
        </Col>
        {/* Season and FB friends dropdown */}
        <Col md={3} className="p-0">
          <SurfaceComponent
            layer={0}
            className={`${styles.select_col} p-2 mt-3`}
          >
            <Row className="mx-auto">
              <StyledExpandLink
                variant="link"
                className="py-0"
                onClick={() => handleCurExpand('none')}
              >
                <BsArrowLeft size={24} /> Go to calendar view
              </StyledExpandLink>
            </Row>
            <Row className="mx-auto mt-2">
              <div
                className={`${select_styles.select_container} ${select_styles.hover_effect}`}
              >
                <SeasonReactSelect />
              </div>
            </Row>
            <Row className="mx-auto mt-2">
              <div
                className={
                  select_styles.select_container +
                  (user.fbLogin ? ` ${select_styles.hover_effect}` : '')
                }
              >
                <FBReactSelect />
              </div>
            </Row>
            <Row className="mx-auto mt-2">
              <SortbyReactSelect />
            </Row>
          </SurfaceComponent>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(WorksheetExpandedList);
