import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Spinner } from 'react-bootstrap';
import { FixedSizeList } from 'react-window';
import styled, { useTheme } from 'styled-components';
import clsx from 'clsx';

import ResultsHeaders from './ResultsHeaders';
import ResultsItem from './ResultsItem';
import ResultsGridItem from './ResultsGridItem';

import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

import styles from './Results.module.css';

import NoCoursesFound from '../../images/no_courses_found.svg';

import WindowScroller from './WindowScroller';
import { useSessionStorageState } from '../../utilities/browserStorage';
import type { Listing } from '../../utilities/common';
import { toSeasonString } from '../../utilities/course';

import { useWorksheet } from '../../contexts/worksheetContext';

// Restrict the row width
const StyledRow = styled(Row)`
  max-width: 1600px;
`;

// Search results
const SearchResults = styled.div<{ numCourses: number; isMobile: boolean }>`
  overflow: hidden;
  ${({ numCourses, isMobile }) =>
    numCourses > 0 && numCourses < 20 && !isMobile ? 'height: 80vh;' : ''}
`;

// Function to calculate column width within a max and min
const getColWidth = (calculated: number, min = 0, max = 1000000) =>
  Math.max(Math.min(calculated, max), min);

/**
 * Renders the infinite list of search results for both catalog and worksheet
 * @prop data - array | that holds the search results
 * @prop loading - boolean | Is the search query finished?
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop numFriends = object | holds a list of each friend taking a specific course
 * @prop page = string | page search results are on
 */

