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

  const extraText =
    course.upcomingListings[0]?.course?.course_professors[0]?.professor?.name ??
    'TBA';

  const courseTitle =
    course.lastListing[0]?.course.title ||
    course.upcomingListings[0]?.course.title;

  return (
    <li className={styles.container} style={style}>
      <div className={styles.wishlistItem}>
        <div className={styles.courseCodes}>
          <small>{course.courseCode}</small>
        </div>
        <div>
          <strong className={styles.oneLine}>{courseTitle}</strong>
        </div>
        <Row className="m-auto py-1 justify-content-center">
          {course.upcomingListings.length > 0 && (
            <>
              <Col>Upcoming Listings: </Col>
              <Col
                as={Link}
                xs={5}
                className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
                to={createCourseModalLink(
                  course.upcomingListings[0],
                  searchParams,
                )}
              >
                <strong>
                  {toSeasonString(
                    course.upcomingListings[0]!.course.season_code,
                  )}
                </strong>
                <span className={clsx(styles.details, 'mx-auto')}>
                  {extraText}
                </span>
              </Col>
            </>
          )}
        </Row>
        <Row className="m-auto py-1 justify-content-center">
          {course.lastListing.length > 0 && (
            <>
              <Col>Last Listing: </Col>
              <Col
                as={Link}
                xs={5}
                className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
                to={createCourseModalLink(course.lastListing[0], searchParams)}
              >
                <strong>
                  {toSeasonString(course.lastListing[0]!.course.season_code)}
                </strong>
                <span className={clsx(styles.details, 'mx-auto')}>
                  {extraText}
                </span>
              </Col>
            </>
          )}
        </Row>
      </div>
    </li>
  );
}

export default WishlistGridItem;
