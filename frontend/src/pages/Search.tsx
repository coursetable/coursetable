import React, { useState, useEffect, useCallback } from 'react';

import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import { Element, scroller } from 'react-scroll';
import posthog from 'posthog-js';
import Styles from './Search.module.css';

import CatalogResults from '../components/CatalogResults';
import CourseModal from '../components/CourseModal';

import {
  skillsAreasOptions,
  // creditOptions,
  schoolOptions,
  subjectOptions,
} from '../queries/Constants';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import CustomSelect from '../components/CustomSelect';
import SortByReactSelect from '../components/SortByReactSelect';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import {
  SurfaceComponent,
  StyledInput,
  StyledHr,
  TextComponent,
} from '../components/StyledComponents';

import { useSessionStorageState } from '../browserStorage';
import { useSearch, Option } from '../searchContext';
import { ValueType } from 'react-select/src/types';

/**
 * Renders search page
 * @prop location - dictionary that contains search value if search bar was used
 * @prop history - dictionary that is used to reset default search value
 */

const Search: React.FC = () => {
  // Fetch window dimensions
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = !isMobile && width < 1200;

  // State that determines if a course modal needs to be displayed and which course to display
  const [course_modal, setCourseModal] = useState([false, '']);

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
  const [isList, setView] = useSessionStorageState(
    'isList',
    !isMobile && !isTablet
  );

  // Get search context data
  const {
    searchText,
    select_subjects,
    select_skillsareas,
    overallBounds,
    workloadBounds,
    select_seasons,
    select_schools,
    // select_credits,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    seasonsOptions,
    coursesLoading,
    searchData,
    multiSeasons,
    reset_key,
    isLoggedIn,
    num_fb,
    setSearchText,
    setSelectSubjects,
    setSelectSkillsAreas,
    setOverallBounds,
    setOverallValueLabels,
    setWorkloadBounds,
    setWorkloadValueLabels,
    setSelectSeasons,
    setSelectSchools,
    // setSelectCredits,
    setHideCancelled,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setOrdering,
    handleResetFilters,
  } = useSearch();

  const handleSetView = useCallback(
    (isList) => {
      posthog.capture('catalog-view-toggle', { isList });
      setView(isList);
    },
    [setView]
  );

  const scroll_to_results = useCallback(
    (event) => {
      if (event) event.preventDefault();

      // Scroll down to catalog when in mobile view.
      if (isMobile || isTablet) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [isMobile, isTablet]
  );

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scroll_to_results(null);
      setDoneInitialScroll(true);
    }
  }, [coursesLoading, doneInitialScroll, scroll_to_results]);

  // Render slider handles for the course and workload rating sliders
  const overallSliderHandle = useCallback(({ value, dragging, ...e }) => {
    const key = e.className;
    return (
      <Handle {...e} key={key}>
        <div className={`shadow ${Styles.overall_tooltip}`}>{value}</div>
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

  // Switch to grid view if mobile or tablet
  useEffect(() => {
    if ((isMobile || isTablet) && isList === true) {
      setView(false);
    }
  }, [isMobile, isTablet, isList, setView]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={Styles.search_base}>
      <Row
        className={`p-0 m-0 ${
          !isMobile && !isTablet ? 'd-flex flex-row-reverse flex-nowrap' : ''
        }`}
      >
        {/* Search Form */}
        {(isMobile || isTablet) && (
          <Col className={`p-3 ${Styles.search_col_mobile}`}>
            <SurfaceComponent
              layer={0}
              className={`ml-1 ${Styles.search_container}`}
            >
              <Form className="px-0" onSubmit={scroll_to_results}>
                {/* Reset Filters Button */}
                <Row className="mx-auto pt-4 px-4">
                  <small
                    className={`${Styles.reset_filters_btn} mr-auto`}
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </small>
                  <small className={`${Styles.num_results} ml-auto`}>
                    <TextComponent type={2}>
                      {coursesLoading
                        ? 'Searching ...'
                        : `Showing ${searchData.length} results`}
                    </TextComponent>
                  </small>
                </Row>
                <Row className="mx-auto pt-1 pb-2 px-4">
                  <div className={Styles.search_bar}>
                    {/* Search Bar */}
                    <InputGroup className={Styles.search_input}>
                      <StyledInput
                        type="text"
                        value={searchText}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setSearchText(event.target.value)}
                        placeholder="Search by course code, title, or prof"
                      />
                    </InputGroup>
                  </div>
                </Row>

                <Row className="mx-auto py-0 px-4">
                  <SortByReactSelect
                    setOrdering={setOrdering}
                    key={reset_key}
                  />
                </Row>
                <StyledHr />
                <Row className={`mx-auto py-0 px-4 ${Styles.multi_selects}`}>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                    {seasonsOptions && (
                      // Seasons Multi-Select
                      <CustomSelect
                        isMulti
                        value={select_seasons}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        // prevent overlap with tooltips
                        menuPortalTarget={document.body}
                        onChange={(selectedOption: ValueType<Option>) =>
                          setSelectSeasons((selectedOption as Option[]) || [])
                        }
                      />
                    )}
                  </div>
                  <div
                    className={`col-md-12 p-0  ${Styles.selector_container}`}
                  >
                    {/* Skills/Areas Multi-Select */}
                    <CustomSelect
                      isMulti
                      value={select_skillsareas}
                      options={skillsAreasOptions}
                      placeholder="All Skills/Areas"
                      // colors
                      useColors
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption: ValueType<Option>) =>
                        setSelectSkillsAreas((selectedOption as Option[]) || [])
                      }
                    />
                  </div>
                  {/* <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                  Course Credit Multi-Select
                  <CustomSelect
                    isMulti
                    value={select_credits}
                    options={creditOptions}
                    placeholder="All Credits"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(selectedOption: ValueType<Option>) => {
                      setSelectCredits((selectedOption as Option[]) || []);
                    }}
                  />
                </div> */}
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                    {/* Yale Subjects Multi-Select */}
                    <CustomSelect
                      isMulti
                      value={select_subjects}
                      options={subjectOptions}
                      placeholder="All Subjects"
                      isSearchable
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption: ValueType<Option>) =>
                        setSelectSubjects((selectedOption as Option[]) || [])
                      }
                    />
                  </div>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                    {/* Yale Schools Multi-Select */}
                    <CustomSelect
                      isMulti
                      value={select_schools}
                      options={schoolOptions}
                      placeholder="All Schools"
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption: ValueType<Option>) => {
                        setSelectSchools((selectedOption as Option[]) || []);
                      }}
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
                        key={reset_key}
                        defaultValue={overallBounds}
                        onChange={(value) => {
                          setOverallValueLabels(value);
                        }}
                        onAfterChange={(value) => {
                          setOverallBounds(value);
                        }}
                        handle={overallSliderHandle}
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
                        key={reset_key}
                        defaultValue={workloadBounds}
                        onChange={(value) => {
                          setWorkloadValueLabels(value);
                        }}
                        onAfterChange={(value) => {
                          setWorkloadBounds(value);
                        }}
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
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        setHideCancelled(!hideCancelled);
                      }}
                    >
                      Hide cancelled courses
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Form.Check type="switch" className={Styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideFirstYearSeminars}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        setHideFirstYearSeminars(!hideFirstYearSeminars);
                      }}
                    >
                      Hide first-year seminars
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide Graduate-Level Courses Toggle */}
                  <Form.Check type="switch" className={Styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideGraduateCourses}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        setHideGraduateCourses(!hideGraduateCourses);
                      }}
                    >
                      Hide graduate courses
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
        )}

        {/* Search Results Catalog */}
        <Col
          md={12}
          className={`m-0 ${
            isMobile || isTablet
              ? `p-3 ${Styles.results_col_mobile}`
              : `px-0 pb-3 ${Styles.results_col}`
          }`}
        >
          <Element name="catalog" className="d-flex justify-content-center">
            <CatalogResults
              data={searchData}
              isList={isList}
              setView={handleSetView}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
              showModal={showModal}
              isLoggedIn={isLoggedIn}
              num_fb={num_fb}
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
};

export default Search;
