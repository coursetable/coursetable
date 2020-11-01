import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import SearchResultsItemMemo from './SearchResultsItem';
import SearchResultsGridItem from './SearchResultsGridItem';

// import ListGridToggle from './ListGridToggle';

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
  // setView,
  loading,
  loadMore,
  multiSeasons,
  searched,
  fetchedAll,
  showModal,
  isLoggedIn,
  expanded,
}) => {
  // Fetch width of window
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  // Show tooltip for the list/grid view toggle. NOT USING RN
  // const [show_tooltip, setShowTooltip] = useState(false);

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
  const grid_html = useMemo(() => {
    let grid = [];
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
            key={j}
          />
        );
      }
      grid.push(
        <Row className="mx-auto" key={i}>
          {row_elements}
        </Row>
      );
    }
    return grid;
  }, [data, showModal, isLoggedIn, multiSeasons, num_cols]);

  // State that holds width of the row for list view
  const [ROW_WIDTH, setRowWidth] = useState();
  // Ref to get row width
  const ref = useRef(null);
  useEffect(() => {
    // Set row width
    if (ref.current) setRowWidth(ref.current.offsetWidth);
  }, [setRowWidth, width, expanded]);

  // Spacing for each column in list view
  const COL_SPACING = {
    CODE_WIDTH: 110,
    RATE_WIDTH: 30,
    NUM_WIDTH: 40,
    PROF_WIDTH: 150,
    MEET_WIDTH: 160,
    LOC_WIDTH: 100,
    SA_WIDTH: 100,
    PADDING: 35,
    PROF_CUT: 730,
    MEET_CUT: 830,
    LOC_CUT: 930,
    SA_CUT: 1030,
  };
  const TITLE_WIDTH = useMemo(() => {
    return (
      ROW_WIDTH -
      COL_SPACING.CODE_WIDTH -
      COL_SPACING.LOC_WIDTH -
      (ROW_WIDTH > COL_SPACING.PROF_CUT ? COL_SPACING.PROF_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.MEET_CUT ? COL_SPACING.MEET_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.SA_CUT ? COL_SPACING.SA_WIDTH : 0) -
      (ROW_WIDTH > COL_SPACING.LOC_CUT ? COL_SPACING.LOC_WIDTH : 0) -
      3 * COL_SPACING.RATE_WIDTH -
      2 * COL_SPACING.NUM_WIDTH -
      COL_SPACING.PADDING
    );
  }, [ROW_WIDTH, COL_SPACING]);

  // Holds HTML for the search results
  var resultsListing;

  // Has the current row been fetched?
  const isRowLoaded = useCallback(
    ({ index }) => {
      if (fetchedAll) return true;
      if (isList) return index < data.length;
      return index < grid_html.length;
    },
    [fetchedAll, isList, grid_html, data]
  );

  // Render functions for React Virtualized List:
  const renderGridRow = useCallback(
    ({ index, key, style }) => {
      if (!isRowLoaded({ index })) {
        return <div key={key} style={style} />;
      }
      return (
        <div key={key} style={style}>
          {grid_html[index]}
        </div>
      );
    },
    [grid_html, isRowLoaded]
  );

  const renderListRow = useCallback(
    ({ index, key, style, isScrolling }) => {
      if (!isRowLoaded({ index })) {
        return <div key={key} style={style} />;
      }
      return (
        <div style={style} key={key}>
          <SearchResultsItemMemo
            unflat_course={data[index]}
            showModal={showModal}
            multiSeasons={multiSeasons}
            isLast={index === data.length - 1}
            COL_SPACING={COL_SPACING}
            TITLE_WIDTH={TITLE_WIDTH}
            ROW_WIDTH={ROW_WIDTH}
            isScrolling={isScrolling}
          />
        </div>
      );
    },
    [
      data,
      showModal,
      multiSeasons,
      isRowLoaded,
      COL_SPACING,
      TITLE_WIDTH,
      ROW_WIDTH,
    ]
  );

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
                      rowHeight={32}
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
  const class_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Class Rating</span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over professor rating
  const prof_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Professor Rating</span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over workload rating
  const workload_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Workload Rating</span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over enrollment
  const enrollment_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Class Enrollment</span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over fb friends
  const fb_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Number of Facebook friends shopping this class</span>
      </Tooltip>
    ),
    []
  );

  // Column width styles
  const code_style = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: '15px',
  };
  const title_style = { width: `${TITLE_WIDTH}px` };
  const rate_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WIDTH}px`,
  };
  const prof_style = { width: `${COL_SPACING.PROF_WIDTH}px` };
  const meet_style = { width: `${COL_SPACING.MEET_WIDTH}px` };
  const loc_style = { width: `${COL_SPACING.LOC_WIDTH}px` };
  const num_style = { width: `${COL_SPACING.NUM_WIDTH}px` };
  const sa_style = { width: `${COL_SPACING.SA_WIDTH}px` };

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
                `mx-auto pl-4 pr-2 py-2 shadow-sm ${Styles.results_header_row}` +
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
                  <div style={code_style} className={Styles.results_header}>
                    Code
                  </div>
                  {/* Course Name */}
                  <div style={title_style} className={Styles.results_header}>
                    Title
                  </div>
                  <div style={num_style} className={Styles.results_header}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={enrollment_tooltip}
                    >
                      <span className="m-auto">#</span>
                    </OverlayTrigger>
                  </div>
                  <div style={num_style} className={Styles.results_header}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={fb_tooltip}
                    >
                      <span className="m-auto">#FB</span>
                    </OverlayTrigger>
                  </div>
                  {/* Class Rating */}
                  <div style={rate_style} className={Styles.results_header}>
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 100, hide: 100 }}
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
                  <div style={rate_style} className={Styles.results_header}>
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 100, hide: 100 }}
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
                  <div style={rate_style} className={Styles.results_header}>
                    <div className="m-auto">
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 100, hide: 100 }}
                        overlay={workload_tooltip}
                      >
                        <FcReading style={{ display: 'block' }} size={20} />
                      </OverlayTrigger>
                    </div>
                  </div>
                  {/* Course Professors */}
                  {ROW_WIDTH > COL_SPACING.PROF_CUT && (
                    <div style={prof_style} className={Styles.results_header}>
                      Professors
                    </div>
                  )}
                  {/* Course Meeting times and location */}
                  {ROW_WIDTH > COL_SPACING.MEET_CUT && (
                    <div style={meet_style} className={Styles.results_header}>
                      Meets
                    </div>
                  )}
                  {ROW_WIDTH > COL_SPACING.LOC_CUT && (
                    <div style={loc_style} className={Styles.results_header}>
                      Location
                    </div>
                  )}
                  {ROW_WIDTH > COL_SPACING.SA_CUT && (
                    <div
                      style={sa_style}
                      className={Styles.results_header + ' pr-2'}
                    >
                      Skills/Areas
                    </div>
                  )}
                </React.Fragment>
              ) : (
                // Grid view showing how many search results
                <Col md={10}>
                  <strong>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </strong>
                </Col>
              )}
              {/* List Grid Toggle Button */}
              {/* <div
                style={{ width: `${COL_SPACING.BOOKMARK_WIDTH}px` }}
                className={Styles.results_header + ' pr-2'}
              >
                <div className="d-flex ml-auto my-auto p-0">
                  <ListGridToggle isList={isList} setView={setView} />
                </div>
              </div> */}
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

// SearchResults.whyDidYouRender = true;
export default SearchResults;
