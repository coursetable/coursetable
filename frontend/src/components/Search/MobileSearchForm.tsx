import React, { useState, useCallback, useEffect } from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import clsx from 'clsx';
import { scroller } from 'react-scroll';

import styles from './MobileSearchForm.module.css';
import Toggle from './Toggle';
import CustomSelect from './CustomSelect';
import ResultsColumnSort from './ResultsColumnSort';
import { SurfaceComponent, Input, Hr, TextComponent } from '../Typography';
import type { Season } from '../../utilities/common';
import {
  useSearch,
  type Option,
  isOption,
  defaultFilters,
  skillsAreasOptions,
  subjectsOptions,
  schoolsOptions,
  seasonsOptions,
  sortByOptions,
} from '../../contexts/searchContext';

export default function MobileSearchForm() {
  const { filters, coursesLoading, searchData } = useSearch();
  const {
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    workloadBounds,
    professorBounds,
    selectSeasons,
    selectSchools,
    selectSortBy,
  } = filters;
  // These are exactly the same as the filters, except they update responsively
  // without triggering searching
  const [overallRangeValue, setOverallRangeValue] = useState(
    overallBounds.value,
  );
  const [workloadRangeValue, setWorkloadRangeValue] = useState(
    workloadBounds.value,
  );
  const [professorRangeValue, setProfessorRangeValue] = useState(
    professorBounds.value,
  );
  const scrollToResults = useCallback((event?: React.FormEvent) => {
    if (event) event.preventDefault();
    scroller.scrollTo('catalog', {
      smooth: true,
      duration: 500,
      offset: -56,
    });
  }, []);
  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scrollToResults();
      setDoneInitialScroll(true);
    }
  }, [coursesLoading, doneInitialScroll, scrollToResults]);

  return (
    <div className="p-3">
      <SurfaceComponent className={styles.searchContainer}>
        <Form className="px-0" onSubmit={scrollToResults}>
          <Row className="mx-auto pt-4 px-4">
            {/* Reset Filters Button */}
            <button
              type="button"
              className={clsx(styles.resetFiltersBtn, 'mr-auto')}
              onClick={() => {
                setOverallRangeValue(defaultFilters.overallBounds);
                setWorkloadRangeValue(defaultFilters.workloadBounds);
                setProfessorRangeValue(defaultFilters.professorBounds);
                Object.values(filters).forEach((filter) => filter.reset());
              }}
            >
              Reset Filters
            </button>
            {/* Number of results shown text */}
            <small className={clsx(styles.numResults, 'ml-auto')}>
              <TextComponent type="tertiary">
                {coursesLoading
                  ? 'Searching ...'
                  : `Showing ${searchData.length} results`}
              </TextComponent>
            </small>
          </Row>
          {/* Search Bar */}
          <Row className="mx-auto pt-1 pb-2 px-4">
            <div className={styles.searchBar}>
              <InputGroup className={styles.searchInput}>
                <Input
                  type="text"
                  value={searchText.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    searchText.set(event.target.value)
                  }
                  placeholder="Search by course code, title, or prof"
                />
              </InputGroup>
            </div>
          </Row>
          {/* Sort by option and order */}
          <Row className="mx-auto py-0 px-4">
            <div className={styles.sortByContainer}>
              <CustomSelect
                value={selectSortBy.value}
                options={Object.values(sortByOptions)}
                menuPortalTarget={document.body}
                onChange={(options): void => {
                  if (isOption(options)) selectSortBy.set(options);
                }}
              />
            </div>
            <ResultsColumnSort
              selectOption={selectSortBy.value}
              renderActive={false}
            />
          </Row>
          <Hr />
          <Row className={clsx('mx-auto py-0 px-4', styles.multiSelects)}>
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option<Season>, true>
                aria-label="Seasons"
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
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
                aria-label="Skills/Areas"
                isMulti
                value={selectSkillsAreas.value}
                options={skillsAreasOptions}
                placeholder="All Skills/Areas"
                useColors
                // Prevent overlap with tooltips
                menuPortalTarget={document.body}
                onChange={(selectedOption) =>
                  selectSkillsAreas.set(selectedOption as Option[])
                }
              />
            </div>
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
                aria-label="Subjects"
                isMulti
                value={selectSubjects.value}
                options={subjectsOptions}
                placeholder="All Subjects"
                isSearchable
                // Prevent overlap with tooltips
                menuPortalTarget={document.body}
                onChange={(selectedOption) =>
                  selectSubjects.set(selectedOption as Option[])
                }
              />
            </div>
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
                aria-label="Schools"
                isMulti
                value={selectSchools.value}
                options={schoolsOptions}
                placeholder="All Schools"
                // Prevent overlap with tooltips
                menuPortalTarget={document.body}
                onChange={(selectedOption) => {
                  selectSchools.set(selectedOption as Option[]);
                }}
              />
            </div>
          </Row>
          <Hr />
          <Row className={clsx('mx-auto pt-0 pb-0 px-2', styles.sliders)}>
            <Col>
              <Container style={{ paddingTop: '1px' }}>
                <Range
                  ariaLabelGroupForHandles={[
                    'Overall rating lower bound',
                    'Overall rating upper bound',
                  ]}
                  min={defaultFilters.overallBounds[0]}
                  max={defaultFilters.overallBounds[1]}
                  step={0.1}
                  value={overallRangeValue}
                  onChange={(value) => {
                    setOverallRangeValue(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    overallBounds.set(value as [number, number]);
                  }}
                  handle={({ value, dragging, ...e }) => (
                    // @ts-expect-error: TODO upgrade rc-slider
                    <Handle {...e} key={e.className}>
                      <div className={clsx('shadow', styles.sliderTooltip)}>
                        {value}
                      </div>
                    </Handle>
                  )}
                  className={styles.slider}
                />
              </Container>
              <div className={clsx('text-center', styles.filterTitle)}>
                Overall rating
              </div>
            </Col>
            {/* Workload Rating Slider */}
            <Col>
              <Container>
                <Range
                  ariaLabelGroupForHandles={[
                    'Workload rating lower bound',
                    'Workload rating upper bound',
                  ]}
                  min={defaultFilters.workloadBounds[0]}
                  max={defaultFilters.workloadBounds[1]}
                  step={0.1}
                  value={workloadRangeValue}
                  onChange={(value) => {
                    setWorkloadRangeValue(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    workloadBounds.set(value as [number, number]);
                  }}
                  handle={({ value, dragging, ...e }) => (
                    // @ts-expect-error: TODO upgrade rc-slider
                    <Handle {...e} key={e.className}>
                      <div className={clsx('shadow', styles.sliderTooltip)}>
                        {value}
                      </div>
                    </Handle>
                  )}
                  className={styles.slider}
                />
              </Container>
              <div className={clsx('text-center', styles.filterTitle)}>
                Workload
              </div>
            </Col>
            {/* Professor Rating Slider */}
            <Col>
              <Container>
                <Range
                  ariaLabelGroupForHandles={[
                    'Professor rating lower bound',
                    'Professor rating upper bound',
                  ]}
                  min={defaultFilters.professorBounds[0]}
                  max={defaultFilters.professorBounds[1]}
                  step={0.1}
                  value={professorRangeValue}
                  onChange={(value) => {
                    setProfessorRangeValue(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    professorBounds.set(value as [number, number]);
                  }}
                  handle={({ value, dragging, ...e }) => (
                    // @ts-expect-error: TODO upgrade rc-slider
                    <Handle {...e} key={e.className}>
                      <div className={clsx('shadow', styles.sliderTooltip)}>
                        {value}
                      </div>
                    </Handle>
                  )}
                  className={styles.slider}
                />
              </Container>
              <div className={clsx('text-center', styles.filterTitle)}>
                Professor
              </div>
            </Col>
          </Row>
          <Hr className="mb-0" />
          <Row
            className={clsx(
              'mx-auto pt-1 px-4 justify-content-left',
              styles.lightBg,
            )}
          >
            <Toggle handle="searchDescription" />
            <Toggle handle="enableQuist" />
            <Toggle handle="hideCancelled" />
            <Toggle handle="hideConflicting" />
            <Toggle handle="hideFirstYearSeminars" />
            <Toggle handle="hideGraduateCourses" />
            <Toggle handle="hideDiscussionSections" />
          </Row>
          <div className={styles.uselessBtn}>
            {/* The form requires a button with type submit in order to
          process events when someone hits enter to submit. We want
          this functionality so we can scroll to the results on mobile
          when they hit enter, and hence have a hidden button here. */}
            <Button type="submit" />
          </div>
        </Form>
      </SurfaceComponent>
    </div>
  );
}
