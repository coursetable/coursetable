import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Row } from 'react-bootstrap';
import { FixedSizeList, FixedSizeGrid } from 'react-window';

import { useShallow } from 'zustand/react/shallow';
import FloatingWorksheet from './FloatingWorksheet';
import LastUpdated from './LastUpdated';
import ResultsGridItem from './ResultsGridItem';
import ResultsHeaders from './ResultsHeaders';
import ResultsItem from './ResultsItem';
import WindowScroller from './WindowScroller';

import { useWorksheet } from '../../contexts/worksheetContext';
import NoCoursesFound from '../../images/no_courses_found.svg';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { useSessionStorageState } from '../../utilities/browserStorage';
import { toSeasonString } from '../../utilities/course';
import Spinner from '../Spinner';
import styles from './Results.module.css';

export type ResultItemData = {
  readonly listings: CatalogListing[];
  readonly columnCount: number;
  readonly multiSeasons: boolean;
};

function Results({
  data,
  loading = false,
  multiSeasons = false,
  page = 'catalog',
}: {
  readonly data: CatalogListing[] | null;
  readonly loading?: boolean;
  readonly multiSeasons?: boolean;
  readonly page?: 'catalog' | 'worksheet';
}) {
  const { isMobile, isTablet, isLgDesktop } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      isTablet: state.isTablet,
      isLgDesktop: state.isLgDesktop,
    })),
  );
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    true,
  );

  const { curSeason } = useWorksheet();

  // eslint-disable-next-line no-useless-assignment
  let resultsListing: React.JSX.Element | undefined = undefined;
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
  } else {
    // Not list or on mobile -> use grid view
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
            {InnerComp}
          </ListComp>
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
      {isMobile && <LastUpdated />}
      {resultsListing}
      <FloatingWorksheet />
    </div>
  );
}

export default Results;
