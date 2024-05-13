import { Row, Col, Modal } from 'react-bootstrap';

import type { CourseModalHeaderData } from './CourseModal';
import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useUser } from '../../contexts/userContext';
import { useSameCourseOrProfOfferingsQuery } from '../../generated/graphql';
import Spinner from '../Spinner';
import './react-multi-toggle-override.css';

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

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          <OverviewInfo data={data} />
        </Col>
        <Col md={5} className="px-0 my-0">
          <OverviewRatings gotoCourse={gotoCourse} data={data} />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
