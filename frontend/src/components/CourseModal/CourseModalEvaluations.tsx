import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import EvaluationResponses from './EvaluationResponses';
import EvaluationRatings from './EvaluationRatings';

import CourseModalLoading from './CourseModalLoading';
import { useSearchEvaluationNarrativesQuery } from '../../generated/graphql';
import type { Listing } from '../../utilities/common';

/**
 * Displays course modal when clicking on a course
 * @prop seasonCode - string that holds current listing's season code
 * @prop crn - integer that holds current listing's crn
 * @prop courseCode - string that holds current listing's course code
 */
function CourseModalEvaluations({ listing }: { readonly listing: Listing }) {
  // Fetch eval data for this listing
  const { loading, error, data } = useSearchEvaluationNarrativesQuery({
    variables: {
      season_code: listing.season_code,
      course_code: listing.course_code,
    },
  });
  // Wait until fetched
  if (loading || error || !data) return <CourseModalLoading />;
  const info = data.computed_listing_info;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={5} className="px-0 my-0">
          {/* Evaluation Graphs */}
          <EvaluationRatings crn={listing.crn} info={info} />
        </Col>

        <Col md={7} className="pr-0 pl-2 my-0">
          {/* Evaluation Comments */}
          <EvaluationResponses crn={listing.crn} info={info} />
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalEvaluations;
