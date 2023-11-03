import React, { useState, useEffect, useRef, useMemo } from 'react';

import ResultsItem from './ResultsItem';
import ResultsGridItem from './ResultsGridItem';

import ListGridToggle from './ListGridToggle';

import { useWindowDimensions } from '../Providers/WindowDimensionsProvider';

import Styles from './Results.module.css';
import './Results.css';

import { Col, Row, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { List, WindowScroller, AutoSizer } from 'react-virtualized';

import NoCoursesFound from '../../images/no_courses_found.svg';
import Authentication from '../../images/authentication.svg';

import styled, { useTheme } from 'styled-components';
import { SurfaceComponent } from '../StyledComponents';

import ResultsColumnSort from './ResultsColumnSort';
import { sortbyOptions } from '../../queries/Constants';
import { useSearch } from '../../contexts/searchContext';
import { breakpoints } from '../../utilities';
import { toSeasonString } from '../../utilities/courseUtilities';

import { API_ENDPOINT } from '../../config';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Link } from 'react-router-dom';

// Space above row dropdown to hide scrolled courses
const StyledSpacer = styled.div`
  background-color: ${({ theme }) => theme.background};
  transition: background-color ${({ theme }) => theme.trans_dur};
  position: -webkit-sticky; /* Safari */
  position: sticky;
  z-index: 2;
`;

// Container of row dropdown (without spacer)
const StyledContainer = styled(SurfaceComponent)`
  border-top: 2px solid ${({ theme }) => theme.border};
  border-bottom: 2px solid ${({ theme }) => theme.border};
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
`;

// Restrict the row width
const StyledRow = styled(Row)`
  max-width: 1600px;
`;

// Column header
const ResultsHeader = styled.div`
  line-height: 30px;
  ${breakpoints('line-height', 'px', [{ 1320: 24 }])};
  display: flex;
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  font-weight: 600;
`;

// Search results
const SearchResults = styled.div`
  overflow: hidden;
  ${({ numCourses, isMobile }) =>
    numCourses > 0 && numCourses < 20 && !isMobile ? 'height: 80vh;' : ''}
`;

// Results item wrapper
const ResultsItemWrapper = styled.div`
  transition:
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
`;

// Function to calculate column width within a max and min
const getColWidth = (calculated, min = 0, max = 1000000) =>
  Math.max(Math.min(calculated, max), min);

/**
 * Renders the infinite list of search results for both catalog and worksheet
 * @prop data - array | that holds the search results
 * @prop isList - boolean | determines display format (list or grid)
 * @prop setView - function | changes display format
 * @prop loading - boolean | Is the search query finished?
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isLoggedIn - boolean | is the user logged in?
 * @prop numFb = object | holds a list of each fb friend taking a specific course
 * @prop page = string | page search results are on
 */

