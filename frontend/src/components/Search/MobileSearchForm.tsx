import React, { useState, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Form, InputGroup, Button } from 'react-bootstrap';
import RCSlider from 'rc-slider';
import { scroller } from 'react-scroll';

import CustomSelect from './CustomSelect';
import ResultsColumnSort from './ResultsColumnSort';
import Toggle from './Toggle';
import {
  useSearch,
  type Filters,
  type CategoricalFilters,
  type NumericFilters,
  type FilterHandle,
  filterLabels,
  defaultFilters,
  type IntersectableFilters,
  skillsAreasOptions,
  subjectsOptions,
  schoolsOptions,
  seasonsOptions,
  sortByOptions,
} from '../../contexts/searchContext';
import { SurfaceComponent, Input, TextComponent } from '../Typography';
import styles from './MobileSearchForm.module.css';

type SelectProps<K extends keyof CategoricalFilters> = {
  readonly handle: K;
} & Pick<
  React.ComponentProps<
    typeof CustomSelect<FilterHandle<K>['value'][number], true>
  >,
  | 'options'
  | 'placeholder'
  | 'isIntersection'
  | 'setIsIntersection'
  | 'unionIntersectionButtonLabel'
>;

function Select<K extends keyof CategoricalFilters>({
  options,
  handle: handleName,
  placeholder,
  ...props
}: SelectProps<K>) {
  const { filters } = useSearch();
  const handle = filters[handleName] as FilterHandle<K>;
  return (
    // @ts-expect-error: TODO
    <CustomSelect<FilterHandle<K>['value'][number], true>
      className={styles.selectorContainer}
      aria-label={filterLabels[handleName]}
      isMulti
      value={handle.value}
      options={options}
      placeholder={placeholder}
      // Prevent overlap with tooltips
      menuPortalTarget={document.body}
      onChange={(selectedOption) => {
        handle.set(selectedOption as Filters[K]);
      }}
      {...props}
    />
  );
}

function IntersectableSelect<K extends IntersectableFilters>(
  props: SelectProps<K>,
) {
  const {
    filters: { intersectingFilters },
  } = useSearch();
  return (
    <Select
      {...props}
      isIntersection={intersectingFilters.value.includes(props.handle)}
      setIsIntersection={(v) => {
        if (v) {
          intersectingFilters.set([...intersectingFilters.value, props.handle]);
        } else {
          intersectingFilters.set(
            intersectingFilters.value.filter((x) => x !== props.handle),
          );
        }
      }}
    />
  );
}

function Slider<K extends NumericFilters>({
  handle: handleName,
}: {
  readonly handle: K;
}) {
  const { filters } = useSearch();
  const handle = filters[handleName];

  return (
    <div>
      <RCSlider
        range
        ariaLabelForHandle={[
          `${filterLabels[handleName]} rating lower bound`,
          `${filterLabels[handleName]} rating upper bound`,
        ]}
        min={defaultFilters.overallBounds[0]}
        max={defaultFilters.overallBounds[1]}
        step={0.1}
        defaultValue={defaultFilters.overallBounds}
        onChangeComplete={(value) => {
          handle.set(value as [number, number]);
        }}
        handleRender={(node, { value }) => (
          <>
            <div
              // Map to 100% scale
              style={{ left: `${(value - 1) * 25}%` }}
              className={styles.sliderTooltip}
            >
              {value}
            </div>
            {node}
          </>
        )}
        className={styles.slider}
      />
      <div className={clsx('text-center', styles.filterTitle)}>
        {filterLabels[handleName]}
      </div>
    </div>
  );
}

export default function MobileSearchForm() {
  const { filters, coursesLoading, searchData } = useSearch();
  const { searchText, selectSortBy } = filters;
  const resetKey = useRef(0);
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
    <SurfaceComponent className={styles.searchContainer}>
      <Form className={styles.searchForm} onSubmit={scrollToResults}>
        <div className="d-flex justify-content-between pt-4">
          {/* Reset Filters Button */}
          <button
            type="button"
            className={clsx(styles.resetFiltersBtn, 'me-auto')}
            onClick={() => {
              resetKey.current++;
              Object.values(filters).forEach((filter) =>
                filter.resetToDefault(),
              );
            }}
          >
            Reset Filters
          </button>
          {/* Number of results shown text */}
          <small className={clsx(styles.numResults, 'ms-auto')}>
            <TextComponent type="tertiary">
              {coursesLoading
                ? 'Searching ...'
                : `Showing ${searchData?.length ?? 0} results`}
            </TextComponent>
          </small>
        </div>
        {/* Search Bar */}
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
        {/* Sort by option and order */}
        <div className={styles.sortByContainer}>
          <CustomSelect
            className={styles.selectSortBy}
            value={selectSortBy.value}
            options={Object.values(sortByOptions)}
            menuPortalTarget={document.body}
            onChange={(option) => {
              selectSortBy.set(option!);
            }}
          />
          <ResultsColumnSort
            selectOption={selectSortBy.value}
            renderActive={false}
          />
        </div>
        <hr />
        <Select
          options={seasonsOptions}
          handle="selectSeasons"
          placeholder="Last 5 Years"
        />
        <IntersectableSelect
          options={subjectsOptions}
          handle="selectSubjects"
          placeholder="All Subjects"
          unionIntersectionButtonLabel={(isIntersection) =>
            `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected subjects`
          }
        />
        <IntersectableSelect
          options={skillsAreasOptions}
          handle="selectSkillsAreas"
          placeholder="All Areas/Skills"
          unionIntersectionButtonLabel={(isIntersection) =>
            `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected areas/skills`
          }
        />
        <IntersectableSelect
          options={schoolsOptions}
          handle="selectSchools"
          placeholder="All Schools"
          unionIntersectionButtonLabel={(isIntersection) =>
            `Classes that are offered by ${isIntersection ? 'all' : 'any'} of the selected schools`
          }
        />
        <hr />
        <div className={styles.sliders} key={resetKey.current}>
          <Slider handle="overallBounds" />
          <Slider handle="workloadBounds" />
          <Slider handle="professorBounds" />
        </div>
        <div className={styles.booleanToggles}>
          <Toggle handle="searchDescription" />
          <Toggle handle="enableQuist" />
          <Toggle handle="hideCancelled" />
          <Toggle handle="hideConflicting" />
          <Toggle handle="hideFirstYearSeminars" />
          <Toggle handle="hideGraduateCourses" />
          <Toggle handle="hideDiscussionSections" />
        </div>
        <div className={styles.uselessBtn}>
          {/* The form requires a button with type submit in order to
          process events when someone hits enter to submit. We want
          this functionality so we can scroll to the results on mobile
          when they hit enter, and hence have a hidden button here. */}
          <Button type="submit" />
        </div>
      </Form>
    </SurfaceComponent>
  );
}
