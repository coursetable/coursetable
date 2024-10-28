import { Row, Col } from 'react-bootstrap';

import OverviewInfo from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useSameCourseOrProfOfferingsQuery } from '../../../queries/graphql-queries';
import { useStore } from '../../../store';
import Spinner from '../../Spinner';
import type {
  ModalNavigationFunction,
  CourseModalHeaderData,
} from '../CourseModal';

function OverviewPanel({
  onNavigation,
  header,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly header: CourseModalHeaderData;
}) {
  const user = useStore((state) => state.user);

  const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
    variables: {
      seasonCode: header.season_code,
      crn: header.crn,
      hasEval: Boolean(user.hasEvals),
      sameCourseId: header.course.same_course_id,
      professorIds: header.course.course_professors.map(
        (p) => p.professor.professor_id,
      ),
    },
  });

  // Wait until data is fetched
  if (loading || error || !data) return <Spinner />;

  return (
    <Row className="m-auto">
      <Col md={7} className="px-0 mt-0 mb-3">
        <OverviewInfo onNavigation={onNavigation} data={data} />
      </Col>
      <Col md={5} className="px-0 my-0">
        <OverviewRatings onNavigation={onNavigation} data={data} />
      </Col>
    </Row>
  );
}

export default OverviewPanel;
