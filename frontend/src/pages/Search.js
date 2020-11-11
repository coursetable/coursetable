import React, { useState, useEffect, useCallback } from 'react';

import { GlobalHotKeys } from 'react-hotkeys';

import Styles from './Search.module.css';

import SearchResults from '../components/SearchResults';
import CourseModal from '../components/CourseModal';

import {
  Col,
  Container,
  Row,
  Form,
  FormControl,
  InputGroup,
  Button,
} from 'react-bootstrap';

import { SEARCH_COURSES } from '../queries/QueryStrings';

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

import { useLazyQuery } from '@apollo/react-hooks';

import Select from 'react-select';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { useSeasons } from '../components/SeasonsProvider';

import { debounce } from 'lodash';

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
import { flatten, preprocess_courses } from '../utilities';
import { Element, scroller } from 'react-scroll';
import { useUser } from '../user';

// Multi-Select Animations
import makeAnimated from 'react-select/animated';
import posthog from 'posthog-js';
const animatedComponents = makeAnimated();

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
  var searchText = React.useRef(
    location && location.state ? location.state.search_val : null
  );
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

  // States involved in infinite scroll
  const [searched, setSearched] = useState(false); // Reset row height cache on search

  // number of search results to return
  // const QUERY_SIZE = 30;

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const [multiSeasons, setMultiSeasons] = useState(false);

  //State used to rebuild form DOM to reset it
  const [form_key, setFormKey] = useState(0);

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
  const seasonsData = useSeasons();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      return {
        value: x.season_code,
        // capitalize term and add year
        label: x.term.charAt(0).toUpperCase() + x.term.slice(1) + ' ' + x.year,
      };
    });
  }

  // handler for executing search with text
  var [
    executeSearch,
    { called: searchCalled, loading: searchLoading, data: searchData },
  ] = useLazyQuery(SEARCH_COURSES);

  const handleChange = () => {
    if (!location.state) return;
    // reset searchText
    history.replace();
  };

  // resubmit search on view change
  const handleSetView = (isList) => {
    posthog.capture('catalog-view-toggle', { isList });

    setView(isList);
    handleSubmit(null, true);
  };

  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  // search form submit handler
  const handleSubmit = useCallback(
    (event, search = false) => {
      if (event && search) event.preventDefault();
      if (search) {
        //Reset states when making a new search
        setSearched(true);
      }

      // sorting options
      var sortParams = select_sortby.value;
      var ordering = null;
      if (sortParams === 'course_code') {
        if (sort_order === 'desc') ordering = { course_code: 'desc' };
      } else if (sortParams === 'course_title')
        ordering = { title: sort_order };
      else if (sortParams === 'course_number')
        ordering = { number: sort_order };
      else if (sortParams === 'rating')
        ordering = { average_rating: sort_order };
      else if (sortParams === 'workload')
        ordering = { average_workload: sort_order };
      else if (sortParams === 'professor')
        ordering = { average_professor: `${sort_order}_nulls_last` };
      else if (sortParams === 'gut')
        ordering = { average_gut_rating: `${sort_order}_nulls_last` };
      else console.error('unknown sort order - ', sortParams);

      // seasons to filter
      var processedSeasons = select_seasons;

      // whether or not multiple seasons are being returned
      const temp_multiSeasons = processedSeasons
        ? processedSeasons.length !== 1
        : true;
      if (temp_multiSeasons !== multiSeasons)
        setMultiSeasons(temp_multiSeasons);

      if (processedSeasons != null) {
        processedSeasons = processedSeasons.map((x) => {
          return x.value;
        });
        // set null defaults
        if (processedSeasons.length === 0) {
          processedSeasons = null;
        }
      }

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

      // override when we want to sort
      if (ordering && ordering.average_rating) {
        include_all_ratings = false;
      }
      if (ordering && ordering.average_workload) {
        include_all_workloads = false;
      }

      // Variables to use in search query
      const search_variables = {
        search_text: searchText.value,
        ordering: ordering,
        seasons: processedSeasons,
        areas: processedAreas,
        skills: processedSkills,
        credits: processedCredits,
        schools: processedSchools,
        subjects: processedSubjects,
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

      // Execute search query
      executeSearch({
        variables: search_variables,
      });
    }
    // [
    //   executeSearch,
    //   hideCancelled,
    //   multiSeasons,
    //   ratingBounds,
    //   sort_order,
    //   select_credits,
    //   select_schools,
    //   select_seasons,
    //   select_skillsareas,
    //   select_sortby.value,
    //   select_subjects,
    //   workloadBounds,
    // ]
  );

  // If the search query was called
  if (searchCalled) {
    // If the search query is still loading
    if (searchLoading) {
    } else if (searchData) {
      // Scroll down to catalog when search is complete for mobile view
      if (isMobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
      // Preprocess search data
      searchData = searchData.search_listing_info.map((x) => {
        return flatten(x);
      });
      searchData = searchData.map((x) => {
        return preprocess_courses(x);
      });
    }
  }

  // ctrl/cmd-f search hotkey
  const focusSearch = (e) => {
    if (e && searchText) {
      e.preventDefault();
      searchText.focus();
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
    setFormKey(form_key + 1);
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
      handleSubmit(null, true);
      setDefaultSearch(false);
    }
  }, [seasonsOptions, defaultSearch, handleSubmit]);

  // Switch to grid view if window width changes < 900
  useEffect(() => {
    if (width < 768 && isList === true) setView(false);
  }, [width, isList]);

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
          md={4}
          lg={4}
          xl={3}
          className={
            (isMobile
              ? `p-3 ${Styles.search_col_mobile}`
              : `pr-0 my-3 pl-3 ${Styles.search_col}`) +
            (!isMobile ? ' order-2' : '')
          }
        >
          <div
            className={
              // only make the filters sticky if not on mobile and
              // tall enough
              !isTouch && !tooTall ? Styles.sticky : ''
            }
          >
            {/* Search Form */}
            <Form
              className={`px-0 ${Styles.search_container}`}
              onSubmit={(event) => {
                handleSubmit(event, true);
              }}
              ref={(ref) => {
                searchCol = ref;
              }}
              key={form_key}
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
              <Row className="pt-3 px-4">
                <small
                  className={Styles.reset_filters_btn + ' mx-auto'}
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </small>
              </Row>
              <Row className="mx-auto pt-2 px-4 pb-2">
                <div className={Styles.search_bar}>
                  {/* Search Bar */}
                  <InputGroup className={Styles.search_input}>
                    <FormControl
                      type="text"
                      defaultValue={
                        searchText.current !== ''
                          ? searchText.current
                          : undefined
                      }
                      onChange={handleChange}
                      placeholder="Search by course code, title, or prof"
                      ref={(ref) => (searchText = ref)}
                    />
                  </InputGroup>
                </div>
              </Row>
              <Row className={`mx-auto py-0 px-4 ${Styles.sort_container}`}>
                <div className={`${Styles.selector_container}`}>
                  {/* Sort By Multi-Select */}
                  <Select
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
                <div
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
                </div>
              </Row>
              <hr />
              <Row className={`mx-auto py-0 px-4 ${Styles.multi_selects}`}>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  <div className={Styles.filter_title}>Semesters</div>
                  {seasonsOptions && (
                    // Seasons Multi-Select
                    <Select
                      isMulti
                      value={select_seasons}
                      options={seasonsOptions}
                      placeholder="All"
                      // prevent overlap with tooltips
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      onChange={(options) => {
                        // Set seasons state
                        setSelectSeasons(options);
                      }}
                      components={animatedComponents}
                    />
                  )}
                </div>
                <div className={`col-md-12 p-0  ${Styles.selector_container}`}>
                  <div className={Styles.filter_title}>Skills and areas</div>
                  {/* Skills/Areas Multi-Select */}
                  <Select
                    isMulti
                    value={select_skillsareas}
                    options={skillsAreasOptions}
                    placeholder="Any"
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
                  <div className={Styles.filter_title}>Credits</div>
                  {/* Course Credit Multi-Select */}
                  <Select
                    isMulti
                    value={select_credits}
                    options={creditOptions}
                    placeholder="Any"
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
                  <div className={Styles.filter_title}>Subjects</div>
                  {/* Yale Subjects Multi-Select */}
                  <Select
                    isMulti
                    value={select_subjects}
                    options={subjectOptions}
                    placeholder="Any"
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
                  <div className={Styles.filter_title}>Schools</div>
                  {/* Yale Schools Multi-Select */}
                  <Select
                    isMulti
                    value={select_schools}
                    options={schoolOptions}
                    placeholder="Any"
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
              <hr />
              <Row className={`mx-auto pt-0 pb-2 px-2 ${Styles.sliders}`}>
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
              <Row className="mx-auto flex-row-reverse">
                {/* Submit Button */}
                <Button
                  type="submit"
                  className={'pull-right ' + Styles.secondary_submit}
                >
                  Search courses
                </Button>
              </Row>
            </Form>
          </div>
        </Col>
        {/* Search Results Catalog */}

        <Col
          md={collapsed_form ? 12 : 8}
          lg={collapsed_form ? 12 : 8}
          xl={collapsed_form ? 12 : 9}
          className={
            'm-0 ' +
            (isMobile
              ? 'p-3 ' + Styles.results_col_mobile
              : (collapsed_form ? 'px-5 pt-3 ' : 'p-3 ') + Styles.results_col)
          }
        >
          <Element name="catalog">
            <SearchResults
              data={searchData ? searchData : []}
              isList={isList}
              setView={handleSetView}
              loading={searchLoading}
              multiSeasons={multiSeasons}
              searched={searched}
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
