import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import EvaluationResponses from './EvaluationResponses';
import EvaluationRatings from './EvaluationRatings';
import Spinner from '../Spinner';

import { useSearchEvaluationNarrativesQuery } from '../../generated/graphql';
import type { Crn, Season } from '../../utilities/common';

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
  if ((data?.computed_listing_info.length ?? 0) > 1) {
    Sentry.captureException(
      new Error(`More than one listings returned for ${seasonCode}-${crn}`),
    );
  }
  const info = data?.computed_listing_info[0];

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={5} className="px-0 my-0">
          <EvaluationRatings info={info} />
        </Col>

        <Col md={7} className="pr-0 pl-2 my-0">
          <EvaluationResponses info={info} />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalEvaluations;
