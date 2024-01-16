import React, { useState, useEffect, useCallback } from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import { Element, scroller } from 'react-scroll';
import clsx from 'clsx';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styles from './Search.module.css';
import Results from '../components/Search/Results';
import type { Season } from '../utilities/common';
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
    filters: {
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
    },
    seasonsOptions,
    coursesLoading,
    searchData,
    multiSeasons,
    resetKey,
    isLoggedIn,
    numFriends,
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
        className={clsx(
          'p-0 m-0',
          !isMobile && 'd-flex flex-row-reverse flex-nowrap',
        )}
      >
        {/* Search Form for mobile only */}
        {isMobile && (
          <Col className={clsx('p-3', styles.search_col_mobile)}>
            <SurfaceComponent
              layer={0}
              className={clsx('ml-1', styles.search_container)}
            >
              <Form className="px-0" onSubmit={scrollToResults}>
                <Row className="mx-auto pt-4 px-4">
                  {/* Reset Filters Button */}
                  {/* TODO */}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <small
                    className={clsx(styles.reset_filters_btn, 'mr-auto')}
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </small>
                  {/* Number of results shown text */}
                  <small className={clsx(styles.num_results, 'ml-auto')}>
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
                        value={searchText.value}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => searchText.set(event.target.value)}
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
                <Row
                  className={clsx('mx-auto py-0 px-4', styles.multi_selects)}
                >
                  {/* Seasons Multi-Select */}
                  <div
                    className={clsx('col-md-12 p-0', styles.selector_container)}
                  >
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSeasons.value}
                      options={seasonsOptions}
                      placeholder="Last 5 Years"
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) =>
                        selectSeasons.set(selectedOption as Option<Season>[])
                      }
                    />
                  </div>
                  {/* Skills/Areas Multi-Select */}
                  <div
                    className={clsx('col-md-12 p-0', styles.selector_container)}
                  >
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSkillsAreas.value}
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
                        selectSkillsAreas.set(asWritable(selectedOption))
                      }
                    />
                  </div>
                  {/* Yale Subjects Multi-Select */}
                  <div
                    className={clsx('col-md-12 p-0', styles.selector_container)}
                  >
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSubjects.value}
                      options={Object.entries(subjects).map(([code, name]) => ({
                        label: `${code} - ${name}`,
                        value: code,
                      }))}
                      placeholder="All Subjects"
                      isSearchable
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) =>
                        selectSubjects.set(asWritable(selectedOption))
                      }
                    />
                  </div>
                  {/* Yale Schools Multi-Select */}
                  <div
                    className={clsx('col-md-12 p-0', styles.selector_container)}
                  >
                    <CustomSelect<Option, true>
                      isMulti
                      value={selectSchools.value}
                      options={Object.entries(schools).map(([code, name]) => ({
                        label: name,
                        value: code,
                      }))}
                      placeholder="All Schools"
                      // Prevent overlap with tooltips
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) => {
                        selectSchools.set(asWritable(selectedOption));
                      }}
                    />
                  </div>
                </Row>
                <StyledHr />
                <Row className={clsx('mx-auto pt-0 pb-0 px-2', styles.sliders)}>
                  {/* Class Rating Slider */}
                  <Col>
                    <Container style={{ paddingTop: '1px' }}>
                      <Range
                        min={defaultFilters.overallBounds[0]}
                        max={defaultFilters.overallBounds[1]}
                        step={0.1}
                        key={resetKey}
                        defaultValue={overallBounds.value}
                        onAfterChange={(value) => {
                          overallBounds.set(value as [number, number]);
                        }}
                        handle={({ value, dragging, ...e }) => (
                          // @ts-expect-error: TODO upgrade rc-slider
                          <Handle {...e} key={e.className}>
                            <div
                              className={clsx('shadow', styles.overall_tooltip)}
                            >
                              {value}
                            </div>
                          </Handle>
                        )}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={clsx('text-center', styles.filter_title)}>
                      Overall rating
                    </div>
                  </Col>
                  {/* Workload Rating Slider */}
                  <Col>
                    <Container>
                      <Range
                        min={defaultFilters.workloadBounds[0]}
                        max={defaultFilters.workloadBounds[1]}
                        step={0.1}
                        key={resetKey}
                        defaultValue={workloadBounds.value}
                        onAfterChange={(value) => {
                          workloadBounds.set(value as [number, number]);
                        }}
                        handle={({ value, dragging, ...e }) => (
                          // @ts-expect-error: TODO upgrade rc-slider
                          <Handle {...e} key={e.className}>
                            <div
                              className={clsx(
                                'shadow',
                                styles.workload_tooltip,
                              )}
                            >
                              {value}
                            </div>
                          </Handle>
                        )}
                        className={styles.slider}
                      />
                    </Container>
                    <div className={clsx('text-center', styles.filter_title)}>
                      Workload
                    </div>
                  </Col>
                </Row>
                <StyledHr className="mb-0" />
                <Row
                  className={clsx(
                    'mx-auto pt-1 px-4 justify-content-left',
                    styles.light_bg,
                  )}
                >
                  {/* Hide Cancelled Courses Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideCancelled.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        hideCancelled.set((x) => !x);
                      }}
                    >
                      Hide cancelled courses
                    </Form.Check.Label>
                  </Form.Check>

                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideConflicting.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        hideConflicting.set((x) => !x);
                      }}
                    >
                      Hide courses with conflicting times
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideFirstYearSeminars.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        hideFirstYearSeminars.set((x) => !x);
                      }}
                    >
                      Hide first-year seminars
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide Graduate-Level Courses Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideGraduateCourses.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        hideGraduateCourses.set((x) => !x);
                      }}
                    >
                      Hide graduate courses
                    </Form.Check.Label>
                  </Form.Check>

                  {/* Hide Discussion Sections Toggle */}
                  <Form.Check type="switch" className={styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideDiscussionSections.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => {
                        hideDiscussionSections.set((x) => !x);
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
          className={clsx(
            'm-0',
            isMobile
              ? ['p-3', styles.results_col_mobile]
              : ['px-0 pb-3', styles.results_col],
          )}
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
