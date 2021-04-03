import React, { useState, useMemo } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { FaCompressAlt } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import SearchResults from './SearchResults';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';

// import { useEffect, useState, useRef, useMemo } from 'react';
import styles from './WorksheetExpandedList.module.css';
import select_styles from './WorksheetRowDropdown.module.css';
import worksheet_styles from '../pages/Worksheet.module.css';
import { useUser } from '../user';
import SortbyReactSelect from './SortByReactSelect';
import { SurfaceComponent, StyledExpandBtn } from './StyledComponents';
import { getNumFB, sortCourses } from '../courseUtilities';
import styled from 'styled-components';

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
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_expand - string | Determines whether or not the list is expanded
 * @prop cur_season - string that holds the current season code
 * @prop season_options - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop fb_person - string of current person who's worksheet we are viewing
 * @prop setCurExpand - function to minimize the expanded list view
 */

const WorksheetExpandedList = ({
  courses,
  showModal,
  cur_expand,
  cur_season,
  season_options,
  onSeasonChange,
  setFbPerson,
  fb_person,
  setCurExpand,
}) => {
  const { user } = useUser();
  const [isList, setView] = useState(true);
  // State that determines sort order
  const [ordering, setOrdering] = useState({ course_code: 'asc' });
  // Object that holds a list of each fb friend taking a specific course
  const num_fb = useMemo(() => {
    if (!user.fbLogin || !user.fbWorksheets) return {};
    return getNumFB(user.fbWorksheets);
  }, [user.fbLogin, user.fbWorksheets]);

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
            showModal={showModal}
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
                onClick={() => setCurExpand('none')}
              >
                <BsArrowLeft size={24} /> Go to calendar view
              </StyledExpandLink>
            </Row>
            <Row className="mx-auto mt-2">
              <div
                className={`${select_styles.select_container} ${select_styles.hover_effect}`}
              >
                <SeasonReactSelect
                  cur_season={cur_season}
                  season_options={season_options}
                  onSeasonChange={onSeasonChange}
                />
              </div>
            </Row>
            <Row className="mx-auto mt-2">
              <div
                className={
                  select_styles.select_container +
                  (user.fbLogin ? ` ${select_styles.hover_effect}` : '')
                }
              >
                <FBReactSelect
                  cur_season={cur_season}
                  setFbPerson={setFbPerson}
                  cur_person={fb_person}
                />
              </div>
            </Row>
            <Row className="mx-auto mt-2">
              <SortbyReactSelect setOrdering={setOrdering} />
            </Row>
            {/* <StyledExpandBtn
              className={`${worksheet_styles.expand_btn} ${styles.top_left}`}
            >
              <FaCompressAlt
                size={12}
                className={worksheet_styles.expand_icon}
                onClick={() => {
                  // Compress list
                  setCurExpand('none');
                }}
              />
            </StyledExpandBtn> */}
          </SurfaceComponent>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(WorksheetExpandedList);
