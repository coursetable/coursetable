import React, { useEffect, useState, useRef, useMemo } from 'react';

import { Row, Container } from 'react-bootstrap';

import styles from './WorksheetExpandedList.module.css';
import search_results_styles from './SearchResults.module.css';
import SearchResultsItemMemo from './SearchResultsItem';
import WorksheetSettingsDropdown from './WorksheetSettingsDropdown';
import { useWindowDimensions } from './WindowDimensionsProvider';

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_expand - string | Determines whether or not the list is expanded
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
  cur_expand,
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
  }, [width, cur_expand]);
  const COL_SPACING = {
    CODE_WIDTH: 110,
    RATE_WIDTH: 30,
    NUM_WIDTH: 40,
    PROF_WIDTH: 150,
    MEET_WIDTH: 160,
    LOC_WIDTH: 100,
    SA_WIDTH: 100,
    PADDING: 35,
    PROF_CUT: 730,
    MEET_CUT: 830,
    LOC_CUT: 930,
    SA_CUT: 1030,
  };
  const TITLE_WIDTH = useMemo(() => {
    return (
      ROW_WIDTH -
      COL_SPACING.CODE_WIDTH -
      COL_SPACING.LOC_WIDTH -
      (ROW_WIDTH > COL_SPACING.PROF_CUT ? COL_SPACING.PROF_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.MEET_CUT ? COL_SPACING.MEET_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.SA_CUT ? COL_SPACING.SA_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.LOC_CUT ? COL_SPACING.LOC_WIDTH : 0) -
      3 * COL_SPACING.RATE_WIDTH -
      2 * COL_SPACING.NUM_WIDTH -
      COL_SPACING.PADDING
    );
  }, [ROW_WIDTH, COL_SPACING]);

  // List that holds the HTML for the list of courses
  let items = [];
  // Iterate over each listing
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    // Add list item HTML to items list
    items.push(
      <div key={i}>
        <SearchResultsItemMemo
          course={course}
          showModal={showModal}
          isLast={i === courses.length - 1}
          hasSeason={hasSeason}
          COL_SPACING={COL_SPACING}
          TITLE_WIDTH={TITLE_WIDTH}
          ROW_WIDTH={ROW_WIDTH}
        />
      </div>
    );
  }
  // Column width styles
  const code_style = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: '15px',
  };
  const title_style = { width: `${TITLE_WIDTH}px` };
  const rate_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WIDTH}px`,
  };
  const prof_style = { width: `${COL_SPACING.PROF_WIDTH}px` };
  const meet_style = { width: `${COL_SPACING.MEET_WIDTH}px` };
  const loc_style = { width: `${COL_SPACING.LOC_WIDTH}px` };
  const num_style = { width: `${COL_SPACING.NUM_WIDTH}px` };
  const sa_style = { width: `${COL_SPACING.SA_WIDTH}px` };

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
              <div style={code_style} className={Styles.results_header}>
                Code
              </div>
              {/* Course Name */}
              <div style={title_style} className={Styles.results_header}>
                Title
              </div>
              <div style={num_style} className={Styles.results_header}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 100, hide: 100 }}
                  overlay={enrollment_tooltip}
                >
                  <span className="m-auto">#</span>
                </OverlayTrigger>
              </div>
              <div style={num_style} className={Styles.results_header}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 100, hide: 100 }}
                  overlay={fb_tooltip}
                >
                  <span className="m-auto">#FB</span>
                </OverlayTrigger>
              </div>
              {/* Class Rating */}
              <div style={rate_style} className={Styles.results_header}>
                <div className="m-auto">
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 100 }}
                    overlay={class_tooltip}
                  >
                    <AiFillStar
                      color="#fac000"
                      style={{ display: 'block' }}
                      size={20}
                    />
                  </OverlayTrigger>
                </div>
              </div>
              {/* Professor Rating */}
              <div style={rate_style} className={Styles.results_header}>
                <div className="m-auto">
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 100 }}
                    overlay={prof_tooltip}
                  >
                    <FaAppleAlt
                      color="#fa6e6e"
                      style={{ display: 'block' }}
                      size={16}
                    />
                  </OverlayTrigger>
                </div>
              </div>
              {/* Workload Rating */}
              <div style={rate_style} className={Styles.results_header}>
                <div className="m-auto">
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 100, hide: 100 }}
                    overlay={workload_tooltip}
                  >
                    <FcReading style={{ display: 'block' }} size={20} />
                  </OverlayTrigger>
                </div>
              </div>
              {/* Course Professors */}
              {ROW_WIDTH > COL_SPACING.PROF_CUT && (
                <div style={prof_style} className={Styles.results_header}>
                  Professors
                </div>
              )}
              {/* Course Meeting times and location */}
              {ROW_WIDTH > COL_SPACING.MEET_CUT && (
                <div style={meet_style} className={Styles.results_header}>
                  Meets
                </div>
              )}
              {ROW_WIDTH > COL_SPACING.LOC_CUT && (
                <div style={loc_style} className={Styles.results_header}>
                  Location
                </div>
              )}
              {ROW_WIDTH > COL_SPACING.SA_CUT && (
                <div
                  style={sa_style}
                  className={Styles.results_header + ' pr-2'}
                >
                  Skills/Areas
                </div>
              )}
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
