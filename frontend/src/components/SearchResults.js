import React, { useState, useEffect } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';
import './SearchResults.css';

import { Container, Col, Row, Spinner } from 'react-bootstrap';

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
  loadMore,
  setScrollPos,
  multiSeasons,
  querySize,
  refreshCache,
  fetchedAll,
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
      data.length % querySize === 0
    ) {
      setOffset(data.length);
    }
  }, [data, setOffset, offset, querySize]);

  // Fetch more courses if scroll down 80% of the page
  useEffect(() => {
    window.onscroll = () => {
      setScrollPos(window.pageYOffset);
    };
  }, [setScrollPos]);

  useEffect(() => {
    cache.clearAll();
  }, [refreshCache]);

  const num_cols = width < 1100 ? (width < 768 ? 1 : 2) : 3;
  let grid_html = [];

  var resultsListing;

  function isRowLoaded({ index }) {
    // console.log(index);
    if (fetchedAll) return true;
    if (isList) return index < data.length;
    return index < grid_html.length;
  }

  // Render functions for React Virtualized List:

  const renderGridRow = ({ index, key, style }) => {
    if (!isRowLoaded({ index })) {
      return <div key={key} style={style} />;
    }
    return (
      <div key={key} style={style}>
        {grid_html[index]}
      </div>
    );
  };

  const renderListRow = ({ index, key, style, parent }) => {
    if (!isRowLoaded({ index })) {
      return <div key={key} style={style} />;
    }
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
            isLast={index === data.length - 1 && data.length % 30 !== 0} // This is wack
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
              multiSeasons={multiSeasons}
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
          isRowLoaded={isRowLoaded}
          loadMoreRows={loading ? () => {} : loadMore}
          rowCount={!fetchedAll ? grid_html.length + 1 : grid_html.length}
          threshold={8}
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
                      rowCount={
                        !fetchedAll ? grid_html.length + 1 : grid_html.length
                      }
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
          isRowLoaded={isRowLoaded}
          loadMoreRows={loading ? () => {} : loadMore}
          rowCount={!fetchedAll ? data.length + 1 : data.length}
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
                      rowCount={!fetchedAll ? data.length + 1 : data.length}
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
              ) : (
                <Col md={10} style={{ lineHeight: '30px' }}>
                  <strong>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </strong>
                </Col>
              )}
              <Col
                md={1}
                style={{ lineHeight: '30px' }}
                className="d-flex pr-2"
              >
                <div className="d-flex ml-auto my-auto p-0">
                  <ListGridToggle isList={isList} setView={setView} />
                </div>
              </Col>
            </Row>
          </div>
        )}
        <div className={!isList ? 'px-1 pt-3' : Styles.results_list_container}>
          {data.length !== 0 && resultsListing}
          {refreshCache > 0 && data.length === 0 && !loading && resultsListing}
          {/* Render a loading row while performing next query */}
          {loading && (
            <Row
              className={'m-auto ' + (data.length === 0 ? 'py-5' : 'pt-0 pb-4')}
            >
              <Spinner className="m-auto" animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Row>
          )}
        </div>
      </Container>
      {modal}
    </div>
  );
};

export default SearchResults;
