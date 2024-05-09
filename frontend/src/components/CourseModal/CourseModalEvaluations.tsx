import * as Sentry from '@sentry/react';
import { Row, Col, Modal } from 'react-bootstrap';
import EvaluationRatings from './EvaluationRatings';
import EvaluationResponses from './EvaluationResponses';

import { useSearchEvaluationNarrativesQuery } from '../../generated/graphql';
import type { Crn, Season } from '../../utilities/common';
import Spinner from '../Spinner';

function CourseModalEvaluations({
  seasonCode,
  crn,
}: {
  readonly seasonCode: Season;
  readonly crn: Crn;
}) {
  const { loading, error, data } = useSearchEvaluationNarrativesQuery({
    variables: {
      season_code: seasonCode,
      crn,
    },
  });
  if (loading || error) {
    return (
      <Modal.Body>
        <Spinner />
      </Modal.Body>
    );
  }
  if ((data?.listings.length ?? 0) > 1) {
    Sentry.captureException(
      new Error(`More than one listings returned for ${seasonCode}-${crn}`),
    );
  }
  const info = data?.listings[0]!.course;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={5} className="px-0 my-0">
          <EvaluationRatings info={info} />
        </Col>

        <Col md={7} className="pe-0 ps-2 my-0">
          <EvaluationResponses info={info} />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalEvaluations;