function Results({
  data,
  loading = false,
  multiSeasons = false,
  numFriends,
  page = 'catalog',
}: {
  readonly data: Listing[];
  readonly loading?: boolean;
  readonly multiSeasons?: boolean;
  readonly numFriends: { [seasonCodeCrn: string]: string[] };
  readonly page?: 'catalog' | 'worksheet';
}) {
  // Fetch current device
  const {
    width: windowWidth,
    isMobile,
    isTablet,
    isLgDesktop,
  } = useWindowDimensions();
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    true,
  );

  // State that holds width of the row for list view
  const [rowWidth, setRowWidth] = useState(0);

  const { curSeason } = useWorksheet();

  const globalTheme = useTheme();

  // Ref to get row width
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Set row width
    if (ref.current) setRowWidth(ref.current.offsetWidth);
  }, [setRowWidth, windowWidth]);

  // Spacing for each column in list view
  const COL_SPACING = useMemo(() => {
    const TEMP_COL_SPACING = {
      SZN_WIDTH: 60,
      CODE_WIDTH: isLgDesktop ? 110 : 90,
      RATE_OVERALL_WIDTH: isLgDesktop ? 92 : 82,
      RATE_WORKLOAD_WIDTH: isLgDesktop ? 92 : 82,
      RATE_PROF_WIDTH: isLgDesktop ? 40 : 36,
      ENROLL_WIDTH: 40,
      FRIENDS_WIDTH: 60,
      PADDING: 43,

      PROF_WIDTH: 0,
      SA_WIDTH: 0,
      MEET_WIDTH: 0,
      LOC_WIDTH: 0,
      TITLE_WIDTH: 0,
    };

    const EXTRA =
      rowWidth -
      (multiSeasons ? TEMP_COL_SPACING.SZN_WIDTH : 0) -
      TEMP_COL_SPACING.CODE_WIDTH -
      TEMP_COL_SPACING.ENROLL_WIDTH -
      TEMP_COL_SPACING.FRIENDS_WIDTH -
      TEMP_COL_SPACING.RATE_OVERALL_WIDTH -
      TEMP_COL_SPACING.RATE_WORKLOAD_WIDTH -
      TEMP_COL_SPACING.RATE_PROF_WIDTH -
      TEMP_COL_SPACING.PADDING;

    TEMP_COL_SPACING.PROF_WIDTH =
      getColWidth(EXTRA / 7, undefined, undefined) +
      TEMP_COL_SPACING.RATE_PROF_WIDTH;
    TEMP_COL_SPACING.SA_WIDTH = getColWidth(EXTRA / 8, 40, 126);
    TEMP_COL_SPACING.MEET_WIDTH = getColWidth(EXTRA / 6, 60, 170);
    TEMP_COL_SPACING.LOC_WIDTH = getColWidth(EXTRA / 13, 30, undefined);
    TEMP_COL_SPACING.TITLE_WIDTH =
      EXTRA -
      TEMP_COL_SPACING.PROF_WIDTH -
      TEMP_COL_SPACING.SA_WIDTH -
      TEMP_COL_SPACING.MEET_WIDTH -
      TEMP_COL_SPACING.LOC_WIDTH -
      10;

    return TEMP_COL_SPACING;
  }, [rowWidth, multiSeasons, isLgDesktop]);

  // Number of columns to use in grid view
  const numCols = isMobile ? 1 : isTablet ? 2 : 3;

  let resultsListing: JSX.Element | undefined = undefined;
  if (loading) {
    resultsListing = (
      <Row className={clsx('m-auto', data.length === 0 ? 'py-5' : 'pt-0 pb-4')}>
        <Spinner className="m-auto" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  } else if (data.length === 0) {
    // If no courses found, render the empty state
    resultsListing = (
      <div className="text-center py-5">
        <img
          alt="No courses found."
          className="py-5"
          src={NoCoursesFound}
          style={{ width: '25%' }}
        />
        {page === 'catalog' ? (
          <>
            <h3>No courses found</h3>
            <div>We couldn't find any courses matching your search.</div>
          </>
        ) : (
          <>
            <h3>No courses found for {toSeasonString(curSeason)}</h3>
            <div>
              Add some courses on the <Link to="/catalog">Catalog</Link>.
            </div>
          </>
        )}
      </div>
    );
  } else if (!isListView || isMobile) {
    // Not list or on mobile -> use grid view
    // Do not force entering grid mode on mobile, so that when resizing the
    // window, the view can still be restored to list view
    resultsListing = (
      <WindowScroller>
        {({ ref, outerRef, style }) => (
          // We use a list even for grid, because we only virtualize the rows
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            height={window.innerHeight}
            itemCount={Math.ceil(data.length / numCols)}
            itemSize={178}
            width={window.innerWidth}
            style={style}
          >
            {({ index, style }) => (
              <div style={style}>
                <StyledRow className="mx-auto">
                  {data
                    .slice(index * numCols, (index + 1) * numCols)
                    .map((course) => (
                      <ResultsGridItem
                        course={course}
                        numCols={numCols}
                        multiSeasons={multiSeasons}
                        key={course.season_code + course.crn}
                      />
                    ))}
                </StyledRow>
              </div>
            )}
          </FixedSizeList>
        )}
      </WindowScroller>
    );
  } else {
    resultsListing = (
      <WindowScroller>
        {({ ref, outerRef, style }) => (
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            height={window.innerHeight}
            itemCount={data.length}
            itemSize={isLgDesktop ? 32 : 28}
            width={window.innerWidth}
            style={style}
            useIsScrolling
          >
            {({ index, style }) => {
              const course = data[index]!;
              const friends = numFriends[course.season_code + course.crn] ?? [];
              return (
                <ResultsItem
                  style={{
                    ...style,
                    backgroundColor:
                      index % 2 === 0
                        ? globalTheme.surface[0]
                        : globalTheme.rowOdd,
                  }}
                  course={course}
                  multiSeasons={multiSeasons}
                  isFirst={index === 0}
                  COL_SPACING={COL_SPACING}
                  friends={friends}
                />
              );
            }}
          </FixedSizeList>
        )}
      </WindowScroller>
    );
  }

  return (
    <div className={styles.results_container_max_width}>
      {!isMobile && (
        <ResultsHeaders
          ref={ref}
          COL_SPACING={COL_SPACING}
          multiSeasons={multiSeasons}
          page={page}
          isListView={isListView}
          setIsListView={setIsListView}
          numResults={data.length}
        />
      )}

      <SearchResults
        className={!isListView ? 'px-1 pt-3' : ''}
        numCourses={data.length}
        isMobile={isMobile}
      >
        {resultsListing}
      </SearchResults>
    </div>
  );
}

export default Results;
