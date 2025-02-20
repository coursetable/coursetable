import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import type { GridChildComponentProps } from 'react-window';
import type { WishlistGridItemData } from './WishlistGrid';
import { toSeasonString } from '../../utilities/course';
import { createCourseModalLink } from '../../utilities/display';
import styles from './WishlistGridItem.module.css';

function WishlistGridItem({
  data: { courses, columnCount },
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps<WishlistGridItemData>) {
  const [searchParams] = useSearchParams();

  const course = courses[rowIndex * columnCount + columnIndex];
  if (!course) return null;

  const extraText = course.upcomingListings[0]?.profName ?? 'TBA';

  const courseTitle =
    (course.prevListings[0]?.title || course.upcomingListings[0]?.title) ??
    'TBA';

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
          <Row className="m-auto py-1 justify-content-center">
            <>
              <Col>Upcoming Listings: </Col>
              {course.upcomingListings.length > 0 ? (
                <Col
                  as={Link}
                  xs={5}
                  className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
                  to={createCourseModalLink(
                    {
                      crn: course.upcomingListings[0]!.crn,
                      course: {
                        season_code: course.upcomingListings[0]!.season,
                      },
                    },
                    searchParams,
                  )}
                >
                  <strong>
                    {toSeasonString(course.upcomingListings[0]!.season)}
                  </strong>
                  <span className={clsx(styles.details, 'mx-auto')}>
                    {extraText}
                  </span>
                </Col>
              ) : (
                <Col
                  xs={5}
                  className={clsx(
                    styles.noListingsBubble,
                    'p-0 me-3 text-center',
                  )}
                  onClick={(e) => e.preventDefault()}
                />
              )}
            </>
          </Row>
          <Row className="m-auto py-1 justify-content-center">
            <>
              <Col>Previous Listings: </Col>
              {course.prevListings.length > 0 ? (
                <Col
                  as={Link}
                  xs={5}
                  className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
                  to={createCourseModalLink(
                    {
                      crn: course.prevListings[0]!.crn,
                      course: {
                        season_code: course.prevListings[0]!.season,
                      },
                    },
                    searchParams,
                  )}
                >
                  <strong>
                    {toSeasonString(course.prevListings[0]!.season)}
                  </strong>
                  <span className={clsx(styles.details, 'mx-auto')}>
                    {extraText}
                  </span>
                </Col>
              ) : (
                <Col
                  xs={5}
                  className={clsx(
                    styles.noListingsBubble,
                    'p-0 me-3 text-center',
                  )}
                />
              )}
            </>
          </Row>
        </div>
      </Link>
    </li>
  );
}

export default WishlistGridItem;
