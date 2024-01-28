import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { Handle, Range } from 'rc-slider';
import clsx from 'clsx';

import styles from './MobileSearchForm.module.css';
import Toggle from './Toggle';
import CustomSelect from './CustomSelect';
import SortByReactSelect from './SortByReactSelect';
import {
  SurfaceComponent,
  StyledInput,
  StyledHr,
  TextComponent,
} from '../StyledComponents';
import type { Season } from '../../utilities/common';
import {
  useSearch,
  type Option,
  defaultFilters,
  skillsAreasOptions,
  subjectsOptions,
  schoolsOptions,
  seasonsOptions,
} from '../../contexts/searchContext';

export default function MobileSearchForm({
  onSubmit,
}: {
  readonly onSubmit: (event: React.FormEvent) => void;
}) {
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
    },
    coursesLoading,
    searchData,
    resetKey,
    handleResetFilters,
  } = useSearch();
  return (
    <Col className={clsx('p-3', styles.searchColMobile)}>
      <SurfaceComponent
        layer={0}
        className={clsx('ml-1', styles.searchContainer)}
      >
        <Form className="px-0" onSubmit={onSubmit}>
          <Row className="mx-auto pt-4 px-4">
            {/* Reset Filters Button */}
            {/* TODO */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <small
              className={clsx(styles.resetFiltersBtn, 'mr-auto')}
              onClick={handleResetFilters}
            >
              Reset Filters
            </small>
            {/* Number of results shown text */}
            <small className={clsx(styles.numResults, 'ml-auto')}>
              <TextComponent type={2}>
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
                <StyledInput
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
            <SortByReactSelect key={resetKey} />
          </Row>
          <StyledHr />
          <Row className={clsx('mx-auto py-0 px-4', styles.multiSelects)}>
            {/* Seasons Multi-Select */}
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option<Season>, true>
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
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
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
            {/* Yale Subjects Multi-Select */}
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
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
            {/* Yale Schools Multi-Select */}
            <div className={clsx('col-md-12 p-0', styles.selectorContainer)}>
              <CustomSelect<Option, true>
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
                      <div className={clsx('shadow', styles.overallTooltip)}>
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
                      <div className={clsx('shadow', styles.workloadTooltip)}>
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
          </Row>
          <StyledHr className="mb-0" />
          <Row
            className={clsx(
              'mx-auto pt-1 px-4 justify-content-left',
              styles.lightBg,
            )}
          >
            <Toggle handle="searchDescription" />
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
    </Col>
  );
}
