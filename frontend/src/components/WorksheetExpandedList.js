import React, { useEffect, useState, useRef } from 'react';

import { Row, Container } from 'react-bootstrap';

import styles from './WorksheetExpandedList.module.css';
import search_results_styles from './SearchResults.module.css';
import SearchResultsItem from './SearchResultsItem';
import WorksheetSettingsDropdown from './WorksheetSettingsDropdown';
import { useWindowDimensions } from './WindowDimensionsProvider';

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop end_fade - boolean | Is the fading animation over so we can get width of row?
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop hasSeason - function to pass to bookmark button
 * @prop setFbPerson - function to change FB person
 * @prop fb_person - string of current person who's worksheet we are viewing
 */

const WorksheetExpandedList = ({
  courses,
  showModal,
  end_fade,
  cur_season,
  season_codes,
  onSeasonChange,
  hasSeason,
  setFbPerson,
  fb_person,
}) => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  // State that holds width of row
  const [ROW_WIDTH, setRowWidth] = useState();
  // Ref to get row width
  const ref_width = useRef(null);
  useEffect(() => {
    // Update row width on window resize or once the animation is over
    if (ref_width.current) setRowWidth(ref_width.current.offsetWidth);
  }, [width, end_fade]);
  // Spacing for columns
  const PROF_WIDTH = 250;
  const MEET_WIDTH = 250;
  const RATE_WIDTH = 70;
  const BOOKMARK_WIDTH = 50;
  const PADDING = 50;
  const PROF_CUT = 1300;
  const MEET_CUT = 1000;

  // List that holds the HTML for the list of courses
  let items = [];
  // Iterate over each listing
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    // Add list item HTML to items list
    items.push(
      <div key={i}>
        {end_fade ? (
          // Fade animation finished, and we can display data
          <SearchResultsItem
            course={course}
            showModal={showModal}
            isLast={i === courses.length - 1}
            hasSeason={hasSeason}
            ROW_WIDTH={ROW_WIDTH}
            PROF_WIDTH={PROF_WIDTH}
            MEET_WIDTH={MEET_WIDTH}
            RATE_WIDTH={RATE_WIDTH}
            BOOKMARK_WIDTH={BOOKMARK_WIDTH}
            PADDING={PADDING}
            PROF_CUT={PROF_CUT}
            MEET_CUT={MEET_CUT}
          />
        ) : (
            // Fade animation hasn't finished
            <Row
              className="mx-auto my-0 p-0"
              style={{ height: '67px', borderBottom: 'solid 2px #f6f6f6' }}
            >
              <strong className="m-auto">Loading...</strong>
            </Row>
          )}
      </div>
    );
  }

  return (
    <div>
      <Container
        fluid
        id="results_container"
        className={
          `px-0  ${search_results_styles.results_container} ${styles.shadow}` +
          (courses.length > 5 ? ' ' + styles.scrollable : '')
        }
      >
        <div className={`${search_results_styles.sticky_header}`}>
          {/* Header Row */}
          <Row
            ref={ref_width}
            className={
              'mx-auto px-2 py-2 shadow-sm justify-content-between ' +
              search_results_styles.results_header_row
            }
          >
            <React.Fragment>
              {/* Course Title, Code, and Skills/Areas */}
              <div
                style={{
                  lineHeight: '30px',
                  width: `${ROW_WIDTH -
                    (width > PROF_CUT ? PROF_WIDTH : 0) -
                    (width > MEET_CUT ? MEET_WIDTH : 0) -
                    3 * RATE_WIDTH -
                    BOOKMARK_WIDTH -
                    PADDING
                    }px`,
                  paddingLeft: '15px',
                }}
              >
                <strong>{'Course'}</strong>
              </div>
              {/* Course Professors */}
              {width > PROF_CUT && (
                <div
                  style={{ lineHeight: '30px', width: `${PROF_WIDTH}px` }}
                  className="pr-4"
                >
                  <strong>{'Professors'}</strong>
                </div>
              )}
              {/* Course Meet Times and Location */}
              {width > MEET_CUT && (
                <div style={{ lineHeight: '30px', width: `${MEET_WIDTH}px` }}>
                  <strong>{'Meets'}</strong>
                </div>
              )}
              {/* Class Rating */}
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Class'}</strong>
              </div>
              {/* Professor Rating */}
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Prof'}</strong>
              </div>
              {/* Workload Rating */}
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Work'}</strong>
              </div>
            </React.Fragment>
            {/* Settings Dropdown to switch season and FB friend worksheet */}
            <div
              style={{
                lineHeight: '30px',
                width: `${BOOKMARK_WIDTH}px`,
                paddingRight: '15px',
              }}
              className="d-flex"
            >
              <WorksheetSettingsDropdown
                cur_season={cur_season}
                season_codes={season_codes}
                onSeasonChange={onSeasonChange}
                setFbPerson={setFbPerson}
                cur_person={fb_person}
              />
            </div>
          </Row>
        </div>
        {/* Render HTML of items */}
        <div className={styles.results_list_container}>{items}</div>
      </Container>
    </div>
  );
};

export default WorksheetExpandedList;
