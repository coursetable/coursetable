import React, { useState, useEffect, useCallback } from 'react';

import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import { Element, scroller } from 'react-scroll';
import styles from './Search.module.css';

import Results from '../components/Search/Results';

import {
  skillsAreasOptions,
  schoolOptions,
  subjectOptions,
} from '../queries/Constants';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import CustomSelect from '../components/CustomSelect';
import SortByReactSelect from '../components/Search/SortByReactSelect';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import {
  SurfaceComponent,
  StyledInput,
  StyledHr,
  TextComponent,
} from '../components/StyledComponents';

import { useSessionStorageState } from '../utilities/browserStorage';
import { useSearch, Option, defaultFilters } from '../contexts/searchContext';
import { ValueType } from 'react-select/src/types';

/**
 * Renders catalog page
 */
function Search() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  // way to display results
  const [isList, setView] = useSessionStorageState('isList', !isMobile);

  // Get search context data
  const {
    searchText,
    select_subjects,
    select_skillsareas,
    overallBounds,
    workloadBounds,
    select_seasons,
    select_schools,
    hideCancelled,
    hideConflicting,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    seasonsOptions,
    coursesLoading,
    searchData,
    multiSeasons,
    reset_key,
    isLoggedIn,
    num_friends,
    setSearchText,
    setSelectSubjects,
    setSelectSkillsAreas,
    setOverallBounds,
    setOverallValueLabels,
    setWorkloadBounds,
    setWorkloadValueLabels,
    setSelectSeasons,
    setSelectSchools,
    setHideCancelled,
    setHideConflicting,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setHideDiscussionSections,
    handleResetFilters,
  } = useSearch();

  const scrollToResults = useCallback(
    (event?: React.FormEvent) => {
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
    [isMobile],
  );

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scrollToResults();
      setDoneInitialScroll(true);
    }
  }, [coursesLoading, doneInitialScroll, scrollToResults]);

  // Switch to grid view if mobile
  useEffect(() => {
    if (isMobile && isList === true) {
      setView(false);
    }
  }, [isMobile, isList, setView]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={styles.search_base}>
      <Row
        className={`p-0 m-0 ${
          !isMobile ? 'd-flex flex-row-reverse flex-nowrap' : ''
        }`}
      >
        {/* Search Form for mobile only */}
        {isMobile && (
          <Col className={`p-3 ${styles.search_col_mobile}`}>
            <SurfaceComponent
              layer={0}
              className={`ml-1 ${styles.search_container}`}
            >
              <Form className="px-0" onSubmit={scrollToResults}>
                <Row className="mx-auto pt-4 px-4">
                  {/* Reset Filters Button */}
                  <small
                    className={`${styles.reset_filters_btn} mr-auto`}
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </small>
                  {/* Number of results shown text */}
                  <small className={`${styles.num_results} ml-auto`}>
                    <TextComponent type={2}>
                      {coursesLoading
                        ? 'Searching ...'
                        : `Showing ${searchData.length} results`}
                    </TextComponent>
                  </small>
                </Row>
                {/* Search Bar */}
                <Row className="mx-auto pt-1 pb-2 px-4">
                  <div className={styles.search_bar}>
                    <InputGroup className={styles.search_input}>
                      <StyledInput
                        type="text"
                        value={searchText}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => setSearchText(event.target.value)}
                        placeholder="Search by course code, title, or prof"
                      />
                    </InputGroup>
                  </div>
                </Row>
                {/* Sort by option and order */}
                <Row className="mx-auto py-0 px-4">
                  <SortByReactSelect key={reset_key} />
                </Row>
                <StyledHr />
                <Row className={`mx-auto py-0 px-4 ${styles.multi_selects}`}>
                  {/* Seasons Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    {seasonsOptions && (
                      <CustomSelect
                        isMulti
                        value={select_seasons}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        // prevent overlap with tooltips
                        menuPortalTarget={document.body}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>,
                        ) =>
                          setSelectSeasons((selectedOption as Option[]) || [])
                        }
                      />
                    )}
                  </div>
                  {/* Skills/Areas Multi-Select */}
                  <div
                    className={`col-md-12 p-0  ${styles.selector_container}`}
                  >
                    <CustomSelect
                      isMulti
                      value={select_skillsareas}
                      options={skillsAreasOptions}
                      placeholder="All Skills/Areas"
                      useColors
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption: ValueType<Option, boolean>) =>
                        setSelectSkillsAreas((selectedOption as Option[]) || [])
                      }
                    />
                  </div>
                  {/* Course Credit Multi-Select */}
                  {/* <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                  <CustomSelect
                    isMulti
                    value={select_credits}
                    options={creditOptions}
                    placeholder="All Credits"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
                      setSelectCredits((selectedOption as Option[]) || []);
                    }}
                  />
                </div> */}
                  {/* Yale Subjects Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    <CustomSelect
                      isMulti
                      value={select_subjects}
                      options={subjectOptions}
                      placeholder="All Subjects"
                      isSearchable
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption: ValueType<Option, boolean>) =>
                        setSelectSubjects((selectedOption as Option[]) || [])
                      }
                    />
                  </div>
                  {/* Yale Schools Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    <CustomSelect
                      isMulti
                      value={select_schools}
                      options={schoolOptions}
                      placeholder="All Schools"
                      // prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(
                        selectedOption: ValueType<Option, boolean>,
                      ) => {
                        setSelectSchools((selectedOption as Option[]) || []);
                      }}
                    />
                  </div>
                </Row>
                <StyledHr />
                <Row className={`mx-auto pt-0 pb-0 px-2 ${styles.sliders}`}>
                  {/* Class Rating Slider */}
                  <Col>
                    <Container style={{ paddingTop: '1px' }}>
                      <Range
                        min={defaultFilters.defaultRatingBounds[0]}
                        max={defaultFilters.defaultRatingBounds[1]}
                        step={0.1}
                        key={reset_key}
                        defaultValue={overallBounds}
                        onChange={(value) => {
                          setOverallValueLabels(value);
                        }}
                        onAfterChange={(value) => {
                          setOverallBounds(value);
                        }}
                        handle={({ value, dragging, ...e }) => (
                          // @ts-expect-error: TODO upgrade rc-slider
                          <Handle {...e} key={e.className}>
                            <div className={`shadow ${styles.overall_tooltip}`}>
                              {value}
                            </div>
                          </Handle>
                        )}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${styles.filter_title}`}>
                      Overall rating
                    </div>
                  </Col>
                  {/* Workload Rating Slider */}
                  <Col>
                    <Container>
                      <Range
                        min={defaultFilters.defaultRatingBounds[0]}
                        max={defaultFilters.defaultRatingBounds[1]}
                        step={0.1}
                        key={reset_key}
                        defaultValue={workloadBounds}
                        onChange={(value) => {
                          setWorkloadValueLabels(value);
                        }}
                        onAfterChange={(value) => {
                          setWorkloadBounds(value);
                        }}
                        handle={({ value, dragging, ...e }) => (
                          // @ts-expect-error: TODO upgrade rc-slider
                          <Handle {...e} key={e.className}>
                            <div
                              className={`shadow ${styles.workload_tooltip}`}
                            >
                              {value}
                            </div>
                          </Handle>
                        )}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${styles.filter_title}`}>
                      Workload
                    </div>
                  </Col>
                </Row>
                {/* Omitting advanced range filters for mobile */}
                {/* // Time slider
                <Row className={`mx-auto pt-0 pb-0 px-2 ${styles.sliders}`}>
                  <Col>
                    <Container>
                      <Range
                        min={toRangeTime(defaultFilters.defaultTimeBounds[0])}
                        max={toRangeTime(defaultFilters.defaultTimeBounds[1])}
                        step={1}
                        key={reset_key}
                        defaultValue={timeBounds.map(toRangeTime)}
                        onChange={(value) => {
                          setTimeValueLabels(value.map(toRealTime));
                        }}
                        onAfterChange={(value) => {
                          setTimeBounds(value.map(toRealTime));
                        }}
                        handle={timeSliderHandle}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${styles.filter_title}`}>
                      Time
                    </div>
                  </Col>
                </Row>
                // Enrollment slider
                <Row className={`mx-auto pt-0 pb-0 px-2 ${styles.sliders}`}>
                  <Col>
                    <Container>
                      <Range
                        min={Math.round(
                          toLinear(defaultFilters.defaultEnrollBounds[0])
                        )}
                        max={Math.round(
                          toLinear(defaultFilters.defaultEnrollBounds[1])
                        )}
                        step={10}
                        key={reset_key}
                        defaultValue={enrollBounds.map(toLinear)}
                        onChange={(value) => {
                          setEnrollValueLabels(
                            value.map(toExponential).map(Math.round)
                          );
                        }}
                        onAfterChange={(value) => {
                          setEnrollBounds(value.map(toExponential));
                        }}
                        handle={enrollmentSliderHandle}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${styles.filter_title}`}>
                      Enrollment
                    </div>
                  </Col>
                </Row> */}
                <StyledHr className="mb-0" />
                <Row
                  className={`mx-auto pt-1 px-4 justify-content-left ${styles.light_bg}`}
                >
                  {/* Hide Cancelled Courses Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
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

                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideConflicting}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        setHideConflicting(!hideConflicting);
                      }}
                    >
                      Hide courses with conflicting times
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
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
                  <Form.Check type="switch" className={styles.toggle_option}>
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

                  {/* Hide Discussion Sections Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideDiscussionSections}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        setHideDiscussionSections(!hideDiscussionSections);
                      }}
                    >
                      Hide discussion sections
                    </Form.Check.Label>
                  </Form.Check>
                </Row>

                <div className={styles.useless_btn}>
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

        {/* Catalog Search Search */}
        <Col
          md={12}
          className={`m-0 ${
            isMobile
              ? `p-3 ${styles.results_col_mobile}`
              : `px-0 pb-3 ${styles.results_col}`
          }`}
        >
          <Element name="catalog" className="d-flex justify-content-center">
            <Results
              data={searchData}
              isList={isList}
              setView={(isList: boolean) => {
                setView(isList);
              }}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
              isLoggedIn={isLoggedIn}
              num_friends={num_friends}
            />
          </Element>
        </Col>
      </Row>
    </div>
  );
}

export default Search;
