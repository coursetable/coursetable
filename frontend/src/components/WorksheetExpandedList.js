import React, { useEffect, useState, useRef } from 'react';

import { Row, Col, Container } from 'react-bootstrap';

import styles from './WorksheetExpandedList.module.css';
import search_results_styles from './SearchResults.module.css';
import WorksheetExpandedListItem from './WorksheetExpandedListItem';
import WorksheetSettingsDropdown from './WorksheetSettingsDropdown';
import { useComponentVisible } from '../utilities';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { FcSettings } from 'react-icons/fc';

const WorksheetExpandedList = ({
  courses,
  showModal,
  end_fade,
  cur_season,
  season_codes,
  onSeasonChange,
  hasSeason,
}) => {
  const { width } = useWindowDimensions();
  const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
  const [ROW_WIDTH, setRowWidth] = useState();
  const ref_width = useRef(null);
  useEffect(() => {
    if (ref_width.current) setRowWidth(ref_width.current.offsetWidth);
    // console.log(ROW_WIDTH);
  }, [ref_width.current, width, end_fade]);
  const PROF_WIDTH = 250;
  const MEET_WIDTH = 250;
  const RATE_WIDTH = 70;
  const BOOKMARK_WIDTH = 50;
  const PADDING = 50;
  const PROF_CUT = 1300;
  const MEET_CUT = 1000;

  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  let items = [];
  let filtered_courses = [];
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    if (course.season_code !== cur_season) continue;
    filtered_courses.push(course);
  }

  for (let i = 0; i < filtered_courses.length; i++) {
    const course = filtered_courses[i];
    items.push(
      <div key={i}>
        <WorksheetExpandedListItem
          course={course}
          showModal={showModal}
          isLast={i === filtered_courses.length - 1}
          end_fade={end_fade}
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
          (filtered_courses.length > 5 ? ' ' + styles.scrollable : '')
        }
      >
        <div className={`${search_results_styles.sticky_header}`}>
          <Row
            ref={ref_width}
            className={
              'mx-auto px-2 py-2 shadow-sm justify-content-between ' +
              search_results_styles.results_header_row +
              ' ' +
              styles.results_header_row
            }
          >
            <React.Fragment>
              <div
                style={{
                  lineHeight: '30px',
                  width: `${
                    ROW_WIDTH -
                    (width > PROF_CUT ? PROF_WIDTH : 0) -
                    (width > MEET_CUT ? MEET_WIDTH : 0) -
                    3 * RATE_WIDTH -
                    BOOKMARK_WIDTH -
                    PADDING
                  }px`,
                  paddingLeft: '15px',
                }}
                className="mr-auto"
              >
                <strong>{'Description'}</strong>
              </div>
              {width > PROF_CUT && (
                <div
                  style={{ lineHeight: '30px', width: `${PROF_WIDTH}px` }}
                  className="pr-4"
                >
                  <strong>{'Professors'}</strong>
                </div>
              )}
              {width > MEET_CUT && (
                <div style={{ lineHeight: '30px', width: `${MEET_WIDTH}px` }}>
                  <strong>{'Meets'}</strong>
                </div>
              )}
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Class'}</strong>
              </div>
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Prof'}</strong>
              </div>
              <div
                style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                className="d-flex"
              >
                <strong className="m-auto">{'Work'}</strong>
              </div>
            </React.Fragment>
            <div
              style={{
                lineHeight: '30px',
                width: `${BOOKMARK_WIDTH}px`,
                paddingRight: '15px',
              }}
              className="d-flex"
            >
              <div
                className={
                  'd-flex ml-auto my-auto p-0 ' +
                  styles.settings +
                  (isComponentVisible ? ' ' + styles.settings_rotated : '')
                }
                ref={ref_visible}
                onClick={() => setIsComponentVisible(!isComponentVisible)}
                onMouseEnter={() => {
                  if (!isTouch) setIsComponentVisible(true);
                }}
              >
                <FcSettings size={20} />
              </div>
            </div>
          </Row>
          <WorksheetSettingsDropdown
            cur_season={cur_season}
            settings_expanded={isComponentVisible}
            setIsComponentVisible={setIsComponentVisible}
            season_codes={season_codes}
            onSeasonChange={onSeasonChange}
          />
        </div>

        <div className={styles.results_list_container}>{items}</div>
      </Container>
    </div>
  );
};

export default WorksheetExpandedList;
