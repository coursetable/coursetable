import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Spinner } from 'react-bootstrap';
import { FixedSizeList } from 'react-window';
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
  page = 'catalog',
}: {
  readonly data: Listing[];
  readonly loading?: boolean;
  readonly multiSeasons?: boolean;
  readonly page?: 'catalog' | 'worksheet';
}) {
  // Fetch current device
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    true,
  );

  const { curSeason } = useWorksheet();

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
        {({ ref, outerRef, style: listStyle }) => (
          // We use a list even for grid, because we only virtualize the rows
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            height={window.innerHeight}
            itemCount={Math.ceil(data.length / numCols)}
            itemSize={178}
            width={window.innerWidth}
            style={listStyle}
          >
            {({ index, style: itemStyle }) => (
              <div style={itemStyle}>
                <Row className={clsx(styles.gridRow, 'mx-auto')}>
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
                </Row>
              </div>
            )}
          </FixedSizeList>
        )}
      </WindowScroller>
    );
  } else {
    resultsListing = (
      <WindowScroller>
        {({ ref, outerRef, style: listStyle }) => (
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            height={window.innerHeight}
            itemCount={data.length}
            itemSize={isLgDesktop ? 32 : 28}
            width={window.innerWidth}
            style={listStyle}
            useIsScrolling
          >
            {({ index, style: itemStyle }) => (
              <ResultsItem
                isOdd={index % 2 === 1}
                style={itemStyle}
                course={data[index]!}
                multiSeasons={multiSeasons}
                isFirst={index === 0}
              />
            )}
          </FixedSizeList>
        )}
      </WindowScroller>
    );
  }

  return (
    <div
      className={clsx(
        styles.resultsContainer,
        multiSeasons && styles.resultsMultiSeasons,
      )}
    >
      {!isMobile && (
        <ResultsHeaders
          multiSeasons={multiSeasons}
          page={page}
          isListView={isListView}
          setIsListView={setIsListView}
          numResults={data.length}
        />
      )}

      <div
        className={clsx(
          !isListView && 'px-1 pt-3',
          styles.searchResults,
          data.length > 0 &&
            data.length < 20 &&
            isListView &&
            styles.searchResultsSmall,
        )}
      >
        {resultsListing}
      </div>
    </div>
  );
}

export default Results;
