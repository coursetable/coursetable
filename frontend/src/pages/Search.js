import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { GlobalHotKeys } from 'react-hotkeys';

import Styles from './Search.module.css';

import SearchResults from '../components/SearchResults';
import CourseModal from '../components/CourseModal';

import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';

import {
  sortbyOptions,
  areas,
  skills,
  skillsAreasOptions,
  colorOptionStyles,
  selectStyles,
  creditOptions,
  schoolOptions,
  subjectOptions,
} from '../queries/Constants';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { useCourseData, useFerry } from '../components/FerryProvider';

import { debounce, orderBy } from 'lodash';

import { Handle, Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import { FaSearch } from 'react-icons/fa';
import { BsX } from 'react-icons/bs';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import { Element, scroller } from 'react-scroll';
import { useUser } from '../user';
import {
  SurfaceComponent,
  StyledSelect,
  StyledInput,
  StyledHr,
  SecondaryText,
} from '../components/StyledComponents';
import styled from 'styled-components';

// Multi-Select Animations
import makeAnimated from 'react-select/animated';
import posthog from 'posthog-js';
const animatedComponents = makeAnimated();
const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.select};
  }
`;

/**
 * Renders search page
 * @prop location - dictionary that contains search value if search bar was used
 * @prop history - dictionary that is used to reset default search value
 */

function Search({ location, history }) {
  // Fetch user context data
  const { user } = useUser();
  // Is the user logged in?
  const isLoggedIn = user.worksheet !== null;

  // Fetch window dimensions
  const { height, width } = useWindowDimensions();
  let isMobile = width < 768;
  // Search on page render?
  const [defaultSearch, setDefaultSearch] = useState(true);
  // Search text for the default search if search bar was used
  const searchTextInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  // Is the search form  collapsed?
  const [collapsed_form, setCollapsedForm] = useState(false);
  // useEffect(() => {
  //   if (width < 1200 && !collapsed_form) setCollapsedForm(true);
  //   if (width > 1200 && collapsed_form) setCollapsedForm(false);
  // }, [width]);

  // State that determines if a course modal needs to be displayed and which course to display
  const [course_modal, setCourseModal] = useState([false, '']);

  // State that determines sort order
  const [sort_order, setSortOrder] = useState('asc');

  // Show the modal for the course that was clicked
  const showModal = useCallback(
    (listing) => {
      posthog.capture('course-modal-open', {
        season_code: listing.season_code,
        course_code: listing.course_code,
        crn: listing.crn,
      });

      setCourseModal([true, listing]);
    },
    [setCourseModal]
  );

  // Reset course_modal state to hide the modal
  const hideModal = () => {
    setCourseModal([false, '']);
  };

  // number of search results to return
  // const QUERY_SIZE = 30;

  // way to display results
  const [isList, setView] = useState(isMobile ? false : true);

  // react-select states for controlled forms
  const [select_sortby, setSelectSortby] = useState(sortbyOptions[0]);
  const [select_seasons, setSelectSeasons] = useState([
    { value: '202101', label: 'Spring 2021' },
  ]);
  const [select_skillsareas, setSelectSkillsAreas] = useState();
  const [select_credits, setSelectCredits] = useState();
  const [select_schools, setSelectSchools] = useState([]);
  const [select_subjects, setSelectSubjects] = useState([]);

  // Does the user want to hide cancelled courses?
  const [hideCancelled, setHideCancelled] = useState(true);
  // Does the user want to hide first year seminars?
  const [hideFirstYearSeminars, setHideFirstYearSeminars] = useState(false);

  // Bounds of course and workload ratings (1-5)
  const [ratingBounds, setRatingBounds] = useState([1, 5]);
  const [workloadBounds, setWorkloadBounds] = useState([1, 5]);

  // populate seasons from database
  var seasonsOptions;
  const { seasons: seasonsData } = useFerry();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      return {
        value: x.season_code,
        // capitalize term and add year
        label: x.term.charAt(0).toUpperCase() + x.term.slice(1) + ' ' + x.year,
      };
    });
  }

  const required_seasons = useMemo(() => {
    if (!isLoggedIn) {
      // If we're not logged in, don't attempt to request any seasons.
      return [];
    }
    if (select_seasons === null) {
      return [];
    }
    if (select_seasons.length === 0) {
      // Nothing selected, so default to all seasons.
      return seasonsData.seasons.map((x) => x.season_code).slice(0, 15);
    }
    return select_seasons.map((x) => x.value);
  }, [isLoggedIn, select_seasons, seasonsData]);

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(required_seasons);

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const multiSeasons = required_seasons.length !== 1;

  const searchConfig = useMemo(() => {
    // sorting options
    let sortParams = select_sortby.value;
    let ordering = null;
    if (sortParams === 'course_code') {
      ordering = { course_code: sort_order };
    } else if (sortParams === 'course_title') ordering = { title: sort_order };
    else if (sortParams === 'course_number') ordering = { number: sort_order };
    else if (sortParams === 'rating') ordering = { average_rating: sort_order };
    else if (sortParams === 'workload')
      ordering = { average_workload: sort_order };
    else if (sortParams === 'professor')
      ordering = { average_professor: `${sort_order}_nulls_last` };
    else if (sortParams === 'gut')
      ordering = { average_gut_rating: `${sort_order}_nulls_last` };
    else console.error('unknown sort order - ', sortParams);

    // skills and areas
    var processedSkillsAreas = select_skillsareas;
    if (processedSkillsAreas != null) {
      processedSkillsAreas = processedSkillsAreas.map((x) => {
        return x.value;
      });

      // match all languages
      if (processedSkillsAreas.includes('L')) {
        processedSkillsAreas = processedSkillsAreas.concat([
          'L1',
          'L2',
          'L3',
          'L4',
          'L5',
        ]);
      }

      // separate skills and areas
      var processedSkills = processedSkillsAreas.filter((x) =>
        skills.includes(x)
      );
      var processedAreas = processedSkillsAreas.filter((x) =>
        areas.includes(x)
      );

      // set null defaults
      if (processedSkills.length === 0) {
        processedSkills = null;
      }
      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    // credits to filter
    var processedCredits = select_credits;
    if (processedCredits != null) {
      processedCredits = processedCredits.map((x) => {
        return x.value;
      });
      // set null defaults
      if (processedCredits.length === 0) {
        processedCredits = null;
      }
    }

    // schools to filter
    var processedSchools = select_schools;
    if (processedSchools != null) {
      processedSchools = processedSchools.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSchools.length === 0) {
        processedSchools = null;
      }
    }

    // subject to filter
    var processedSubjects = select_subjects;
    if (processedSubjects != null) {
      processedSubjects = processedSubjects.map((x) => {
        return x.value;
      });

      // set null defaults
      if (processedSubjects.length === 0) {
        processedSubjects = null;
      }
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    var include_all_ratings = ratingBounds[0] === 1 && ratingBounds[1] === 5;

    var include_all_workloads =
      workloadBounds[0] === 1 && workloadBounds[1] === 5;

    // Variables to use in search query
    const search_variables = {
      search_text: searchText,
      ordering: ordering,
      // seasons: not included because it is handled by required_seasons
      areas: new Set(processedAreas),
      skills: new Set(processedSkills),
      credits: new Set(processedCredits),
      schools: new Set(processedSchools),
      subjects: new Set(processedSubjects),
      min_rating: include_all_ratings ? null : ratingBounds[0],
      max_rating: include_all_ratings ? null : ratingBounds[1],
      min_workload: include_all_workloads ? null : workloadBounds[0],
      max_workload: include_all_workloads ? null : workloadBounds[1],
      extra_info: hideCancelled ? 'ACTIVE' : null,
      fy_sem: hideFirstYearSeminars ? false : null,
    };

    // Track search
    posthog.capture('search', {
      ...search_variables,
      search_text_clean: search_variables.search_text || '[none]',
    });

    return search_variables;
  }, [
    hideCancelled,
    hideFirstYearSeminars,
    ratingBounds,
    sort_order,
    select_credits,
    select_schools,
    select_skillsareas,
    select_sortby.value,
    select_subjects,
    workloadBounds,
    searchText,
  ]);

  // TODO: debounce + make async
  const searchData = useMemo(() => {
    // Match search results with course data.
    if (coursesLoading || courseLoadError) return [];
    if (Object.keys(searchConfig).length === 0) return [];

    // Pre-processing for the search text.
    const tokens = (searchConfig.search_text || '')
      .split(/\s+/)
      .filter((x) => !!x)
      .map((token) => token.toLowerCase());

    let filtered = []
      .concat(
        ...required_seasons.map((season_code) => {
          if (!courseData[season_code]) return [];
          return [...courseData[season_code].values()];
        })
      )
      .filter((listing) => {
        // Apply filters.
        if (
          searchConfig.min_rating !== null &&
          searchConfig.max_rating !== null &&
          (listing.average_rating === null ||
            listing.average_rating < searchConfig.min_rating ||
            listing.average_rating > searchConfig.max_rating)
        ) {
          return false;
        }

        if (
          searchConfig.min_workload !== null &&
          searchConfig.max_workload !== null &&
          (listing.average_workload === null ||
            listing.average_workload < searchConfig.min_workload ||
            listing.average_workload > searchConfig.max_workload)
        ) {
          return false;
        }

        if (
          searchConfig.extra_info !== null &&
          searchConfig.extra_info !== listing.extra_info
        ) {
          return false;
        }

        if (
          searchConfig.fy_sem !== null &&
          searchConfig.fy_sem !== listing.fysem
        ) {
          return false;
        }

        if (
          searchConfig.subjects.size !== 0 &&
          !searchConfig.subjects.has(listing.subject)
        ) {
          return false;
        }

        if (
          (searchConfig.areas.size !== 0 || searchConfig.skills.size !== 0) &&
          !listing.areas.some((v) => searchConfig.areas.has(v)) &&
          !listing.skills.some((v) => searchConfig.skills.has(v))
        ) {
          return false;
        }

        if (
          searchConfig.credits.size !== 0 &&
          !searchConfig.credits.has(listing.credits)
        ) {
          return false;
        }

        if (
          searchConfig.schools.size !== 0 &&
          !searchConfig.schools.has(listing.school)
        ) {
          return false;
        }

        // Handle search text. Each token must match something.
        // TODO: fuzzy matching?
        // TODO: search across descriptions?
        for (const token of tokens) {
          if (
            listing.subject.toLowerCase().startsWith(token) ||
            listing.number.toLowerCase().startsWith(token) ||
            listing.title.toLowerCase().includes(token) ||
            listing.professor_names.some((professor) =>
              professor.toLowerCase().includes(token)
            )
          )
            continue;

          return false;
        }

        return true;
      });

    // Apply sorting order.
    // Force anything that is null to the bottom.
    // In case of ties, we fallback to the course code.
    const key = Object.keys(searchConfig.ordering)[0];
    const order_asc = searchConfig.ordering[key].startsWith('asc');
    filtered = orderBy(
      filtered,
      [
        (listing) => !!listing[key],
        (listing) => listing[key],
        (listing) => listing.course_code,
      ],
      ['desc', order_asc ? 'asc' : 'desc', 'asc']
    );

    return filtered;
  }, [
    required_seasons,
    coursesLoading,
    courseLoadError,
    courseData,
    searchConfig,
  ]);

  const handleSetView = (isList) => {
    posthog.capture('catalog-view-toggle', { isList });
    setView(isList);
  };

  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  const scroll_to_results = useCallback(
    (event) => {
      if (event) event.preventDefault();

      // Scroll down to catalog when in mobile view.
      if (isMobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [isMobile]
  );

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scroll_to_results();
      setDoneInitialScroll(true);
    }
  }, [coursesLoading, doneInitialScroll, scroll_to_results]);

  // ctrl/cmd-f search hotkey
  const focusSearch = (e) => {
    if (e && searchTextInput) {
      e.preventDefault();
      searchTextInput.current.focus();
    }
  };
  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };
  const handlers = {
    FOCUS_SEARCH: focusSearch,
  };

  // Render slider handles for the course and workload rating sliders
  const ratingSliderHandle = useCallback(({ value, dragging, ...e }) => {
    const key = e.className;
    return (
      <Handle {...e} key={key}>
        <div className={`shadow ${Styles.rating_tooltip}`}>{value}</div>
      </Handle>
    );
  }, []);
  const workloadSliderHandle = useCallback(({ value, dragging, ...e }) => {
    const key = e.className;
    return (
      <Handle {...e} key={key}>
        <div className={`shadow ${Styles.workload_tooltip}`}>{value}</div>
      </Handle>
    );
  }, []);

  // Is the search form taller than the window?
  var [tooTall, setTooTall] = React.useState(true);
  // Is the user on a touch device?
  var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  // reset the search form
  const handleResetFilters = () => {
    setHideCancelled(true);
    setHideFirstYearSeminars(false);
    setRatingBounds([1, 5]);
    setWorkloadBounds([1, 5]);
    setSelectSortby(sortbyOptions[0]);
    setSelectSeasons([{ value: '202101', label: 'Spring 2021' }]);
    setSelectSkillsAreas(null);
    setSelectCredits(null);
    setSelectSchools([]);
    setSelectSubjects([]);
    setSortOrder('asc');
  };

  // check if the search form is too tall
  // to be sticky
  var searchCol = React.useRef();
  useEffect(() => {
    var searchColHeight = searchCol.clientHeight;
    setTooTall(searchColHeight > height - 56);
  }, [setTooTall, height]);

  // perform default search on load
  useEffect(() => {
    // only execute after seasons have been loaded
    if (defaultSearch && seasonsOptions) {
      setDefaultSearch(false);
    }
  }, [seasonsOptions, defaultSearch]);

  // Switch to grid view if window width changes < 900
  useEffect(() => {
    if (width < 768 && isList === true) setView(false);
  }, [width, isList]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={Styles.search_base}>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        allowChanges={true} // required for global
        style={{ outline: 'none' }}
      />
      <Row
        className={
          'p-0 m-0 ' + (!isMobile ? 'd-flex flex-row-reverse flex-nowrap' : '')
        }
      >
        <Col
          md={3}
          className={
            (isMobile
              ? `p-3 ${Styles.search_col_mobile}`
              : `pl-0 pr-3 pt-3 ${Styles.search_col}`) +
            (!isMobile ? ' order-2' : '')
          }
        >
          <SurfaceComponent
            className={
              Styles.search_container +
              ' ' +
              // only make the filters sticky if not on mobile and
              // tall enough
              (!isTouch && !tooTall ? Styles.sticky : '')
            }
          >
            {/* Search Form */}
            <Form
              className={'px-0'}
              onSubmit={scroll_to_results}
              ref={(ref) => {
                searchCol = ref;
              }}
            >
              {!isMobile && (
                // Render buttons to hide/show the search form
                <React.Fragment>
                  <div
                    className={
                      Styles.search_tab +
                      (collapsed_form
                        ? ''
                        : ' '.concat(Styles.search_tab_hidden))
                    }
                    onClick={() => {
                      setCollapsedForm(false);
                    }}
                  >
                    <FaSearch style={{ display: 'block' }} />
                  </div>
                  <div
                    className={Styles.collapse_form_btn}
                    onClick={() => {
                      setCollapsedForm(true);
                    }}
                  >
                    <BsX style={{ display: 'block' }} size={20} />
                  </div>
                </React.Fragment>
              )}
              {/* Reset Filters Button */}
              <Row className="mx-auto pt-4 px-4">
                <small
                  className={Styles.reset_filters_btn + ' mr-auto'}
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </small>
                <small className={Styles.num_results + ' ml-auto'}>
                  <SecondaryText>
                    {coursesLoading
                      ? 'Searching ...'
                      : 'Showing ' + searchData.length + ' results'}
                  </SecondaryText>
                </small>
              </Row>
              <Row className="mx-auto pt-1 pb-2 px-4">
                <div className={Styles.search_bar}>
                  {/* Search Bar */}
                  <InputGroup className={Styles.search_input}>
                    <StyledInput
                      type="text"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      placeholder="Search by course code, title, or prof"
                      ref={searchTextInput}
                    />
                  </InputGroup>
                </div>
              </Row>

              <Row className={`mx-auto py-0 px-4 ${Styles.sort_container}`}>
                <div className={`${Styles.selector_container}`}>
                  {/* Sort By Select */}
                  <StyledSelect
                    classNamePrefix={'Select'}
                    value={select_sortby}
                    options={sortbyOptions}
                    // prevent overlap with tooltips
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    onChange={(options) => {
                      setSelectSortby(options);
                    }}
                  />
                </div>
                <StyledSortBtn
                  className={Styles.sort_btn + ' my-auto'}
                  onClick={handleSortOrder}
                >
                  {select_sortby.value === 'course_code' ||
                  select_sortby.value === 'course_title' ? (
                    // Sorting by letters
                    sort_order === 'asc' ? (
                      <FcAlphabeticalSortingAz
                        className={Styles.sort_icon}
                        size={20}
                      />
                    ) : (
                      <FcAlphabeticalSortingZa
                        className={Styles.sort_icon}
                        size={20}
                      />
                    )
                  ) : // Sorting by numbers
                  sort_order === 'asc' ? (
                    <FcNumericalSorting12
                      className={Styles.sort_icon}
                      size={20}
                    />
                  ) : (
                    <FcNumericalSorting21
                      className={Styles.sort_icon}
                      size={20}
                    />
                  )}
                </StyledSortBtn>
              </Row>
              <StyledHr />
              <Row className={`mx-auto py-0 px-4 ${Styles.multi_selects}`}>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  {seasonsOptions && (
                    // Seasons Multi-Select
                    <StyledSelect
                      classNamePrefix={'Select'}
                      isMulti
                      value={select_seasons}
                      options={seasonsOptions}
                      placeholder="Last 5 Years"
                      // prevent overlap with tooltips
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      onChange={(options) => {
                        // Set seasons state
                        setSelectSeasons(options ? options : []);
                      }}
                      components={animatedComponents}
                    />
                  )}
                </div>
                <div className={`col-md-12 p-0  ${Styles.selector_container}`}>
                  {/* Skills/Areas Multi-Select */}
                  <StyledSelect
                    classNamePrefix={'Select'}
                    isMulti
                    value={select_skillsareas}
                    options={skillsAreasOptions}
                    placeholder="All Skills/Areas"
                    // colors
                    styles={colorOptionStyles}
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(options) => {
                      setSelectSkillsAreas(options);
                    }}
                    components={animatedComponents}
                  />
                </div>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  {/* Course Credit Multi-Select */}
                  <StyledSelect
                    classNamePrefix={'Select'}
                    isMulti
                    value={select_credits}
                    options={creditOptions}
                    placeholder="All Credits"
                    // prevent overlap with tooltips
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    onChange={(options) => {
                      setSelectCredits(options);
                    }}
                    components={animatedComponents}
                  />
                </div>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  {/* Yale Subjects Multi-Select */}
                  <StyledSelect
                    classNamePrefix={'Select'}
                    isMulti
                    value={select_subjects}
                    options={subjectOptions}
                    placeholder="All Subjects"
                    isSearchable={true}
                    // prevent overlap with tooltips
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    onChange={(options) => {
                      setSelectSubjects(options ? options : []);
                    }}
                    components={animatedComponents}
                  />
                </div>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  {/* Yale Schools Multi-Select */}
                  <StyledSelect
                    classNamePrefix={'Select'}
                    isMulti
                    value={select_schools}
                    options={schoolOptions}
                    placeholder="All Schools"
                    // prevent overlap with tooltips
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    onChange={(options) => {
                      setSelectSchools(options ? options : []);
                    }}
                    components={animatedComponents}
                  />
                </div>
              </Row>
              <StyledHr />
              <Row className={`mx-auto pt-0 pb-0 px-2 ${Styles.sliders}`}>
                <Col>
                  <Container style={{ paddingTop: '1px' }}>
                    {/* Class Rating Slider */}
                    <Range
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={ratingBounds}
                      // debounce the slider state update
                      // to make it smoother
                      onChange={debounce((value) => {
                        setRatingBounds(value);
                      }, 250)}
                      handle={ratingSliderHandle}
                      className={Styles.slider}
                    />
                  </Container>
                  <div className={`text-center ${Styles.filter_title}`}>
                    Overall rating
                  </div>
                </Col>
                <Col>
                  <Container>
                    {/* Workload Rating Slider */}
                    <Range
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={workloadBounds}
                      // debounce the slider state update
                      // to make it smoother
                      onChange={debounce((value) => {
                        setWorkloadBounds(value);
                      }, 250)}
                      handle={workloadSliderHandle}
                      className={Styles.slider}
                    />
                  </Container>
                  <div className={`text-center ${Styles.filter_title}`}>
                    Workload
                  </div>
                </Col>
              </Row>
              <StyledHr className="mb-0" />
              <Row
                className={`mx-auto pt-1 px-4 justify-content-left ${Styles.light_bg}`}
              >
                {/* Hide Cancelled Courses Toggle */}
                <Form.Check type="switch" className={Styles.toggle_option}>
                  <Form.Check.Input
                    checked={hideCancelled}
                    onChange={(e) => {}} // dummy handler to remove warning
                  />
                  <Form.Check.Label
                    onClick={() => {
                      setHideCancelled(!hideCancelled);
                    }}
                  >
                    Hide cancelled courses
                  </Form.Check.Label>
                </Form.Check>
              </Row>
              <Row
                className={`mx-auto py-1 px-4 justify-content-left ${Styles.light_bg}`}
              >
                {/* Hide First-Year Seminar Courses Toggle */}
                <Form.Check type="switch" className={Styles.toggle_option}>
                  <Form.Check.Input
                    checked={hideFirstYearSeminars}
                    onChange={(e) => {}} // dummy handler to remove warning
                  />
                  <Form.Check.Label
                    onClick={() => {
                      setHideFirstYearSeminars(!hideFirstYearSeminars);
                    }}
                  >
                    Hide first-year seminars
                  </Form.Check.Label>
                </Form.Check>
              </Row>
              <div className={Styles.useless_btn}>
                {/* The form requires a button with type submit in order to process
                    events when someone hits enter to submit. We want this functionality
                    so we can scroll to the results on mobile when they hit enter,
                    and hence have a hidden button here. */}
                <Button type="submit" />
              </div>
            </Form>
          </SurfaceComponent>
        </Col>
        {/* Search Results Catalog */}

        <Col
          md={collapsed_form ? 12 : 9}
          className={
            'm-0 ' +
            (isMobile
              ? 'p-3 ' + Styles.results_col_mobile
              : (collapsed_form ? 'px-5 py-3 ' : 'px-0 py-3 ') +
                Styles.results_col)
          }
        >
          <Element name="catalog">
            <SearchResults
              data={searchData}
              isList={isList}
              setView={handleSetView}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
              showModal={showModal}
              isLoggedIn={isLoggedIn}
              expanded={collapsed_form}
            />
          </Element>
        </Col>
      </Row>
      {/* Course Modal */}
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
      />
    </div>
  );
}

export default Search;
