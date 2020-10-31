import React, { useState, useEffect, useRef } from 'react';

import SearchResultsItem from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';
import './SearchResults.css';

import {
  Container,
  Col,
  Row,
  Spinner,
  Fade,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';

import { flatten } from '../utilities';
import {
  InfiniteLoader,
  List,
  WindowScroller,
  AutoSizer,
} from 'react-virtualized';

import NoCoursesFound from '../images/no_courses_found.svg';
import Authentication from '../images/authentication.svg';

import { FaArrowCircleUp, FaAppleAlt } from 'react-icons/fa';
import { FcReading } from 'react-icons/fc';
import { AiFillStar } from 'react-icons/ai';

/**
 * Renders the infinite list of search results
 * @prop data - list that holds the search results
 * @prop isList - boolean that determines display format (list or grid)
 * @prop setView - function to change display format
 * @prop loading - boolean | Is the search query finished?
 * @prop loadMore - boolean | Do we need to fetch more courses?
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop searched - boolean | has the search started?
 * @prop fetchedAll - boolean | Have we fetched all search results?
 * @prop isLoggedIn - boolean | is the user logged in?
 */

const SearchResults = ({
  data,
  isList,
  setView,
  loading,
  loadMore,
  multiSeasons,
  searched,
  fetchedAll,
  showModal,
  isLoggedIn,
}) => {
  // Fetch width of window
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  // Show tooltip for the list/grid view toggle. NOT USING RN
  // const [show_tooltip, setShowTooltip] = useState(false);

  // Variable used in list keys
  let key = 0;

  // Should we render the scroll up button?
  const [scroll_visible, setScrollVisible] = useState(false);
  // Render scroll-up button after scrolling a lot
  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > 2000 && !scroll_visible) setScrollVisible(true);
      if (window.pageYOffset < 2000 && scroll_visible) setScrollVisible(false);
    };
  });

  // Scroll to top button click handler
  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Number of columns to use in grid view
  const num_cols = width < 1100 ? (width < 768 ? 1 : 2) : 3;
  // List that holds the HTML for each row in grid view
  let grid_html = [];

  // State that holds width of the row for list view
  const [ROW_WIDTH, setRowWidth] = useState();
  // Ref to get row width
  const ref = useRef(null);
  useEffect(() => {
    // Set row width
    if (ref.current) setRowWidth(ref.current.offsetWidth);
  }, [setRowWidth, width]);

  // Spacing for each column in list view
  const PROF_WIDTH = 150;
  const MEET_WIDTH = 200;
  const RATE_WIDTH = 40;
  const BOOKMARK_WIDTH = 50;
  const PADDING = 50;
  const PROF_CUT = 1023;
  const MEET_CUT = 1200;

  // Holds HTML for the search results
  var resultsListing;

  // Has the current row been fetched?
  function isRowLoaded({ index }) {
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
      <div style={style}>
        <SearchResultsItem
          course={flatten(data[index])}
          showModal={showModal}
          multiSeasons={multiSeasons}
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
    );
  };
  // if no courses found (either due to query or authentication), render the empty state
  if (data.length === 0) {
    resultsListing = (
      <div className="text-center py-5">
        <img
          alt="No courses found."
          className="py-5"
          src={isLoggedIn ? NoCoursesFound : Authentication}
          style={{ width: '25%' }}
        ></img>
        {isLoggedIn ? (
          <h3>No courses found</h3>
        ) : (
          <h3>
            Please{' '}
            <a href="/legacy_api/index.php?forcelogin=1&successurl=catalog">
              log in
            </a>
          </h3>
        )}
        <div>
          {isLoggedIn
            ? "We couldn't find any courses matching your search."
            : 'A valid Yale NetID is required to access course information.'}
        </div>
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
              showModal={showModal}
              isLoggedIn={isLoggedIn}
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
      // Store HTML for grid view results
      resultsListing = (
        <InfiniteLoader
          // isRowLoaded detects which rows have been requested to avoid multiple loadMoreRows calls
          isRowLoaded={isRowLoaded}
          // Only load more if previous search query has finished
          loadMoreRows={loading ? () => {} : loadMore}
          // Add extra row for loading row
          rowCount={!fetchedAll ? grid_html.length + 1 : grid_html.length}
          // How many courses from the end should we fetch more
          threshold={15}
        >
          {({ onRowsRendered, registerChild }) => (
            // Scroll the entire window
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                // Make infinite list take up 100% of its container
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

    // Store HTML for list view results
    else {
      resultsListing = (
        <InfiniteLoader
          // isRowLoaded detects which rows have been requested to avoid multiple loadMoreRows calls
          isRowLoaded={isRowLoaded}
          // Only load more if previous search query has finished
          loadMoreRows={loading ? () => {} : loadMore}
          // Add extra row for loading row
          rowCount={!fetchedAll ? data.length + 1 : data.length}
          // How many courses from the end should we fetch more
          threshold={30}
        >
          {({ onRowsRendered, registerChild }) => (
            // Scroll the entire window
            <WindowScroller>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                // Make infinite list take up 100% of its container
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

  // Tooltip for hovering over class rating
  const class_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Class Rating</span>
    </Tooltip>
  );

  // Tooltip for hovering over professor rating
  const prof_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Professor Rating</span>
    </Tooltip>
  );

  // Tooltip for hovering over workload rating
  const workload_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Workload Rating</span>
    </Tooltip>
  );

  return (
    <div>
      <Container
        fluid
        id="results_container"
        className={`px-0 ${Styles.results_container}`}
      >
        {!isMobile && (
          <div className={`${Styles.sticky_header}`}>
            {/* Results Header */}
            <Row
              ref={ref}
              className={
                `mx-auto px-2 py-2 shadow-sm ${Styles.results_header_row}` +
                ' justify-content-between'
              }
            >
              {/* <div
                className={
                  Styles.list_grid_toggle + ' d-flex ml-auto my-auto p-0'
                }
              >
                <ListGridToggle isList={isList} setView={setView} />
              </div> */}
              {isList ? (
                <React.Fragment>
                  {/* Course Name */}
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
                  >
                    <strong>{'Course'}</strong>
                  </div>
                  {/* Course Professors */}
                  {width > PROF_CUT && (
                    <div
                      style={{ lineHeight: '30px', width: `${PROF_WIDTH}px` }}
                      className="pr-4"
                    >
                      <strong>{'Professors'}</strong>
                    </div>
                  )}
                  {/* Course Meeting times and location */}
                  {width > MEET_CUT && (
                    <div
                      style={{ lineHeight: '30px', width: `${MEET_WIDTH}px` }}
                    >
                      <strong>{'Meets'}</strong>
                    </div>
                  )}
                  {/* Class Rating */}
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 500, hide: 250 }}
                        overlay={class_tooltip}
                      >
                        <AiFillStar
                          color="#fac000"
                          style={{ display: 'block' }}
                          size={20}
                        />
                      </OverlayTrigger>
                    </div>
                  </div>
                  {/* Professor Rating */}
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 500, hide: 250 }}
                        overlay={prof_tooltip}
                      >
                        <FaAppleAlt
                          color="#fa6e6e"
                          style={{ display: 'block' }}
                          size={16}
                        />
                      </OverlayTrigger>
                    </div>
                  </div>
                  {/* Workload Rating */}
                  <div
                    style={{ lineHeight: '30px', width: `${RATE_WIDTH}px` }}
                    className="d-flex"
                  >
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 500, hide: 250 }}
                        overlay={workload_tooltip}
                      >
                        <FcReading style={{ display: 'block' }} size={20} />
                      </OverlayTrigger>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                // Grid view showing how many search results
                <Col md={10} style={{ lineHeight: '30px' }}>
                  <strong>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </strong>
                </Col>
              )}
              {/* List Grid Toggle Button */}
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
          {/* If there are search results, render them */}
          {data.length !== 0 && resultsListing}
          {/* If there are no search results, we are not logged in, and not loading, then render the empty state */}
          {data.length === 0 &&
            (!isLoggedIn || searched) &&
            !loading &&
            resultsListing}
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
      {/* Scroll up button */}
      <Fade in={scroll_visible}>
        <div className={Styles.up_btn}>
          <FaArrowCircleUp onClick={scrollTop} size={30} />
        </div>
      </Fade>
    </div>
  );
};

export default SearchResults;
