import React, { useState, useEffect } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';
import './SearchResults.css';

import { Container, Col, Row } from 'react-bootstrap';

import { useLazyQuery } from '@apollo/react-hooks';
import { GET_COURSE_MODAL } from '../queries/QueryStrings';
import { preprocess_courses, flatten } from '../utilities';
import {
  InfiniteLoader,
  List,
  WindowScroller,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';

import NoCoursesFound from '../images/no_courses_found.svg';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50,
});

const SearchResults = ({
  data,
  isList,
  setView,
  offset,
  setOffset,
  loading,
  // Load more function for InfiniteLoader
  loadMore,
  setScroll,
  multi_seasons,
  QUERY_SIZE,
}) => {
  const { height, width } = useWindowDimensions();

  const isMobile = width < 768;

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
      data.length % QUERY_SIZE === 0
    ) {
      setOffset(data.length);
    }
  }, [data, setOffset, offset, QUERY_SIZE]);

  // Fetch more courses if scroll down 80% of the page
  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.pageYOffset);
    };
  }, []);

  const num_cols = width < 1100 ? 2 : 3;
  let grid_html = [];

  var resultsListing;

  // Render functions for React Virtualized List:

  const renderGridRow = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        {grid_html[index]}
      </div>
    );
  };

  const renderListRow = ({ index, key, style, parent }) => {
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          <SearchResultsItem
            course={flatten(data[index])}
            isMobile={isMobile}
            setShowModal={setShowModal}
            setModalCourse={setModalCourse}
            executeGetCourseModal={executeGetCourseModal}
          />
        </div>
      </CellMeasurer>
    );
  };

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

      resultsListing = (
        <InfiniteLoader
          isRowLoaded={(index) => !!grid_html[index]}
          loadMoreRows={loading ? () => {} : loadMore}
          rowCount={grid_html.length}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      autoHeight
                      width={width}
                      height={height}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      rowCount={grid_html.length}
                      rowHeight={178}
                      rowRenderer={renderGridRow}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      );
    }

    // otherwise, prepare the listing
    else {
      resultsListing = (
        <InfiniteLoader
          isRowLoaded={(index) => !!data[index]}
          loadMoreRows={loading ? () => {} : loadMore}
          rowCount={data.length}
        >
          {({ onRowsRendered, registerChild }) => (
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <List
                      autoHeight
                      width={width}
                      height={height}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      isScrolling={isScrolling}
                      onScroll={onChildScroll}
                      scrollTop={scrollTop}
                      rowCount={data.length}
                      rowRenderer={renderListRow}
                      deferredMeasurementCache={cache}
                      rowHeight={cache.rowHeight}
                    />
                  )}
                </AutoSizer>
              )}
            </WindowScroller>
          )}
        </InfiniteLoader>
      );
    }
  }

  return (
    <div>
      <Container
        id="results_container"
        className={`px-0 shadow-sm ${Styles.results_container}`}
      >
        {!isMobile && (
          <div className={`${Styles.sticky_header}`}>
            <Row
              className={`mx-auto px-2 py-2 shadow-sm justify-content-between ${Styles.results_header_row}`}
            >
              {isList ? (
                <>
                  <Col md={4} style={{ lineHeight: '30px' }}>
                    <strong>{'Description'}</strong>
                  </Col>
                  <Col md={3} style={{ lineHeight: '30px' }}>
                    <strong>{'Meets'}</strong>
                  </Col>
                  <Col md={2} style={{ lineHeight: '30px' }}>
                    <strong>{'Rating'}</strong>
                  </Col>
                  <Col md={2} style={{ lineHeight: '30px' }}>
                    <strong>{'Workload'}</strong>
                  </Col>
                </>
              ) : (
                <Col md={10} style={{ lineHeight: '30px' }}>
                  <strong>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </strong>
                </Col>
              )}
              <Col md={1} style={{ lineHeight: '30px' }} className="d-flex">
                <div className="d-flex mx-auto my-auto">
                  <ListGridToggle isList={isList} setView={setView} />
                </div>
              </Col>
            </Row>
          </div>
        )}
        <div className={!isList ? 'px-1 pt-3' : ''}>
          {resultsListing}
          {/* Render a loading row while performing next query */}
          {loading && (
            <Row className="m-auto pt-0 pb-2">
              <strong className="mx-auto">Loading...</strong>
            </Row>
          )}
        </div>
      </Container>
      {modal}
    </div>
  );
};

export default SearchResults;
