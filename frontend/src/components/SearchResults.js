import React, { useState, useEffect } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Col, Row } from 'react-bootstrap';

import { useLazyQuery } from '@apollo/react-hooks';
import { GET_COURSE_MODAL } from '../queries/QueryStrings';
import { preprocess_courses, flatten } from '../utilities';

import NoCoursesFound from '../images/no_courses_found.svg';

const SearchResults = ({
  data,
  isList,
  setView,
  fetch_more,
  setFetchMore,
  offset,
  setOffset,
  setEnd,
  setScroll,
  multi_seasons,
  query_size,
}) => {
  const { height, width } = useWindowDimensions();

  const isMobile = width < 768;

  if (isMobile && isList) setView(false);
  // var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  const [showModal, setShowModal] = useState(false);
  const [modal_course, setModalCourse] = useState();
  // const [show_tooltip, setShowTooltip] = useState(false);
  let key = 0;
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
      modal = (
        <CourseModal
          hideModal={hideModal}
          show={showModal}
          listing={null}
          partial_listing={modal_course}
        />
      );
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

  // Determine if at end or not. Update Offset value
  useEffect(() => {
    if (
      data.length > 0 &&
      data.length !== offset &&
      data.length % query_size === 0
    ) {
      setOffset(data.length);
    }
    if (data.length % query_size === 0) setEnd(false);
    else setEnd(true);
  }, [data, setOffset, setEnd, offset, query_size]);

  // Fetch more courses if scroll down 80% of the page
  useEffect(() => {
    const results_element = document.getElementById('results_container');
    if (!results_element) return;
    window.onscroll = () => {
      setScroll(window.pageYOffset);
      if (
        data.length > 0 &&
        !fetch_more &&
        window.pageYOffset + height > 0.8 * results_element.clientHeight
      ) {
        setFetchMore(true);
      }
    };
  }, [data.length, fetch_more, height, setFetchMore, setScroll]);

  const num_cols = width < 1100 ? 2 : 3;
  let grid_html = [];

  var resultsListing;

  // if no courses found, render the empty state
  if (data.length === 0) {
    resultsListing = (
      <div className="text-center py-5">
        <img
          alt="No courses found."
          className="py-5"
          src={NoCoursesFound}
          style={{ width: '25%' }}
        ></img>
        <h3>No courses found</h3>
        <div>We couldn't find any courses matching your search.</div>
      </div>
    );
  } else {
    // if not list view, prepare the grid
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
              setModalCourse={setModalCourse}
              executeGetCourseModal={executeGetCourseModal}
              num_cols={num_cols}
              multi_seasons={multi_seasons}
              key={key++}
            />
          );
        }
        grid_html.push(
          <Row className="mx-auto" key={key++}>
            {row_elements}
          </Row>
        );
      }

      resultsListing = <div className="pt-3">{grid_html}</div>;
    }

    // otherwise, prepare the listing
    else {
      resultsListing = data.map((course) => (
        <SearchResultsItem
          course={flatten(course)}
          isMobile={isMobile}
          setShowModal={setShowModal}
          setModalCourse={setModalCourse}
          executeGetCourseModal={executeGetCourseModal}
          key={key++}
        />
      ));
    }
  }

  return (
    <div>
      <Container
        id="results_container"
        className={`px-0 shadow-sm ${Styles.results_container}`}
      >
        {!isMobile && (
          <div className={Styles.sticky_header}>
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
                <div className="d-flex ml-auto my-auto">
                  <ListGridToggle isList={isList} setView={setView} />
                </div>
              </Col>
            </Row>
          </div>
        )}
        {resultsListing}
      </Container>
      {modal}
    </div>
  );
};

export default SearchResults;
