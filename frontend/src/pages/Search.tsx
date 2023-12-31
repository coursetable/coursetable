import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import { Element, scroller } from 'react-scroll';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styles from './Search.module.css';
import Results from '../components/Search/Results';
import {
  skillsAreas,
  skillsAreasColors,
  schools,
  subjects,
} from '../utilities/constants';
import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import CustomSelect from '../components/CustomSelect';
import SortByReactSelect from '../components/Search/SortByReactSelect';
import {
  SurfaceComponent,
  StyledInput,
  StyledHr,
  TextComponent,
} from '../components/StyledComponents';
import { useSessionStorageState } from '../utilities/browserStorage';
import {
  useSearch,
  type Option,
  defaultFilters,
} from '../contexts/searchContext';

/**
 * Identity function that casts a readonly array to a writable array
 */
const asWritable = <T,>(value: readonly T[]) => value as T[];

/**
 * Renders catalog page
 */
function Search() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  // Way to display results
  const [isListView, setIsListView] = useSessionStorageState(
    'isListView',
    !isMobile,
  );

  // Get search context data
  const {
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    workloadBounds,
    selectSeasons,
    selectSchools,
    hideCancelled,
    hideConflicting,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    seasonsOptions,
    coursesLoading,
    searchData,
    multiSeasons,
    resetKey,
    isLoggedIn,
    numFriends,
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
    if (isMobile && isListView) setIsListView(false);
  }, [isMobile, isListView, setIsListView]);

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
                  {/* TODO */}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
                  <SortByReactSelect key={resetKey} />
                </Row>
                <StyledHr />
                <Row className={`mx-auto py-0 px-4 ${styles.multi_selects}`}>
                  {/* Seasons Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    {seasonsOptions && (
                      <CustomSelect<Option, true>
                        isMulti
                        value={selectSeasons}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        // Prevent overlap with tooltips
                        menuPortalTarget={document.body}
                        onChange={(selectedOption) =>
                          setSelectSeasons(asWritable(selectedOption))
                        }
                      />
                    )}
                  </div>
                  {/* Skills/Areas Multi-Select */}
                  <div
                    className={`col-md-12 p-0  ${styles.selector_container}`}
                  >
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSkillsAreas}
                      options={['Areas', 'Skills'].map((type) => ({
                        label: type,
                        options: Object.entries(
                          skillsAreas[type.toLowerCase() as 'areas' | 'skills'],
                        ).map(([code, name]) => ({
                          label: `${code} - ${name}`,
                          value: code,
                          color: skillsAreasColors[code],
                        })),
                      }))}
                      placeholder="All Skills/Areas"
                      useColors
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) =>
                        setSelectSkillsAreas(asWritable(selectedOption))
                      }
                    />
                  </div>
                  {/* Course Credit Multi-Select */}
                  {/* <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                  <CustomSelect
                    isMulti
                    value={selectCredits}
                    options={credits.map((credit) => ({
                      label: String(credit),
                      value: credit,
                    }))}
                    placeholder="All Credits"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(selectedOption) => {
                      setSelectCredits(selectedOption);
                    }}
                  />
                </div> */}
                  {/* Yale Subjects Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSubjects}
                      options={Object.entries(subjects).map(([code, name]) => ({
                        label: `${code} - ${name}`,
                        value: code,
                      }))}
                      placeholder="All Subjects"
                      isSearchable
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) =>
                        setSelectSubjects(asWritable(selectedOption))
                      }
                    />
                  </div>
                  {/* Yale Schools Multi-Select */}
                  <div className={`col-md-12 p-0 ${styles.selector_container}`}>
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSchools}
                      options={Object.entries(schools).map(([code, name]) => ({
                        label: name,
                        value: code,
                      }))}
                      placeholder="All Schools"
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) => {
                        setSelectSchools(asWritable(selectedOption));
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
                        key={resetKey}
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
                        key={resetKey}
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
                        key={resetKey}
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
                        key={resetKey}
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                  {/* The form requires a button with type submit in order to
                    process events when someone hits enter to submit. We want
                    this functionality so we can scroll to the results on mobile
                    when they hit enter, and hence have a hidden button here. */}
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
              isListView={isListView}
              setIsListView={setIsListView}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
              isLoggedIn={isLoggedIn}
              numFriends={numFriends}
            />
          </Element>
        </Col>
      </Row>
    </div>
  );
}

export default Search;
