import { Row, Col } from 'react-bootstrap';

import OverviewInfo, { CourseInfo } from './OverviewInfo';
import OverviewRatings from './OverviewRatings';

import { useSameCourseOrProfOfferingsQuery } from '../../../../queries/graphql-queries';
import { useStore } from '../../../../store';
import Spinner from '../../../Spinner';
import type {
  ModalNavigationFunction,
  CourseModalHeaderData,
} from '../../CourseModal';

function OverviewPanel({
  onNavigation,
  header,
  professorView,
  setProfessorView,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly header: CourseModalHeaderData;
  readonly professorView:
    | CourseInfo['course_professors'][number]['professor']
    | null;
  setProfessorView: React.Dispatch<
    React.SetStateAction<
      CourseInfo['course_professors'][number]['professor'] | null
    >
  >;
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
  if (loading) return <Spinner />;

  if (error) {
    return (
      <Row className="m-auto">
        <Col>
          <p>Failed to load data: {error.message}</p>
        </Col>
      </Row>
    );
  }

  if (!data || data.self.length === 0) {
    return (
      <Row className="m-auto">
        <Col>
          <p>Unexpected: no data returned.</p>
          <p>
            There could be some issues with our servers. Please allow for up to
            10 minutes for course information to become available again.
          </p>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="m-auto">
      <Col md={7} className="px-0 mt-0 mb-10">
        {professorView ? (
          <p>This is where the graphs will go.</p>
        ) : (
          <OverviewInfo
            onNavigation={onNavigation}
            data={data}
            setProfessorView={setProfessorView}
          />
        )}
      </Col>
      <Col md={5} className="px-0 my-0">
        <OverviewRatings
          onNavigation={onNavigation}
          data={data}
          professorView={professorView}
        />
      </Col>
    </Row>
  );
}

export default OverviewPanel;
