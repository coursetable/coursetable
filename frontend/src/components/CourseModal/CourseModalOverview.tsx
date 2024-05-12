import { Row, Col, Modal } from 'react-bootstrap';

import type { CourseModalHeaderData } from './CourseModal';
import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useUser } from '../../contexts/userContext';
import {
  useSameCourseOrProfOfferingsQuery,
  type SameCourseOrProfOfferingsQuery,
} from '../../generated/graphql';
import Spinner from '../Spinner';
import './react-multi-toggle-override.css';

export type ListingInfo = SameCourseOrProfOfferingsQuery['self'][number];

export type RelatedListingInfo =
  SameCourseOrProfOfferingsQuery['others'][number];

function CourseModalOverview({
  gotoCourse,
  header,
}: {
  readonly gotoCourse: (x: CourseModalHeaderData) => void;
  readonly header: CourseModalHeaderData;
}) {
  const { user } = useUser();

  const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
    variables: {
      seasonCode: header.season_code,
      crn: header.crn,
      hasEval: Boolean(user.hasEvals),
      same_course_id: header.same_course_id,
      professor_ids: header.professor_ids,
    },
  });

  // Wait until data is fetched
  if (loading || error || !data) {
    return (
      <Modal.Body>
        <Spinner />
      </Modal.Body>
    );
  }

  const {
    self: [listing],
    others,
  } = data;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          <OverviewInfo listing={listing!} others={others} />
        </Col>
        <Col md={5} className="px-0 my-0">
          <OverviewRatings
            gotoCourse={gotoCourse}
            listing={listing!}
            others={others}
          />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
