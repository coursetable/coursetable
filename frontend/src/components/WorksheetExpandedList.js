import React, { useEffect } from 'react';

import { Row, Col, Container } from 'react-bootstrap';

import styles from './WorksheetExpandedList.module.css';
import search_results_styles from './SearchResults.module.css';
import WorksheetExpandedListItem from './WorksheetExpandedListItem';

const WorksheetExpandedList = ({ courses, showModal, end_fade }) => {
  let items = [];

  // useEffect(() => {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    items.push(
      <div key={i}>
        <WorksheetExpandedListItem
          course={course}
          showModal={showModal}
          isLast={i === courses.length - 1}
          end_fade={end_fade}
        />
      </div>
    );
  }
  // }, []);

  return (
    <div>
      <Container
        fluid
        id="results_container"
        className={`px-0 shadow-sm ${search_results_styles.results_container} ${styles.shadow}`}
      >
        <div className={`${search_results_styles.sticky_header}`}>
          <Row
            className={`mx-auto px-2 py-2 shadow-sm justify-content-between ${search_results_styles.results_header_row}`}
          >
            <React.Fragment>
              <Col md={4} style={{ lineHeight: '30px' }}>
                <strong>{'Description'}</strong>
              </Col>
              <Col md={2} style={{ lineHeight: '30px' }}>
                <strong>{'Professors'}</strong>
              </Col>
              <Col md={3} style={{ lineHeight: '30px' }}>
                <strong>{'Meets'}</strong>
              </Col>
              <Col md={1} style={{ lineHeight: '30px' }}>
                <strong>{'Rating'}</strong>
              </Col>
              <Col md={1} style={{ lineHeight: '30px' }}>
                <strong>{'Work'}</strong>
              </Col>
            </React.Fragment>

            <Col md={1} style={{ lineHeight: '30px' }} className="d-flex pr-2">
              Season
            </Col>
          </Row>
        </div>

        <div className={styles.results_list_container}>{items}</div>
      </Container>
    </div>
  );
};

export default WorksheetExpandedList;
