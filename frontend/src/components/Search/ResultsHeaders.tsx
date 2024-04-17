import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaBars, FaTh } from 'react-icons/fa';

import ResultsColumnSort from './ResultsColumnSort';
import { type SortKeys, sortByOptions } from '../../contexts/searchContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { SurfaceComponent } from '../Typography';
import colStyles from './ResultsCols.module.css';
import styles from './ResultsHeaders.module.css';

function HeaderCol({
  className,
  children,
  tooltip,
  sortOption,
}: {
  readonly className: string | undefined;
  readonly children: React.ReactNode;
  readonly tooltip?: string | JSX.Element;
  readonly sortOption?: SortKeys;
}) {
  return (
    <div className={clsx(className, styles.resultsHeader)}>
      {tooltip ? (
        <OverlayTrigger
          placement="bottom"
          overlay={(props) => (
            <Tooltip id="button-tooltip" {...props}>
              {typeof tooltip === 'string' ? <span>{tooltip}</span> : tooltip}
            </Tooltip>
          )}
        >
          <div className={styles.oneLine}>
            <span>{children}</span>
          </div>
        </OverlayTrigger>
      ) : (
        <div className={styles.oneLine}>
          <span>{children}</span>
        </div>
      )}
      {sortOption && (
        <ResultsColumnSort selectOption={sortByOptions[sortOption]} />
      )}
    </div>
  );
}

function ResultsHeaders({
  multiSeasons,
  page,
  isListView,
  setIsListView,
  numResults,
}: {
  readonly multiSeasons: boolean;
  readonly page: 'catalog' | 'worksheet';
  readonly isListView: boolean;
  readonly setIsListView: (isList: boolean) => void;
  readonly numResults: number;
}) {
  const { isTablet, isLgDesktop, isSmDesktop } = useWindowDimensions();

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
    <SurfaceComponent
      className={clsx(
        'px-0 mx-0',
        isLgDesktop ? 'py-2' : 'py-1',
        styles.container,
      )}
      style={{ top: navbarHeight }}
      data-tutorial="catalog-5"
    >
      <div className={colStyles.controlCol}>
        <button
          type="button"
          className={clsx(styles.toggle, 'd-flex ms-auto my-auto')}
          onClick={() => setIsListView(!isListView)}
          aria-label={
            isListView ? 'Switch to grid view' : 'Switch to list view'
          }
        >
          {!isListView ? (
            <FaBars className="m-auto" size={15} />
          ) : (
            <FaTh className="m-auto" size={15} />
          )}
        </button>
      </div>
      {isListView ? (
        <>
          {multiSeasons && (
            <HeaderCol className={colStyles.seasonCol}>Season</HeaderCol>
          )}
          <HeaderCol
            className={colStyles.codeCol}
            tooltip="Course Code and Section"
            sortOption="course_code"
          >
            Code
          </HeaderCol>
          <HeaderCol className={colStyles.titleCol} sortOption="title">
            Title
          </HeaderCol>
          <div className="d-flex">
            <HeaderCol
              className={colStyles.overallCol}
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
              className={colStyles.workloadCol}
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
              className={colStyles.profCol}
              tooltip={
                <span>
                  Average Professor Rating and Names
                  <br />
                  (if there are multiple professors, we take the average between
                  them)
                </span>
              }
              sortOption="average_professor"
            >
              Professors
            </HeaderCol>
          </div>
          <HeaderCol
            className={colStyles.enrollCol}
            tooltip={
              multiSeasons ? (
                <span>
                  Class Enrollment
                  <br />
                  (If the course has not occurred/completed, based on the most
                  recent past instance of this course. a ~ means a different
                  professor was teaching)
                </span>
              ) : (
                <span>
                  Previous Class Enrollment
                  <br />
                  (based on the most recent past instance of this course. a ~
                  means a different professor was teaching)
                </span>
              )
            }
            sortOption="last_enrollment"
          >
            #
          </HeaderCol>
          <HeaderCol className={colStyles.skillAreaCol}>Skills/Areas</HeaderCol>
          <HeaderCol
            className={colStyles.meetCol}
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
          <HeaderCol
            className={colStyles.locCol}
            sortOption="locations_summary"
          >
            Location
          </HeaderCol>
          <HeaderCol
            className={colStyles.friendsCol}
            tooltip="Number of friends shopping this course"
            sortOption="friend"
          >
            #F
          </HeaderCol>
        </>
      ) : (
        <div className={clsx(styles.resultsHeader, styles.resultsStat)}>
          {`Showing ${numResults} course${numResults === 1 ? '' : 's'}...`}
        </div>
      )}
    </SurfaceComponent>
  );
}

export default ResultsHeaders;
