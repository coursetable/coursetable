import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Row } from 'react-bootstrap';
import { FixedSizeList } from 'react-window';

import FloatingWorksheet from './FloatingWorksheet';
import ResultsGridItem from './ResultsGridItem';
import ResultsHeaders from './ResultsHeaders';
import ResultsItem from './ResultsItem';
import WindowScroller from './WindowScroller';

import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import NoCoursesFound from '../../images/no_courses_found.svg';
import { useSessionStorageState } from '../../utilities/browserStorage';
import type { Listing } from '../../utilities/common';
import { toSeasonString } from '../../utilities/course';
import Spinner from '../Spinner';
import styles from './Results.module.css';

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
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    true,
  );

  const { curSeason } = useWorksheet();

  const numCols = isMobile ? 1 : isTablet ? 2 : 3;

  let resultsListing: JSX.Element | undefined = undefined;
  if (loading) {
    resultsListing = (
      <Row className={clsx('m-auto', data.length === 0 ? 'py-5' : 'pt-0 pb-4')}>
        <Spinner />
      </Row>
    );
  } else if (data.length === 0) {
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
        {({ ref, outerRef }) => (
          // We use a list even for grid, because we only virtualize the rows
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            width={window.innerWidth}
            height={window.innerHeight}
            itemCount={Math.ceil(data.length / numCols)}
            itemSize={178}
            // Inline styles because react-window also injects inline styles
            style={{
              width: '100%',
              height: 'auto',
              display: 'inline-block',
              // https://github.com/coursetable/coursetable/issues/1628
              // We need to cancel the list div being scrollable because we
              // always scroll the entire window
              overflow: 'hidden',
            }}
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
        {({ ref, outerRef }) => (
          <FixedSizeList
            outerRef={outerRef}
            ref={ref}
            width={window.innerWidth}
            height={window.innerHeight}
            itemCount={data.length}
            itemSize={isLgDesktop ? 32 : 28}
            style={{
              width: '100%',
              height: 'auto',
              display: 'inline-block',
              overflow: 'hidden',
            }}
          >
            {({ index, style: itemStyle }) => (
              <ResultsItem
                index={index}
                style={itemStyle}
                course={data[index]!}
                multiSeasons={multiSeasons}
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
          isListView={isListView}
          setIsListView={setIsListView}
          numResults={data.length}
        />
      )}
      {resultsListing}
      <FloatingWorksheet />
    </div>
  );
}

export default Results;
