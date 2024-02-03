import React, { useMemo, forwardRef } from 'react';
import { Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaBars, FaTh } from 'react-icons/fa';
import clsx from 'clsx';

import ResultsColumnSort from './ResultsColumnSort';
import { SurfaceComponent } from '../Typography';

import { type SortKeys, sortByOptions } from '../../contexts/searchContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import styles from './ResultsHeaders.module.css';

function HeaderCol({
  style,
  children,
  tooltip,
  sortOption,
}: {
  readonly style: React.CSSProperties;
  readonly children: React.ReactNode;
  readonly tooltip?: string | JSX.Element;
  readonly sortOption?: SortKeys;
}) {
  return (
    <div className={styles.resultsHeader} style={style}>
      {tooltip ? (
        <OverlayTrigger
          placement="bottom"
          overlay={(props) => (
            <Tooltip id="button-tooltip" {...props}>
              {typeof tooltip === 'string' ? <span>{tooltip}</span> : tooltip}
            </Tooltip>
          )}
        >
          <span className={styles.oneLine}>{children}</span>
        </OverlayTrigger>
      ) : (
        <span className={styles.oneLine}>{children}</span>
      )}
      {sortOption && (
        <ResultsColumnSort selectOption={sortByOptions[sortOption]} />
      )}
    </div>
  );
}

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
              {multiSeasons && <HeaderCol style={sznStyle}>Season</HeaderCol>}
              <HeaderCol
                style={codeStyle}
                tooltip="Course Code and Section"
                sortOption="course_code"
              >
                Code
              </HeaderCol>
              <HeaderCol style={titleStyle} sortOption="title">
                Title
              </HeaderCol>
              <div className="d-flex">
                <HeaderCol
                  style={rateOverallStyle}
                  tooltip={
                    <span>
                      Average Course Rating
                      <br />
                      (same professor and all cross-listed courses. If this
                      professor hasn't taught the course before, a ~ denotes an
                      average across all professors)
                    </span>
                  }
                  sortOption="average_rating"
                >
                  Overall
                </HeaderCol>
                <HeaderCol
                  style={rateWorkloadStyle}
                  tooltip={
                    <span>
                      Average Workload Rating
                      <br />
                      (same professor and all cross-listed courses. If this
                      professor hasn't taught the course before, a ~ denotes an
                      average across all professors)
                    </span>
                  }
                  sortOption="average_workload"
                >
                  Work
                </HeaderCol>
                <HeaderCol
                  style={profStyle}
                  tooltip={
                    <span>
                      Average Professor Rating and Names
                      <br />
                      (if there are multiple professors, we take the average
                      between them)
                    </span>
                  }
                  sortOption="average_professor"
                >
                  Professors
                </HeaderCol>
              </div>
              <HeaderCol
                style={enrollStyle}
                tooltip={
                  multiSeasons ? (
                    <span>
                      Class Enrollment
                      <br />
                      (If the course has not occurred/completed, based on the
                      most recent past instance of this course. a ~ means a
                      different professor was teaching)
                    </span>
                  ) : (
                    <span>
                      Previous Class Enrollment
                      <br />
                      (based on the most recent past instance of this course. a
                      ~ means a different professor was teaching)
                    </span>
                  )
                }
                sortOption="last_enrollment"
              >
                #
              </HeaderCol>
              <HeaderCol style={saStyle}>Skills/Areas</HeaderCol>
              <HeaderCol
                style={meetStyle}
                tooltip={
                  <span>
                    Days of the Week and Times
                    <br />
                    (sort order based on day and starting time)
                  </span>
                }
                sortOption="times_by_day"
              >
                Meets
              </HeaderCol>
              <HeaderCol style={locStyle} sortOption="locations_summary">
                Location
              </HeaderCol>
              <HeaderCol
                style={friendsStyle}
                tooltip="Number of friends shopping this course"
                sortOption="friend"
              >
                #F
              </HeaderCol>
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
