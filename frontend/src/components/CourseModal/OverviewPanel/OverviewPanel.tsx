import { Row, Col } from 'react-bootstrap';
import { MdWarning } from 'react-icons/md';

import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import { useCourseModalOverviewDataQuery } from '../../../queries/graphql-queries';
import { useStore } from '../../../store';
import Spinner from '../../Spinner';
import type { ModalNavigationFunction } from '../CourseModal';

function OverviewPanel({
  onNavigation,
  prefetched,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly prefetched: CourseModalPrefetchListingDataFragment;
}) {
  const user = useStore((state) => state.user);

  const { data, loading, error } = useCourseModalOverviewDataQuery({
    variables: {
      seasonCode: prefetched.course.season_code,
      crn: prefetched.crn,
      hasEvals: Boolean(user?.hasEvals),
      sameCourseId: prefetched.course.same_course_id,
    },
  });

  // Wait until data is fetched
  if (loading) return <Spinner message="Loading course details..." />;

  if (error) {
    return (
      <Row className="m-auto">
        <Col>
          <p>Failed to load data: {error.message}</p>
        </Col>
      </Row>
    );
  }

  const { sameCourse = [], self: [listing] = [] } = data ?? {};

  if (!listing) {
    return (
      <Row className="m-auto">
        <Col>
          <p>Unexpected: no data returned.</p>
          <p>
            There could be some issues with our servers, or more likely we are
            updating the data on course offerings. Please allow for up to 10
            minutes for course information to become available again.
          </p>
        </Col>
      </Row>
    );
  }

  // TODO: properly fix this data
  const isSameCourseWrong = !sameCourse.some((c) =>
    c.listings.some((l) => l.crn === listing.crn),
  );

  return (
    <Row className="m-auto">
      <Col md={7} className="px-0 mt-0 mb-3">
        <OverviewInfo
          onNavigation={onNavigation}
          listing={listing}
          sameCourse={sameCourse}
        />
      </Col>
      <Col md={5} className="px-0 my-0">
        {isSameCourseWrong && (
          <div className="alert alert-warning">
            <MdWarning className="mr-2" />
            <strong>Warning:</strong> We have detected a possible error in the
            data returned. Try opening CourseTable in a new tab.
          </div>
        )}
        <OverviewRatings
          onNavigation={onNavigation}
          listing={listing}
          sameCourse={sameCourse}
        />
      </Col>
    </Row>
  );
}

export default OverviewPanel;
