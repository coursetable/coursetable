import React from 'react';
import clsx from 'clsx';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaBars, FaTh } from 'react-icons/fa';

import ResultsColumnSort from './ResultsColumnSort';
import { type SortKeys, sortByOptions } from '../../contexts/searchContext';
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
  readonly tooltip?: string | React.JSX.Element;
  readonly sortOption?: SortKeys;
}) {
  return (
    <span className={clsx(className, styles.headerCol, styles.oneLine)}>
      {tooltip ? (
        <OverlayTrigger
          placement="bottom"
          overlay={(props) => (
            <Tooltip id="button-tooltip" {...props}>
              {typeof tooltip === 'string' ? <span>{tooltip}</span> : tooltip}
            </Tooltip>
          )}
        >
          <span>{children}</span>
        </OverlayTrigger>
      ) : (
        <span>{children}</span>
      )}
      {sortOption && (
        <ResultsColumnSort selectOption={sortByOptions[sortOption]} />
      )}
    </span>
  );
}

function ResultsHeaders({
  multiSeasons,
  isListView,
  setIsListView,
  numResults,
}: {
  readonly multiSeasons: boolean;
  readonly isListView: boolean;
  readonly setIsListView: (isList: boolean) => void;
  readonly numResults: number;
}) {
  return (
    <SurfaceComponent
      className={clsx('px-0 mx-0', styles.container)}
      data-tutorial="catalog-5"
    >
      <div className={styles.resultsHeaderContent}>
        <span className={colStyles.controlCol}>
          <button
            type="button"
            className={clsx(styles.toggle, 'd-flex m-auto')}
            onClick={() => setIsListView(!isListView)}
            aria-label={
              isListView ? 'Switch to grid view' : 'Switch to list view'
            }
          >
            {!isListView ? <FaBars size={15} /> : <FaTh size={15} />}
          </button>
        </span>
        {isListView ? (
          <>
            {multiSeasons && (
              <HeaderCol className={colStyles.seasonCol}>Season</HeaderCol>
            )}
            <HeaderCol
              className={colStyles.codeCol}
              tooltip="Course code and section"
              sortOption="course_code"
            >
              Code
            </HeaderCol>
            <HeaderCol className={colStyles.titleCol} sortOption="title">
              Title
            </HeaderCol>
            <HeaderCol
              className={colStyles.overallCol}
              tooltip={
                <span>
                  Average course rating
                  <br />
                  (same professor and all cross-listed courses. If this
                  professor hasn't taught the course before, a ~ denotes an
                  average across all professors)
                </span>
              }
              sortOption="overall"
            >
              Overall
            </HeaderCol>
            <HeaderCol
              className={colStyles.workloadCol}
              tooltip={
                <span>
                  Average workload rating
                  <br />
                  (same professor and all cross-listed courses. If this
                  professor hasn't taught the course before, a ~ denotes an
                  average across all professors)
                </span>
              }
              sortOption="workload"
            >
              Work
            </HeaderCol>
            <HeaderCol
              className={colStyles.profCol}
              tooltip={
                <span>
                  Average professor course rating and names
                  <br />
                  (if there are multiple professors, we take the average between
                  them)
                </span>
              }
              sortOption="average_professor_rating"
            >
              Professors
            </HeaderCol>
            <HeaderCol
              className={colStyles.enrollCol}
              tooltip={
                <span>
                  Class enrollment
                  <br />
                  (If the course has not occurred/completed, based on the most
                  recent past instance of this course. a ~ means a different
                  professor was teaching)
                </span>
              }
              sortOption="enrollment"
            >
              #
            </HeaderCol>
            <HeaderCol className={colStyles.skillAreaCol}>
              Skills/Areas
            </HeaderCol>
            <HeaderCol
              className={colStyles.meetCol}
              tooltip={
                <span>
                  Days of the Week and Times
                  <br />
                  (sort order based on day and starting time)
                </span>
              }
              sortOption="time"
            >
              Meets
            </HeaderCol>
            <HeaderCol className={colStyles.locCol} sortOption="location">
              Location
            </HeaderCol>
            <HeaderCol
              className={colStyles.friendsCol}
              tooltip="Number of friends shopping this course"
              sortOption="friend"
            >
              #F
            </HeaderCol>
            <HeaderCol
              className={colStyles.addedCol}
              tooltip="Time the course was added to the catalog"
              sortOption="added"
            >
              Added
            </HeaderCol>
          </>
        ) : (
          <div className={clsx(styles.headerCol, styles.resultsStat)}>
            {`Showing ${numResults} course${numResults === 1 ? '' : 's'}...`}
          </div>
        )}
      </div>
    </SurfaceComponent>
  );
}

export default ResultsHeaders;
