import React, { useState } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Card, Col, Row } from 'react-bootstrap';

import Sticky from 'react-sticky-el';

import { useLazyQuery } from '@apollo/react-hooks';
import { GET_COURSE_MODAL } from '../queries/QueryStrings';
import { preprocess_courses, flatten } from '../utilities';

const SearchResults = ({ data, isList, setView }) => {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  if (isMobile && !isList) setView(true);

  const [showModal, setShowModal] = React.useState(false);
  // const [modalCalled, setModalCalled] = React.useState(false);

  var [
    executeGetCourseModal,
    { called: modalCalled, loading: modalLoading, data: modalData },
  ] = useLazyQuery(GET_COURSE_MODAL);

  const hideModal = () => {
    setShowModal(false);
  };

  var modal;

  if (modalCalled) {
    if (modalLoading) {
      modal = <div>Loading...</div>;
    } else {
      if (modalData) {
        modal = (
          <CourseModal
            hideModal={hideModal}
            show={showModal}
            listing={preprocess_courses(flatten(modalData.listings[0]))}
          />
        );
      }
    }
  }
  const num_cols = width < 1024 ? 2 : 3;
  let grid_html = [];
  if (!isList) {
    const len = data.length;
    for (let i = 0; i < len; i += num_cols) {
      let row_elements = [];
      for (let j = i; j < len && j < i + num_cols; j++) {
        row_elements.push(
          <SearchResultsGridItem
            course={flatten(data[j])}
            isMobile={isMobile}
            setShowModal={setShowModal}
            executeGetCourseModal={executeGetCourseModal}
            num_cols={num_cols}
          />
        );
      }
      grid_html.push(<Row className="mx-auto">{row_elements}</Row>);
    }
  }

  return (
    <div>
      <Container className={`shadow-sm ${Styles.results_container}`}>
        {!isMobile && (
          <Sticky>
            <Row
              className={`px-0 py-2 shadow-sm justify-content-between ${Styles.results_header_row}`}
            >
              <Col md={4} style={{ lineHeight: '30px' }}>
                <strong>
                  {isList
                    ? 'Description'
                    : `Showing ${data.length} Search Results...`}
                </strong>
              </Col>
              <Col md={2} style={{ lineHeight: '30px' }}>
                <strong>{isList ? 'Rating' : ''}</strong>
              </Col>
              <Col md={2} style={{ lineHeight: '30px' }}>
                <strong>{isList ? 'Workload' : ''}</strong>
              </Col>
              <Col md={2} style={{ lineHeight: '30px' }}>
                <strong>{isList ? 'Areas' : ''}</strong>
              </Col>
              <Col md={2} style={{ lineHeight: '30px' }} className="d-flex">
                <ListGridToggle isList={isList} setView={setView} />
              </Col>
            </Row>
          </Sticky>
        )}
        <div className="px-2">
          {isList ? (
            data.map((course) => (
              <SearchResultsItem
                course={flatten(course)}
                isMobile={isMobile}
                setShowModal={setShowModal}
                executeGetCourseModal={executeGetCourseModal}
              />
            ))
          ) : (
            <div className="mt-3">{grid_html}</div>
          )}
        </div>
      </Container>
      {modal}
    </div>
  );
};

export default SearchResults;
