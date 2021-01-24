import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toSeasonString } from '../courseUtilities';

const CourseModalEvaluations = ({ listing, all_listings }) => {
  const seasons = Object.keys(all_listings).reverse();
  return (
    <>
      <Col sm={3} className="px-0">
        {seasons.map((cur_season) => {
          return all_listings[cur_season].map((cur_listing) =>
            cur_listing.evals ? (
              <Row className="mx-auto">
                {toSeasonString(cur_season)[0]} {cur_listing.section}
              </Row>
            ) : null
          );
        })}
      </Col>
      <Col sm={9} className="px-0">
        Eval stuff
      </Col>
    </>
  );
};

export default CourseModalEvaluations;
