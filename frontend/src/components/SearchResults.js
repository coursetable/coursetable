import React, { useState, useEffect } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';

import Sticky from 'react-sticky-el';

import { useLazyQuery } from '@apollo/react-hooks';
import { GET_COURSE_MODAL } from '../queries/QueryStrings';
import { preprocess_courses, flatten } from '../utilities';
import { isSelectionNode } from 'graphql';

const SearchResults = ({
  data,
  isList,
  setView,
  fetch_more,
  setFetchMore,
  offset,
  setOffset,
  setEnd,
}) => {
  const { height, width } = useWindowDimensions();

  const isMobile = width < 768;

  if (isMobile && isList) setView(false);

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

  const renderTooltip = (props) => (
    <Tooltip disable={width < 1024} id="button-tooltip" {...props}>
      <small style={{ fontWeight: 600 }}>
        {isList ? 'Grid View' : 'List View'}
      </small>
    </Tooltip>
  );

  // Determine if at end or not. Update Offset value
  useEffect(() => {
    if (data.length !== offset) {
      if (data.length % 40 === 0) {
        setOffset(data.length);
        setEnd(false);
      } else setEnd(true);
    }
  }, [data]);

  // Fetch more courses if scroll down 80% of the page
  useEffect(() => {
    const results_element = document.getElementById('results_container');
    if (!results_element) return;
    window.onscroll = () => {
      if (
        !fetch_more &&
        window.pageYOffset + height > 0.8 * results_element.clientHeight
      ) {
        setFetchMore(true);
      }
    };
  }, []);

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
      <Container
        id="results_container"
        className={`px-0 shadow-sm ${Styles.results_container}`}
      >
        {!isMobile && (
          <Sticky>
            <Row
              className={`mx-auto px-0 py-2 shadow-sm justify-content-between ${Styles.results_header_row}`}
            >
              {isList ? (
                <>
                  <Col md={4} style={{ lineHeight: '30px' }}>
                    <strong>{'Description'}</strong>
                  </Col>
                  <Col md={2} style={{ lineHeight: '30px' }}>
                    <strong>{'Rating'}</strong>
                  </Col>
                  <Col md={2} style={{ lineHeight: '30px' }}>
                    <strong>{'Workload'}</strong>
                  </Col>
                  <Col md={2} style={{ lineHeight: '30px' }}>
                    <strong>{'Areas'}</strong>
                  </Col>
                </>
              ) : (
                <Col md={10} style={{ lineHeight: '30px' }}>
                  <strong>
                    {`Showing ${data.length} Search Result${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </strong>
                </Col>
              )}
              <Col md={2} style={{ lineHeight: '30px' }} className="d-flex">
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 1000, hide: 200 }}
                  overlay={renderTooltip}
                >
                  <div className="d-flex ml-auto my-auto">
                    <ListGridToggle isList={isList} setView={setView} />
                  </div>
                </OverlayTrigger>
              </Col>
            </Row>
          </Sticky>
        )}
        <div className={isList ? 'px-0' : 'px-2'}>
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
            <div className="pt-3">{grid_html}</div>
          )}
        </div>
      </Container>
      {modal}
    </div>
  );
};

export default SearchResults;
