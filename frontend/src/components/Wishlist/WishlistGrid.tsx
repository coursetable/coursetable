import clsx from 'clsx';
import { Row, Spinner } from 'react-bootstrap';
import { FixedSizeGrid } from 'react-window';
import WishlistGridItem from './WishlistGridItem';
import type { WishlistCourse } from '../../contexts/wishlistContext';
import NoCoursesFound from '../../images/no_courses_found.svg';
import FloatingWorksheet from '../Search/FloatingWorksheet';
import WindowScroller from '../Search/WindowScroller';
import styles from './WishlistGrid.module.css';

export type WishlistGridItemData = {
  readonly courses: WishlistCourse[];
  readonly columnCount: number;
};

function WishlistGrid({
  data,
  loading = false,
}: {
  readonly data: WishlistCourse[] | null;
  readonly loading?: boolean;
}) {
  let gridListing: JSX.Element | undefined = undefined;
  if (loading || !data) {
    gridListing = (
      <Row className={clsx('m-auto', !data ? 'py-5' : 'pt-0 pb-4')}>
        <Spinner />
      </Row>
    );
  } else if (data.length === 0) {
    gridListing = (
      <div className="text-center py-5">
        <img
          alt="No courses found."
          className="py-5"
          src={NoCoursesFound}
          style={{ width: '25%' }}
        />

        <h3>No courses found in wishlist</h3>
        <div>Add some courses using the bookmark icon.</div>
      </div>
    );
  } else {
    const columnCount = 4;
    const columnWidth = Math.floor(window.innerWidth / columnCount);
    const rowCount = Math.ceil(data.length / columnCount);
    const rowHeight = 178;

    gridListing = (
      <WindowScroller isGrid>
        {({ ref, outerRef }) => (
          <FixedSizeGrid
            innerElementType="ul"
            outerRef={outerRef}
            ref={ref}
            width={window.innerWidth}
            height={Math.min(window.innerHeight, rowCount * rowHeight)}
            itemData={{ courses: data, columnCount }}
            {...{ columnCount, columnWidth, rowCount, rowHeight }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'inline-block',
              // https://github.com/coursetable/coursetable/issues/1628
              // We need to cancel the list div being scrollable because we
              // always scroll the entire window. Same as Results.tsx
              overflow: 'hidden',
            }}
          >
            {WishlistGridItem}
          </FixedSizeGrid>
        )}
      </WindowScroller>
    );
  }

  return (
    <div className={styles.gridContainer}>
      {gridListing}
      <FloatingWorksheet />
    </div>
  );
}

export default WishlistGrid;