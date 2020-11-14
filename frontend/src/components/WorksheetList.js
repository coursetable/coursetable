import React, { useCallback, useMemo } from 'react';
import styles from './WorksheetList.module.css';
import { Row, Col, ListGroup } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetRowDropdown from './WorksheetRowDropdown';
import { StyledListItem } from './StyledComponents';

/**
 * Render worksheet list in default worksheet view
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop toggleCourse - function to hide/show course
 * @prop setHoverCourse - function to darken calendar events of this listing
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function WorksheetList({
  courses,
  showModal,
  cur_season,
  season_codes,
  onSeasonChange,
  toggleCourse,
  setHoverCourse,
  setFbPerson,
  cur_person,
}) {
  // Build the HTML for the list of courses of a given season
  const buildHtml = useCallback(
    (cur_season, courses) => {
      // List to hold HTML
      let items = [];
      // Variable for list keys
      let id = 0;
      // Iterate over all listings of this season
      courses.forEach((course) => {
        // Add listgroup item to items list
        items.push(
          <StyledListItem
            key={id++}
            className={styles.clickable + ' py-1 px-2'}
            onMouseEnter={() => {
              setHoverCourse(course);
            }}
            onMouseLeave={() => {
              setHoverCourse(null);
            }}
          >
            {/* Bookmark Button */}
            <div className={styles.bookmark}>
              <WorksheetToggleButton
                worksheetView={true}
                crn={course.crn}
                season_code={cur_season}
                modal={false}
              />
            </div>
            <Row className="align-items-center mx-auto">
              {/* Hide Button */}
              <Col xs="auto" className="pl-0 pr-2 my-auto">
                <Row className="m-auto">
                  <WorksheetHideButton
                    toggleCourse={toggleCourse}
                    crn={course.crn}
                    season_code={cur_season}
                  />
                </Row>
              </Col>
              {/* Course Code and Title */}
              <Col
                className={
                  (course.hidden ? styles.hidden + ' ' : '') +
                  styles.list_text +
                  ' px-0'
                }
                onClick={() => showModal(course)}
              >
                <strong>{course.course_code}</strong>
                <br />
                <span className={styles.course_title}>{course.title}</span>
              </Col>
            </Row>
          </StyledListItem>
        );
      });

      return items;
    },
    [setHoverCourse, toggleCourse, showModal]
  );

  const items = useMemo(() => {
    return buildHtml(cur_season, courses);
  }, [buildHtml, courses, cur_season]);

  return (
    <div className={styles.container}>
      {/* Season and FB friends dropdown */}
      <WorksheetRowDropdown
        cur_season={cur_season}
        season_codes={season_codes}
        onSeasonChange={onSeasonChange}
        setFbPerson={setFbPerson}
        cur_person={cur_person}
      />
      {/* List of courses for this season */}
      <div className={styles.table}>
        <ListGroup variant="flush">{items}</ListGroup>
      </div>
    </div>
  );
}

// WorksheetList.whyDidYouRender = true;
export default React.memo(WorksheetList);