function Results({
  data,
  isList,
  setView,
  loading = false,
  multiSeasons = false,
  showModal,
  isLoggedIn,
  numFb,
  page = 'catalog',
}) {
  // Fetch current device
  const { width, isMobile, isTablet, isSmDesktop, isLgDesktop } =
    useWindowDimensions();

  // Show tooltip for the list/grid view toggle. NOT USING RN
  // const [show_tooltip, setShowTooltip] = useState(false);

  // State that holds width of the row for list view
  const [ROW_WIDTH, setRowWidth] = useState(0);

  // Fetch resetKey from search context
  const { resetKey } = useSearch();

  const { curSeason } = useWorksheet();

  const globalTheme = useTheme();

  // Ref to get row width
  const ref = useRef(null);
  useEffect(() => {
    // Set row width
    if (ref.current) setRowWidth(ref.current.offsetWidth);
  }, [setRowWidth, width]);

  // Spacing for each column in list view
  const COL_SPACING = useMemo(() => {
    const TEMP_COL_SPACING = {
      SZN_WIDTH: 60,
      CODE_WIDTH: isLgDesktop ? 110 : 90,
      RATE_OVERALL_WIDTH: isLgDesktop ? 92 : 82,
      RATE_WORKLOAD_WIDTH: isLgDesktop ? 92 : 82,
      RATE_PROF_WIDTH: isLgDesktop ? 40 : 36,
      ENROLL_WIDTH: 40,
      FB_WIDTH: 60,
      PADDING: 43,
    };

    const EXTRA =
      ROW_WIDTH -
      (multiSeasons ? TEMP_COL_SPACING.SZN_WIDTH : 0) -
      TEMP_COL_SPACING.CODE_WIDTH -
      TEMP_COL_SPACING.ENROLL_WIDTH -
      TEMP_COL_SPACING.FB_WIDTH -
      TEMP_COL_SPACING.RATE_OVERALL_WIDTH -
      TEMP_COL_SPACING.RATE_WORKLOAD_WIDTH -
      TEMP_COL_SPACING.RATE_PROF_WIDTH -
      TEMP_COL_SPACING.PADDING;

    TEMP_COL_SPACING.PROF_WIDTH =
      getColWidth(EXTRA / 7, undefined, undefined) +
      TEMP_COL_SPACING.RATE_PROF_WIDTH;
    TEMP_COL_SPACING.SA_WIDTH = getColWidth(EXTRA / 8, 40, 126);
    TEMP_COL_SPACING.MEET_WIDTH = getColWidth(EXTRA / 6, 60, 170);
    TEMP_COL_SPACING.LOC_WIDTH = getColWidth(EXTRA / 13, 30, undefined);
    TEMP_COL_SPACING.TITLE_WIDTH =
      EXTRA -
      TEMP_COL_SPACING.PROF_WIDTH -
      TEMP_COL_SPACING.SA_WIDTH -
      TEMP_COL_SPACING.MEET_WIDTH -
      TEMP_COL_SPACING.LOC_WIDTH -
      10;

    return TEMP_COL_SPACING;
  }, [ROW_WIDTH, multiSeasons, isLgDesktop]);

  // Holds HTML for the search results
  let resultsListing;

  // Number of columns to use in grid view
  const numCols = isMobile ? 1 : isTablet ? 2 : 3;

  if (!isLoggedIn) {
    // render an auth wall
    resultsListing = (
      <div className="text-center py-5">
        <img
          alt="Not logged in"
          className="py-5"
          src={Authentication}
          style={{ width: '25%' }}
        />
        <h3>
          Please{' '}
          <a
            href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/worksheet`}
          >
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
        />
        {page === 'catalog' ? (
          <>
            <h3>No courses found</h3>
            <div>We couldn't find any courses matching your search.</div>
          </>
        ) : (
          <>
            <h3>
              No courses found for{' '}
              {toSeasonString(curSeason).slice(1, 3).reverse().join(' ')}
            </h3>
            <div>
              Add some courses on the <Link to="/catalog">Catalog</Link>.
            </div>
          </>
        )}
      </div>
    );
  } else if (!isList) {
    // if not list view, prepare the grid
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
                rowCount={Math.ceil(data.length / numCols)}
                rowHeight={178}
                rowRenderer={({ index, key, style }) => {
                  const rowElements = [];
                  for (
                    let j = index * numCols;
                    j < data.length && j < (index + 1) * numCols;
                    j++
                  ) {
                    rowElements.push(
                      <ResultsGridItem
                        course={data[j]}
                        showModal={showModal}
                        isLoggedIn={isLoggedIn}
                        numCols={numCols}
                        multiSeasons={multiSeasons}
                        key={j}
                      />,
                    );
                  }

                  return (
                    <div key={key} style={style}>
                      <StyledRow className="mx-auto">{rowElements}</StyledRow>
                    </div>
                  );
                }}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  } else {
    // Store HTML for list view results
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
                rowHeight={isLgDesktop ? 32 : 28}
                rowRenderer={({ index, key, style, isScrolling }) => {
                  const fbFriends = numFb[
                    data[index].season_code + data[index].crn
                  ]
                    ? numFb[data[index].season_code + data[index].crn]
                    : [];
                  // Alternating row item background colors
                  const colorStyles =
                    index % 2 === 0
                      ? { backgroundColor: globalTheme.surface[0] }
                      : { backgroundColor: globalTheme.row_odd };
                  return (
                    <ResultsItemWrapper
                      style={{
                        ...style,
                        ...colorStyles,
                      }}
                      key={key}
                    >
                      <ResultsItem
                        course={data[index]}
                        showModal={showModal}
                        multiSeasons={multiSeasons}
                        isFirst={index === 0}
                        COL_SPACING={COL_SPACING}
                        isScrolling={isScrolling}
                        fbFriends={fbFriends}
                      />
                    </ResultsItemWrapper>
                  );
                }}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  const navbarHeight = useMemo(() => {
    if (page === 'catalog') {
      if (isSmDesktop || isTablet) {
        return 88;
      }
      if (isLgDesktop) {
        return 100;
      }
    }
    if (page === 'worksheet') {
      if (isSmDesktop || isTablet) {
        return 58;
      }
      if (isLgDesktop) {
        return 61;
      }
    }
    return 0;
  }, [page, isTablet, isSmDesktop, isLgDesktop]);

  return (
    <div className={Styles.results_container_max_width}>
      {!isMobile && isLoggedIn && (
        <StyledSpacer
          style={{ top: navbarHeight }}
          isCatalog={page === 'catalog'}
        >
          <StyledContainer
            layer={0}
            id="results_container"
            className="px-0 mx-0"
          >
            {/* Column Headers */}
            <StyledRow
              ref={ref}
              className={`mx-auto pl-4 pr-2 ${isLgDesktop ? 'py-2' : 'py-1'} ${
                Styles.results_header_row
              } justify-content-between`}
              data-tutorial="catalog-5"
            >
              {/* View Toggle */}
              <div
                className={`${Styles.list_grid_toggle} d-flex ml-auto my-auto p-0`}
              >
                <ListGridToggle isList={isList} setView={setView} />
              </div>
              {isList ? (
                <>
                  {multiSeasons && (
                    <ResultsHeader
                      style={{
                        width: `${COL_SPACING.SZN_WIDTH}px`,
                        paddingLeft: '15px',
                      }}
                    >
                      Season
                    </ResultsHeader>
                  )}
                  {/* Course Code */}
                  <ResultsHeader
                    style={{
                      width: `${COL_SPACING.CODE_WIDTH}px`,
                      paddingLeft: !multiSeasons ? '15px' : '0px',
                    }}
                  >
                    <OverlayTrigger
                      placement="bottom"
                      overlay={(props) => (
                        <Tooltip id="button-tooltip" {...props}>
                          <span>
                            Course Code <br />
                            and Section
                          </span>
                        </Tooltip>
                      )}
                    >
                      <span className={Styles.one_line}>Code</span>
                    </OverlayTrigger>
                    <ResultsColumnSort
                      selectOption={sortbyOptions[0]}
                      key={resetKey}
                    />
                  </ResultsHeader>
                  {/* Course Name */}
                  <ResultsHeader
                    style={{ width: `${COL_SPACING.TITLE_WIDTH}px` }}
                  >
                    <span className={Styles.one_line}>Title</span>
                    <ResultsColumnSort
                      selectOption={sortbyOptions[2]}
                      key={resetKey}
                    />
                  </ResultsHeader>
                  <div className="d-flex">
                    {/* Overall Rating */}
                    <ResultsHeader
                      style={{
                        whiteSpace: 'nowrap',
                        width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
                      }}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={(props) => (
                          <Tooltip id="button-tooltip" {...props}>
                            <span>
                              Average Course Rating
                              <br />
                              (same professor and all cross-listed courses. If
                              this professor hasn't taught the course before, a
                              ~ denotes an average across all professors)
                            </span>
                          </Tooltip>
                        )}
                      >
                        <span className={Styles.one_line}>Overall</span>
                      </OverlayTrigger>
                      <ResultsColumnSort
                        selectOption={sortbyOptions[4]}
                        key={resetKey}
                      />
                    </ResultsHeader>
                    {/* Workload Rating */}
                    <ResultsHeader
                      style={{
                        whiteSpace: 'nowrap',
                        width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
                      }}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={(props) => (
                          <Tooltip id="button-tooltip" {...props}>
                            <span>
                              Average Workload Rating <br />
                              (same professor and all cross-listed courses. If
                              this professor hasn't taught the course before, a
                              ~ denotes an average across all professors)
                            </span>
                          </Tooltip>
                        )}
                      >
                        <span className={Styles.one_line}>Work</span>
                      </OverlayTrigger>
                      <ResultsColumnSort
                        selectOption={sortbyOptions[6]}
                        key={resetKey}
                      />
                    </ResultsHeader>
                    {/* Professor Rating & Course Professors */}
                    <ResultsHeader
                      style={{ width: `${COL_SPACING.PROF_WIDTH}px` }}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={(props) => (
                          <Tooltip id="button-tooltip" {...props}>
                            <span>
                              Average Professor Rating <br />
                              and Names <br />
                              (if there are multiple professors, we take the
                              average between them)
                            </span>
                          </Tooltip>
                        )}
                      >
                        <span className={Styles.one_line}>Professors</span>
                      </OverlayTrigger>
                      <ResultsColumnSort
                        selectOption={sortbyOptions[5]}
                        key={resetKey}
                      />
                    </ResultsHeader>
                  </div>
                  {/* Previous Enrollment Number */}
                  <ResultsHeader
                    style={{ width: `${COL_SPACING.ENROLL_WIDTH}px` }}
                  >
                    <OverlayTrigger
                      placement="bottom"
                      overlay={(props) => (
                        <Tooltip id="button-tooltip" {...props}>
                          {multiSeasons ? (
                            <span>
                              Class Enrollment
                              <br />
                              (If the course has not occurred/completed, based
                              on the most recent past instance of this course. a
                              ~ means a different professor was teaching)
                            </span>
                          ) : (
                            <span>
                              Previous Class Enrollment
                              <br />
                              (based on the most recent past instance of this
                              course. a ~ means a different professor was
                              teaching)
                            </span>
                          )}
                        </Tooltip>
                      )}
                    >
                      <span className={Styles.one_line}>#</span>
                    </OverlayTrigger>
                    <ResultsColumnSort
                      selectOption={sortbyOptions[8]}
                      key={resetKey}
                    />
                  </ResultsHeader>
                  {/* Skills/Areas */}
                  <ResultsHeader style={{ width: `${COL_SPACING.SA_WIDTH}px` }}>
                    <span className={Styles.one_line}>Skills/Areas</span>
                  </ResultsHeader>
                  {/* Course Meeting Days & Times */}
                  <ResultsHeader
                    style={{ width: `${COL_SPACING.MEET_WIDTH}px` }}
                  >
                    <OverlayTrigger
                      placement="bottom"
                      overlay={(props) => (
                        <Tooltip id="button-tooltip" {...props}>
                          <span>
                            Days of the Week <br />
                            and Times <br />
                            (sort order based on day and starting time)
                          </span>
                        </Tooltip>
                      )}
                    >
                      <span className={Styles.one_line}>Meets</span>
                    </OverlayTrigger>
                    <ResultsColumnSort
                      selectOption={sortbyOptions[9]}
                      key={resetKey}
                    />
                  </ResultsHeader>
                  {/* Location */}
                  <ResultsHeader
                    style={{ width: `${COL_SPACING.LOC_WIDTH}px` }}
                  >
                    <span className={Styles.one_line}>Location</span>
                  </ResultsHeader>
                  {/* FB */}
                  <ResultsHeader style={{ width: `${COL_SPACING.FB_WIDTH}px` }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={(props) => (
                        <Tooltip id="button-tooltip" {...props}>
                          <span>
                            Number of Facebook friends shopping this course
                          </span>
                        </Tooltip>
                      )}
                    >
                      <span className={Styles.one_line}>#FB</span>
                    </OverlayTrigger>
                    <ResultsColumnSort
                      selectOption={sortbyOptions[3]}
                      key={resetKey}
                    />
                  </ResultsHeader>
                </>
              ) : (
                // Showing how many search results for grid view
                <Col md={10}>
                  <ResultsHeader>
                    {`Showing ${data.length} course${
                      data.length === 1 ? '' : 's'
                    }...`}
                  </ResultsHeader>
                </Col>
              )}
            </StyledRow>
          </StyledContainer>
        </StyledSpacer>
      )}

      <SearchResults
        layer={0}
        className={`${!isList ? 'px-1 pt-3 ' : ''}`}
        numCourses={data.length}
        isMobile={isMobile}
      >
        {/* If there are search results, render them */}
        {data.length !== 0 && resultsListing}
        {/* If there are no search results, we are not logged in, and not loading, then render the empty state */}
        {data.length === 0 && !loading && resultsListing}
        {/* Render a loading row while performing next query */}
        {loading && (
          <Row className={`m-auto ${data.length === 0 ? 'py-5' : 'pt-0 pb-4'}`}>
            <Spinner className="m-auto" animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Row>
        )}
      </SearchResults>
    </div>
  );
}

// Search.whyDidYouRender = true;
export default Results;
