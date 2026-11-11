import { Link, useSearchParams } from 'react-router-dom';

import type { CourseModalOverviewDataQuery } from '../../../generated/graphql-types';
import { toSeasonString } from '../../../utilities/course';
import { createCourseModalLink } from '../../../utilities/display';
import type { ModalNavigationFunction } from '../CourseModal';
import styles from './PastNotesLinks.module.css';

function PastNotesLinks({
  offerings,
  courseCode,
  onNavigation,
}: {
  readonly offerings: CourseModalOverviewDataQuery['sameCourse'];
  readonly courseCode: string;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [searchParams] = useSearchParams();
  if (offerings.length === 0) return null;

  return (
    <div className={styles.pastNotes}>
      <h2 className={styles.heading}>Other notes for this course</h2>
      <ul className={styles.list}>
        {offerings.map((offering) => {
          const offeringListing =
            offering.listings.find((l) => l.course_code === courseCode) ??
            offering.listings[0]!;
          const target = { ...offeringListing, course: offering };
          return (
            <li key={`${offering.season_code}-${offeringListing.crn}`}>
              <Link
                to={createCourseModalLink(target, searchParams)}
                onClick={() => onNavigation('push', target, 'notes')}
              >
                {toSeasonString(offering.season_code)}, Section{' '}
                {offering.section}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PastNotesLinks;
