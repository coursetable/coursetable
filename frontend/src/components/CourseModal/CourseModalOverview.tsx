import { Row, Col, Modal } from 'react-bootstrap';

import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useUser } from '../../contexts/userContext';
import {
  useSameCourseOrProfOfferingsQuery,
  type SameCourseOrProfOfferingsQuery,
} from '../../generated/graphql';
import type { Listing } from '../../queries/api';
import Spinner from '../Spinner';
import './react-multi-toggle-override.css';

export type RelatedListingInfo =
  SameCourseOrProfOfferingsQuery['computed_listing_info'][number];

function CourseModalOverview({
  gotoCourse,
  listing,
}: {
  readonly gotoCourse: (x: Listing) => void;
  readonly listing: Listing;
}) {
  const { user } = useUser();

  const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
    variables: {
      hasEval: Boolean(user.hasEvals),
      same_course_id: listing.same_course_id,
      professor_ids: listing.professor_ids,
    },
  });

  // Wait until data is fetched
  if (loading || error) {
    return (
      <Modal.Body>
        <Spinner />
      </Modal.Body>
    );
  }

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          <OverviewInfo listing={listing} data={data} />
        </Col>
        <Col md={5} className="px-0 my-0">
          <OverviewRatings
            gotoCourse={gotoCourse}
            data={data}
            listing={listing}
          />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
