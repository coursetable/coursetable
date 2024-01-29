import React, { useMemo, forwardRef } from 'react';
import { Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaBars, FaTh } from 'react-icons/fa';
import clsx from 'clsx';

import ResultsColumnSort from './ResultsColumnSort';
import { SurfaceComponent } from '../StyledComponents';

import { sortByOptions } from '../../contexts/searchContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import styles from './ResultsHeaders.module.css';

function ResultsHeaders(
  {
    COL_SPACING,
    multiSeasons,
    page,
    isListView,
    setIsListView,
    numResults,
  }: {
    // This can be more exact, but I'm too lazy to type everything out :)
    readonly COL_SPACING: { [prop: string]: number };
    readonly multiSeasons: boolean;
    readonly page: 'catalog' | 'worksheet';
    readonly isListView: boolean;
    readonly setIsListView: (isList: boolean) => void;
    readonly numResults: number;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { isTablet, isLgDesktop, isSmDesktop } = useWindowDimensions();

  // Column width styles
  const sznStyle: React.CSSProperties = {
    width: `${COL_SPACING.SZN_WIDTH}px`,
    paddingLeft: '15px',
  };
  const codeStyle: React.CSSProperties = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: !multiSeasons ? '15px' : '0px',
  };
  const titleStyle: React.CSSProperties = {
    width: `${COL_SPACING.TITLE_WIDTH}px`,
  };
  const rateOverallStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
  };
  const rateWorkloadStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
  };
  const profStyle: React.CSSProperties = {
    width: `${COL_SPACING.PROF_WIDTH}px`,
  };
  const meetStyle: React.CSSProperties = {
    width: `${COL_SPACING.MEET_WIDTH}px`,
  };
  const locStyle: React.CSSProperties = {
    width: `${COL_SPACING.LOC_WIDTH}px`,
  };
  const enrollStyle: React.CSSProperties = {
    width: `${COL_SPACING.ENROLL_WIDTH}px`,
  };
  const friendsStyle: React.CSSProperties = {
    width: `${COL_SPACING.FRIENDS_WIDTH}px`,
  };
  const saStyle: React.CSSProperties = { width: `${COL_SPACING.SA_WIDTH}px` };

  const navbarHeight = useMemo(() => {
    if (page === 'catalog') {
      if (isSmDesktop || isTablet) return 88;
      if (isLgDesktop) return 100;
    }
    if (page === 'worksheet') {
      if (isSmDesktop || isTablet) return 58;
      if (isLgDesktop) return 61;
    }
    return 0;
  }, [page, isTablet, isSmDesktop, isLgDesktop]);

  return (
    <div className={styles.spacer} style={{ top: navbarHeight }}>
      <SurfaceComponent
        layer={0}
        id="results_container"
        className={clsx('px-0 mx-0', styles.container)}
      >
        {/* Column Headers */}
        <Row
          ref={ref}
          className={clsx(
            'mx-auto pl-4 pr-2',
            isLgDesktop ? 'py-2' : 'py-1',
            styles.resultsHeaderRow,
            'justify-content-between',
          )}
          data-tutorial="catalog-5"
        >
          {/* View Toggle */}
          <div
            className={clsx(
              styles.listGridToggle,
              'd-flex ml-auto my-auto p-0',
            )}
          >
            {/* TODO */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className={clsx(styles.toggle, 'd-flex ml-auto my-auto')}
              onClick={() => setIsListView(!isListView)}
            >
              {!isListView ? (
                <FaBars className="m-auto" size={15} />
              ) : (
                <FaTh className="m-auto" size={15} />
              )}
            </div>
          </div>
          {isListView ? (
            <>
              {multiSeasons && (
                <div className={styles.resultsHeader} style={sznStyle}>
                  Season
                </div>
              )}
              {/* Course Code */}
              <div className={styles.resultsHeader} style={codeStyle}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      <span>
                        Course Code <br />
                        and Section
                      </span>
                    </Tooltip>
                  )}
                >
                  <span className={styles.oneLine}>Code</span>
                </OverlayTrigger>
                <ResultsColumnSort selectOption={sortByOptions.course_code} />
              </div>
              {/* Course Name */}
              <div className={styles.resultsHeader} style={titleStyle}>
                <span className={styles.oneLine}>Title</span>
                <ResultsColumnSort selectOption={sortByOptions.title} />
              </div>
              <div className="d-flex">
                {/* Overall Rating */}
                <div className={styles.resultsHeader} style={rateOverallStyle}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={(props) => (
                      <Tooltip id="button-tooltip" {...props}>
                        <span>
                          Average Course Rating
                          <br />
                          (same professor and all cross-listed courses. If this
                          professor hasn't taught the course before, a ~ denotes
                          an average across all professors)
                        </span>
                      </Tooltip>
                    )}
                  >
                    <span className={styles.oneLine}>Overall</span>
                  </OverlayTrigger>
                  <ResultsColumnSort
                    selectOption={sortByOptions.average_rating}
                  />
                </div>
                {/* Workload Rating */}
                <div className={styles.resultsHeader} style={rateWorkloadStyle}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={(props) => (
                      <Tooltip id="button-tooltip" {...props}>
                        <span>
                          Average Workload Rating <br />
                          (same professor and all cross-listed courses. If this
                          professor hasn't taught the course before, a ~ denotes
                          an average across all professors)
                        </span>
                      </Tooltip>
                    )}
                  >
                    <span className={styles.oneLine}>Work</span>
                  </OverlayTrigger>
                  <ResultsColumnSort
                    selectOption={sortByOptions.average_workload}
                  />
                </div>
                {/* Professor Rating & Course Professors */}
                <div className={styles.resultsHeader} style={profStyle}>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={(props) => (
                      <Tooltip id="button-tooltip" {...props}>
                        <span>
                          Average Professor Rating <br />
                          and Names <br />
                          (if there are multiple professors, we take the average
                          between them)
                        </span>
                      </Tooltip>
                    )}
                  >
                    <span className={styles.oneLine}>Professors</span>
                  </OverlayTrigger>
                  <ResultsColumnSort
                    selectOption={sortByOptions.average_professor}
                  />
                </div>
              </div>
              {/* Previous Enrollment Number */}
              <div className={styles.resultsHeader} style={enrollStyle}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      {multiSeasons ? (
                        <span>
                          Class Enrollment
                          <br />
                          (If the course has not occurred/completed, based on
                          the most recent past instance of this course. a ~
                          means a different professor was teaching)
                        </span>
                      ) : (
                        <span>
                          Previous Class Enrollment
                          <br />
                          (based on the most recent past instance of this
                          course. a ~ means a different professor was teaching)
                        </span>
                      )}
                    </Tooltip>
                  )}
                >
                  <span className={styles.oneLine}>#</span>
                </OverlayTrigger>
                <ResultsColumnSort
                  selectOption={sortByOptions.last_enrollment}
                />
              </div>
              {/* Skills/Areas */}
              <div className={styles.resultsHeader} style={saStyle}>
                <span className={styles.oneLine}>Skills/Areas</span>
              </div>
              {/* Course Meeting Days & Times */}
              <div className={styles.resultsHeader} style={meetStyle}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      <span>
                        Days of the Week <br />
                        and Times <br />
                        (sort order based on day and starting time)
                      </span>
                    </Tooltip>
                  )}
                >
                  <span className={styles.oneLine}>Meets</span>
                </OverlayTrigger>
                <ResultsColumnSort selectOption={sortByOptions.times_by_day} />
              </div>
              {/* Location */}
              <div className={styles.resultsHeader} style={locStyle}>
                <span className={styles.oneLine}>Location</span>
                <ResultsColumnSort
                  selectOption={sortByOptions.locations_summary}
                />
              </div>
              <div className={styles.resultsHeader} style={friendsStyle}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      <span>Number of friends shopping this course</span>
                    </Tooltip>
                  )}
                >
                  <span className={styles.oneLine}>#F</span>
                </OverlayTrigger>
                <ResultsColumnSort selectOption={sortByOptions.friend} />
              </div>
            </>
          ) : (
            // Showing how many search results for grid view
            <Col md={10}>
              <div className={styles.resultsHeader}>
                {`Showing ${numResults} course${
                  numResults === 1 ? '' : 's'
                }...`}
              </div>
            </Col>
          )}
        </Row>
      </SurfaceComponent>
    </div>
  );
}

export default forwardRef(ResultsHeaders);
