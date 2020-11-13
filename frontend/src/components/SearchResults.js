import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';

import SearchResultsItemMemo from './SearchResultsItem';
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
import { List, WindowScroller, AutoSizer } from 'react-virtualized';

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
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isLoggedIn - boolean | is the user logged in?
 */

const SearchResults = ({
  data,
  isList,
  setView,
  loading = false,
  multiSeasons = false,
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

  // State that holds width of the row for list view
  const [ROW_WIDTH, setRowWidth] = useState(0);
  // Ref to get row width
  const ref = useRef(null);
  useEffect(() => {
    // Set row width
    if (ref.current) setRowWidth(ref.current.offsetWidth);
  }, [setRowWidth, width, expanded]);

  // Spacing for each column in list view
  let COL_SPACING = {
    SZN_WIDTH: 80,
    CODE_WIDTH: 110,
    RATE_WIDTH: 30,
    NUM_WIDTH: 30,
    SA_WIDTH: 100,
    PADDING: 35,
  };
  const EXTRA = useMemo(() => {
    return (
      ROW_WIDTH -
      (multiSeasons ? COL_SPACING.SZN_WIDTH : 0) -
      COL_SPACING.CODE_WIDTH -
      2 * COL_SPACING.NUM_WIDTH -
      COL_SPACING.SA_WIDTH -
      3 * COL_SPACING.RATE_WIDTH -
      COL_SPACING.PADDING
    );
  }, [COL_SPACING, ROW_WIDTH, multiSeasons]);

  COL_SPACING.PROF_WIDTH = Math.min(EXTRA / 4, 160);
  COL_SPACING.MEET_WIDTH = Math.min(EXTRA / 4, 160);
  COL_SPACING.LOC_WIDTH = Math.min(EXTRA / 6, 100);
  COL_SPACING.TITLE_WIDTH =
    EXTRA -
    COL_SPACING.PROF_WIDTH -
    COL_SPACING.MEET_WIDTH -
    COL_SPACING.LOC_WIDTH;
  // Holds HTML for the search results
  let resultsListing;

  // Number of columns to use in grid view
  const num_cols = width < 1100 ? (width < 768 ? 1 : 2) : 3;

  // Render functions for React Virtualized List:
  const renderGridRow = useCallback(
    ({ index, key, style }) => {
      let row_elements = [];
      for (
        let j = index * num_cols;
        j < data.length && j < (index + 1) * num_cols;
        j++
      ) {
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

      return (
        <div key={key} style={style}>
          <Row className="mx-auto">{row_elements}</Row>
        </div>
      );
    },
    [data, showModal, isLoggedIn, multiSeasons, num_cols]
  );

  const renderListRow = useCallback(
    ({ index, key, style, isScrolling }) => {
      return (
        <div style={style} key={key}>
          <SearchResultsItemMemo
            course={data[index]}
            showModal={showModal}
            multiSeasons={multiSeasons}
            isLast={index === data.length - 1}
            COL_SPACING={COL_SPACING}
            ROW_WIDTH={ROW_WIDTH}
            isScrolling={isScrolling}
            expanded={expanded}
          />
        </div>
      );
    },
    [data, showModal, multiSeasons, expanded, COL_SPACING, ROW_WIDTH]
  );

  if (!isLoggedIn) {
    // render an auth wall
    resultsListing = (
      <div className="text-center py-5">
        <img
          alt="Not logged in"
          className="py-5"
          src={Authentication}
          style={{ width: '25%' }}
        ></img>
        <h3>
          Please{' '}
          <a href="/legacy_api/index.php?forcelogin=1&successurl=catalog">
            log in
          </a>
        </h3>
        <div>A valid Yale NetID is required to access course information.</div>
      </div>
    );
  } else if (data.length === 0) {
    // if no courses found, render the empty state
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
      // Store HTML for grid view results
      resultsListing = (
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
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  rowCount={Math.ceil(data.length / num_cols)}
                  rowHeight={178}
                  rowRenderer={renderGridRow}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      );
    }

    // Store HTML for list view results
    else {
      resultsListing = (
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
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  rowCount={data.length}
                  rowHeight={32}
                  rowRenderer={renderListRow}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      );
    }
  }

  // Tooltip for hovering over class rating
  const class_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>
          Average Course Rating <br />
          (any professor and all cross-listed courses)
        </span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over professor rating
  const prof_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>Average Professor Rating</span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over workload rating
  const workload_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>
          Average Workload Rating <br />
          (any professor and all cross-listed courses)
        </span>
      </Tooltip>
    ),
    []
  );

  // Tooltip for hovering over enrollment
  const enrollment_tooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        <span>
          Class Enrollment
          <br />
          (based on the most recent instance of this course. a ~ means a
          different professor was teaching)
        </span>
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
  const szn_style = {
    width: `${COL_SPACING.SZN_WIDTH}px`,
    paddingLeft: '15px',
  };
  const code_style = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: !multiSeasons ? '15px' : '0px',
  };
  const title_style = { width: `${COL_SPACING.TITLE_WIDTH}px` };
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
        className={`px-0 ${Styles.results_container} ${
          expanded ? Styles.results_container_max_width : ''
        }`}
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
              <div
                className={
                  Styles.list_grid_toggle + ' d-flex ml-auto my-auto p-0'
                }
              >
                <ListGridToggle isList={isList} setView={setView} />
              </div>
              {isList ? (
                <React.Fragment>
                  {multiSeasons && (
                    <div style={szn_style} className={Styles.results_header}>
                      Season
                    </div>
                  )}
                  <div style={code_style} className={Styles.results_header}>
                    Code
                  </div>
                  {/* Course Name */}
                  <div
                    style={title_style}
                    className={Styles.results_header + ' ' + Styles.one_line}
                  >
                    Title
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
                  <div style={num_style} className={Styles.results_header}>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 100, hide: 100 }}
                      overlay={enrollment_tooltip}
                    >
                      <span className="m-auto">#</span>
                    </OverlayTrigger>
                  </div>
                  {/* Course Professors */}
                  <div
                    style={prof_style}
                    className={Styles.results_header + ' ' + Styles.one_line}
                  >
                    Professors
                  </div>
                  {/* Course Meeting times and location */}
                  <div
                    style={meet_style}
                    className={Styles.results_header + ' ' + Styles.one_line}
                  >
                    Meets
                  </div>
                  <div
                    style={loc_style}
                    className={Styles.results_header + ' ' + Styles.one_line}
                  >
                    Location
                  </div>

                  <div style={sa_style} className={Styles.results_header}>
                    Skills/Areas
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
                </React.Fragment>
              ) : (
                // Grid view showing how many search results
                <Col md={10}>
                  <div className={Styles.results_header}>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
        <div className={!isList ? 'px-1 pt-3' : Styles.results_list_container}>
          {/* If there are search results, render them */}
          {data.length !== 0 && resultsListing}
          {/* If there are no search results, we are not logged in, and not loading, then render the empty state */}
          {data.length === 0 && !loading && resultsListing}
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
