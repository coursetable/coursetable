import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Col } from 'react-bootstrap';
import type { GridChildComponentProps } from 'react-window';
import type { WishlistGridItemData } from './WishlistGrid';
import { WISHLIST_YEARS } from '../../config';
import { ratingColormap } from '../../utilities/constants';
import { createCourseModalLink } from '../../utilities/display';
import styles from './WishlistGridItem.module.css';

type OfferingItem = {
  rating?: number | null;
  link: string;
};

type SemesterOfferings = {
  [year: string]: OfferingItem;
};

function SemesterRow({
  semester,
  offerings,
}: {
  readonly semester: string;
  readonly offerings: SemesterOfferings;
}) {
  return (
    <tr>
      <td style={{ textAlign: 'center' }}>{semester}</td>
      {WISHLIST_YEARS.map((year) =>
        offerings[year] ? (
          <td
            key={year}
            className={styles.ratingBubble}
            style={{
              backgroundColor: ratingColormap(offerings[year].rating).css(),
              color: 'var(--color-text-dark)',
            }}
          >
            <Link to={offerings[year].link} className={styles.cellLink}>
              <Col>
                <strong>{offerings[year].rating?.toFixed(1) ?? 'TBD'}</strong>
              </Col>
            </Link>
          </td>
        ) : (
          <td
            key={year}
            className={styles.noListingsBubble}
            onClick={(e) => e.preventDefault()}
          >
            <Col>
              <span>—</span>
            </Col>
          </td>
        ),
      )}
    </tr>
  );
}

function OfferingsTable({
  data,
}: {
  readonly data: {
    Spring: SemesterOfferings;
    Fall: SemesterOfferings;
  };
}) {
  return (
    <div>
      <table className={styles.wishlistOfferingTable}>
        <thead>
          <tr>
            <th aria-label="Semester" />
            {WISHLIST_YEARS.map((year) => (
              <th style={{ textAlign: 'center' }} key={year}>
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([semester, offerings]) => (
            <SemesterRow
              key={semester}
              semester={semester}
              offerings={offerings}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WishlistGridItem({
  data: { courses, columnCount },
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps<WishlistGridItemData>) {
  const [searchParams] = useSearchParams();

  const course = courses[rowIndex * columnCount + columnIndex];
  if (!course) return null;

  const offeringsData: {
    Spring: SemesterOfferings;
    Fall: SemesterOfferings;
  } = {
    Spring: {},
    Fall: {},
  };
  course.listings.forEach((listing) => {
    if (WISHLIST_YEARS.includes(listing.season.slice(0, 4))) {
      const ratingBubbleItem = {
        rating: listing.avgRating,
        link: createCourseModalLink(
          {
            crn: listing.crn,
            course: {
              season_code: listing.season,
            },
          },
          searchParams,
        ),
      };
      if (listing.season.slice(4) === '01') {
        offeringsData.Spring = {
          ...offeringsData.Spring,
          [listing.season.slice(0, 4)]: ratingBubbleItem,
        };
      } else if (listing.season.slice(4) === '03') {
        offeringsData.Fall = {
          ...offeringsData.Fall,
          [listing.season.slice(0, 4)]: ratingBubbleItem,
        };
      }
    }
  });

  const courseTitle = course.listings[0]?.title ?? 'TBA';

  return (
    <li className={styles.container} style={style}>
      <Link
        to={createCourseModalLink(
          {
            crn: course.crn,
            course: {
              season_code: course.season,
            },
          },
          searchParams,
        )}
        className={clsx(styles.wishlistItemLink, styles.noLinkStyle)}
      >
        <div className={styles.wishlistItem}>
          <div className={styles.courseCodes}>
            <small>{course.courseCodes.join(' | ')}</small>
          </div>
          <div>
            <strong className={styles.oneLine}>{courseTitle}</strong>
          </div>
          <div>
            <OfferingsTable data={offeringsData} />
          </div>
        </div>
      </Link>
    </li>
  );
}

export default WishlistGridItem;
