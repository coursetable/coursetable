import { Row, Col } from 'react-bootstrap';
import EvaluationRatings from './EvaluationRatings';
import EvaluationResponses from './EvaluationResponses';

import { useSearchEvaluationNarrativesQuery } from '../../../queries/graphql-queries';
import type { Crn, Season } from '../../../queries/graphql-types';
import { getListingId } from '../../../utilities/course';
import Spinner from '../../Spinner';

function EvaluationsPanel({
  seasonCode,
  crn,
}: {
  readonly seasonCode: Season;
  readonly crn: Crn;
}) {
  const { loading, error, data } = useSearchEvaluationNarrativesQuery({
    variables: {
      listingId: getListingId(seasonCode, crn),
    },
  });
  if (loading || error) return <Spinner message="Loading evaluations..." />;
  const info = data?.listings_by_pk?.course;

  return (
    <Row className="m-auto">
      <Col md={5} className="px-0 my-0">
        <EvaluationRatings info={info} />
      </Col>

      <Col md={7} className="pe-0 ps-2 my-0">
        <EvaluationResponses info={info} />
      </Col>
    </Row>
  );
}

export default EvaluationsPanel;
