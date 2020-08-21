import React, { useState, useEffect, useRef } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import CourseModal from './CourseModal';
import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';
import './SearchResults.css';

import { Container, Col, Row, Spinner } from 'react-bootstrap';

import { flatten } from '../utilities';
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
  transition_end,
}) => {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  // var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  const [course_modal, setCourseModal] = useState([false, '']);
  // const [show_tooltip, setShowTooltip] = useState(false);
  let key = 0;
  // const [modalCalled, setModalCalled] = React.useState(false);

  const showModal = (listing) => {
    setCourseModal([true, listing]);
  };

  const hideModal = () => {
    setCourseModal([false, '']);
  };

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

  const [ROW_WIDTH, setRowWidth] = useState();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) setRowWidth(ref.current.offsetWidth);
    console.log(ROW_WIDTH);
  }, [ref.current, width, transition_end]);

  const PROF_WIDTH = 150;
  const MEET_WIDTH = 200;
  const RATE_WIDTH = 70;
  const BOOKMARK_WIDTH = 50;
  const PADDING = 50;
  const PROF_CUT = 1300;
  const MEET_CUT = 1000;

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
            showModal={showModal}
            isLast={index === data.length - 1 && data.length % 30 !== 0} // This is wack
            ROW_WIDTH={ROW_WIDTH}
            PROF_WIDTH={PROF_WIDTH}
            MEET_WIDTH={MEET_WIDTH}
            RATE_WIDTH={RATE_WIDTH}
            BOOKMARK_WIDTH={BOOKMARK_WIDTH}
            PADDING={PADDING}
            PROF_CUT={PROF_CUT}
            MEET_CUT={MEET_CUT}
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
              showModal={showModal}
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
          threshold={15}
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
          threshold={30}
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
                      rowHeight={67}
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
        fluid
        id="results_container"
        className={`px-0 shadow-sm ${Styles.results_container}`}
      >
        {!isMobile && (
          <div className={`${Styles.sticky_header}`}>
            <Row
              ref={ref}
              className={
                `mx-auto px-2 py-2 shadow-sm ${Styles.results_header_row}` +
                (isList ? ' justify-content-end' : ' justify-content-between')
              }
            >
              {isList ? (
                <React.Fragment>
                  <div
                    style={{
                      lineHeight: '30px',
                      width: `${
                        ROW_WIDTH -
                        (width > PROF_CUT ? PROF_WIDTH : 0) -
                        (width > MEET_CUT ? MEET_WIDTH : 0) -
                        3 * RATE_WIDTH -
                        BOOKMARK_WIDTH -
                        PADDING
                      }px`,
                      paddingLeft: '15px',
                    }}
                    className="mr-auto"
                  >
                    <strong>{'Description'}</strong>
                  </div>
                  {width > PROF_CUT && (
                    <div
                      style={{ lineHeight: '30px', width: `${PROF_WIDTH}px` }}
                      className="pr-4"
                    >
                      <strong>{'Professors'}</strong>
                    </div>
                  )}
                  {width > MEET_CUT && (
                    <div
                      style={{ lineHeight: '30px', width: `${MEET_WIDTH}px` }}
                    >
                      <strong>{'Meets'}</strong>
                    </div>
                  )}
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <strong className="m-auto">{'Class'}</strong>
                  </div>
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <strong className="m-auto">{'Prof'}</strong>
                  </div>
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <strong className="m-auto">{'Work'}</strong>
                  </div>
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
              <div
                style={{ lineHeight: '30px', width: `${BOOKMARK_WIDTH}px` }}
                className="d-flex pr-2"
              >
                <div className="d-flex ml-auto my-auto p-0">
                  <ListGridToggle isList={isList} setView={setView} />
                </div>
              </div>
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
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
      />
    </div>
  );
};

export default SearchResults;
