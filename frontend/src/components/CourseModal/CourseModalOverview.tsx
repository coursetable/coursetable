import { Row, Col, Modal } from 'react-bootstrap';

import type { CourseModalHeaderData } from './CourseModal';
import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useUser } from '../../contexts/userContext';
import { useSameCourseOrProfOfferingsQuery } from '../../queries/graphql-queries';
import Spinner from '../Spinner';
import './react-multi-toggle-override.css';

function CourseModalOverview({
  onNavigation,
  header,
}: {
  readonly onNavigation: (x: CourseModalHeaderData) => void;
  readonly header: CourseModalHeaderData;
}) {
  const { user } = useUser();

  const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
    variables: {
      seasonCode: header.season_code,
      crn: header.crn,
      hasEval: Boolean(user.hasEvals),
      same_course_id: header.course.same_course_id,
      professor_ids: header.course.course_professors.map(
        (p) => p.professor.professor_id,
      ),
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
          <OverviewRatings onNavigation={onNavigation} data={data} />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
