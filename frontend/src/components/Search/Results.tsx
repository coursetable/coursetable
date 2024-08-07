import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Row } from 'react-bootstrap';
import { FixedSizeList, FixedSizeGrid } from 'react-window';

import FloatingWorksheet from './FloatingWorksheet';
import ResultsGridItem from './ResultsGridItem';
import ResultsHeaders from './ResultsHeaders';
import ResultsItem from './ResultsItem';
import WindowScroller from './WindowScroller';
import WishlistResultsItem from '../Wishlist/WishlistResultsItem';

import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import NoCoursesFound from '../../images/no_courses_found.svg';
import type { CatalogListing } from '../../queries/api';
import { useSessionStorageState } from '../../utilities/browserStorage';
import { toSeasonString } from '../../utilities/course';
import Spinner from '../Spinner';
import styles from './Results.module.css';

export type ResultItemData = {
  readonly listings: CatalogListing[];
  readonly columnCount: number;
  readonly multiSeasons: boolean;
};
import type { WishlistCourse } from '../../contexts/wishlistContext';

const defaultData: Listing[] = [];
const defaultWishlistData: WishlistCourse[] = [];

function Results({
  data = defaultData,
  wishlistData = defaultWishlistData,
  loading = false,
  multiSeasons = false,
  page,
}: {
  readonly data?: CatalogListing[] | null;
  readonly wishlistData?: WishlistCourse[];
  readonly loading?: boolean;
  readonly multiSeasons?: boolean;
  readonly page: 'catalog' | 'worksheet' | 'wishlist';
}) {
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    true,
  );

  const { curSeason } = useWorksheet();

  let resultsListing: JSX.Element | undefined = undefined;
  if (loading || !data) {
    resultsListing = (
      <Row className={clsx('m-auto', !data ? 'py-5' : 'pt-0 pb-4')}>
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
        {page === 'catalog' && (
          <>
            <h3>No courses found</h3>
            <div>We couldn't find any courses matching your search.</div>
          </>
        )}
        {page === 'worksheet' && (
          <>
            <h3>No courses found for {toSeasonString(curSeason)}</h3>
            <div>
              Add some courses on the <Link to="/catalog">Catalog</Link>.
            </div>
          </>
        )}
        {page === 'wishlist' && (
          <>
            <h3>No courses found on your wishlist</h3>
            <div>
              Add some courses using the bookmark icons on the{' '}
              <Link to="/catalog">Catalog</Link>.
            </div>
          </>
        )}
      </div>
    );
  } else if (!isListView || isMobile || page === 'wishlist') {
    // Not list, on mobile, or in wishlist -> use grid view
    // Do not force entering grid mode on mobile, so that when resizing the
    // window, the view can still be restored to list view
    const isGrid = !isListView || isMobile;
    const columnCount = isGrid ? (isMobile ? 1 : isTablet ? 2 : 3) : 1;
    const columnWidth = Math.floor(window.innerWidth / columnCount);
    const rowCount = Math.ceil(data.length / columnCount);
    const rowHeight = isGrid ? 178 : isLgDesktop ? 32 : 28;
    const ListComp = isGrid ? FixedSizeGrid : FixedSizeList;
    const InnerComp = isGrid ? ResultsGridItem : ResultsItem;

    resultsListing = (
      <WindowScroller isGrid={isGrid}>
        {({ ref, outerRef }) => (
          // @ts-expect-error: not worth making types work here
          <ListComp
            innerElementType="ul"
            outerRef={outerRef}
            ref={ref}
            width={window.innerWidth}
            height={Math.min(window.innerHeight, rowCount * rowHeight)}
            itemData={{ listings: data, columnCount, multiSeasons }}
            {...(isGrid
              ? { columnCount, rowCount, rowHeight, columnWidth }
              : { itemCount: rowCount, itemSize: rowHeight })}
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
                  {page === 'wishlist'
                    ? wishlistData
                        .slice(index * numCols, (index + 1) * numCols)
                        .map((wishlistCourse) => (
                          <WishlistResultsItem
                            course={wishlistCourse}
                            numCols={0}
                            multiSeasons={false}
                          />
                        ))
                    : data
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
          </ListComp>
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
          isListView={isListView}
          setIsListView={setIsListView}
          numResults={data?.length ?? 0}
        />
      )}
      {resultsListing}
      <FloatingWorksheet />
    </div>
  );
}

export default Results;
