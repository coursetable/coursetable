import React, { useImperativeHandle, useState, useId, useRef } from 'react';
import clsx from 'clsx';
import RCSlider from 'rc-slider';

import CustomSelect from './CustomSelect';
import type { Resettable } from './NavbarCatalogSearch';
import { Popout } from './Popout';
import ResultsColumnSort from './ResultsColumnSort';
import Toggle from './Toggle';
import {
  useSearch,
  type FilterHandle,
  type Filters,
  type BooleanFilters,
  type CategoricalFilters,
  type NumericFilters,
  filterLabels,
  defaultFilters,
  type IntersectableFilters,
  sortByOptions,
  skillsAreasOptions,
  subjectsOptions,
  schoolsOptions,
  seasonsOptions,
  courseInfoAttributesOptions,
} from '../../contexts/searchContext';

import { useStore } from '../../store';
import {
  weekdays,
  credits,
  skillsAreasColors,
} from '../../utilities/constants';
import {
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/course';
import styles from './AdvancedPanel.module.css';

type SelectProps<K extends keyof CategoricalFilters> = {
  readonly id: string;
  readonly handle: K;
} & Pick<
  React.ComponentProps<
    typeof CustomSelect<FilterHandle<K>['value'][number], true>
  >,
  | 'options'
  | 'placeholder'
  | 'colors'
  | 'isIntersection'
  | 'setIsIntersection'
  | 'unionIntersectionButtonLabel'
>;

function Select<K extends keyof CategoricalFilters>({
  id,
  options,
  handle: handleName,
  placeholder,
  colors,
  ...props
}: SelectProps<K>) {
  const { setStartTime, filters } = useSearch();
  const handle = filters[handleName] as FilterHandle<K>;
  // Prevent overlap with tooltips
  const menuPortalTarget = document.querySelector<HTMLElement>('#portal');
  return (
    <div className={styles.row}>
      <div className={styles.label} id={id}>
        {filterLabels[handleName]}:
      </div>
      {/* @ts-expect-error: TODO */}
      <CustomSelect<FilterHandle<K>['value'][number], true>
        aria-labelledby={id}
        className={styles.select}
        closeMenuOnSelect
        colors={colors}
        isMulti
        value={handle.value}
        options={options}
        placeholder={placeholder}
        menuPortalTarget={menuPortalTarget}
        onChange={(selectedOption) => {
          handle.set(selectedOption as Filters[K]);
          setStartTime(Date.now());
        }}
        {...props}
      />
    </div>
  );
}

function IntersectableSelect<K extends IntersectableFilters>(
  props: SelectProps<K>,
) {
  const {
    setStartTime,
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
        setStartTime(Date.now());
      }}
    />
  );
}

const identity = <T,>(x: T) => x;

function Slider<K extends NumericFilters>({
  handle: handleName,
  step,
  marks,
  scaleToUniform = identity,
  scaleToReal = identity,
  toLabel = String,
}: {
  readonly handle: K;
  readonly step: number;
  readonly marks?: number[];
  readonly scaleToUniform?: (value: number) => number;
  readonly scaleToReal?: (value: number) => number;
  readonly toLabel?: (value: number) => string;
}) {
  const { setStartTime, filters } = useSearch();
  const handle = filters[handleName];
  // This is exactly the same as the filter handle, except it updates
  // responsively without triggering searching
  const [rangeValue, setRangeValue] = useState(
    handle.value.map(scaleToUniform) as [number, number],
  );

  return (
    <div className={styles.row}>
      <div
        className={clsx(styles.label, handle.isNonEmpty && styles.labelActive)}
      >
        {filterLabels[handleName]}:
      </div>
      <div className={styles.rangeGroup}>
        <div className="d-flex align-items-center justify-content-between mb-1 w-100">
          <div className={styles.rangeValueLabel}>
            {toLabel(scaleToReal(rangeValue[0]))}
          </div>
          <div className={styles.rangeValueLabel}>
            {toLabel(scaleToReal(rangeValue[1]))}
          </div>
        </div>
        <RCSlider
          range
          ariaLabelForHandle={[
            `${filterLabels[handleName]} lower bound`,
            `${filterLabels[handleName]} upper bound`,
          ]}
          className={styles.range}
          min={scaleToUniform(defaultFilters[handleName][0])}
          max={scaleToUniform(defaultFilters[handleName][1])}
          step={step}
          marks={
            marks
              ? Object.fromEntries(
                  marks.map((x) => [scaleToUniform(x), toLabel(x)]),
                )
              : undefined
          }
          value={rangeValue}
          onChange={(value) => {
            setRangeValue(value as [number, number]);
          }}
          onChangeComplete={(value) => {
            handle.set(
              (value as [number, number]).map(scaleToReal) as [number, number],
            );
            setStartTime(Date.now());
          }}
        />
      </div>
    </div>
  );
}

function AdvancedPanel(props: unknown, ref: React.ForwardedRef<Resettable>) {
  const isTablet = useStore((state) => state.isTablet);
  const formLabelId = useId();
  const { filters, setStartTime } = useSearch();

  const { selectSortBy, sortOrder } = filters;

  const resetKey = useRef(0);

  useImperativeHandle(ref, () => ({
    resetToDefault: () => resetKey.current++,
  }));

  const relevantFilters: (
    | BooleanFilters
    | keyof CategoricalFilters
    | NumericFilters
  )[] = [
    'selectDays',
    'timeBounds',
    'enrollBounds',
    'numBounds',
    'selectSchools',
    'selectCredits',
    'selectCourseInfoAttributes',
    'searchDescription',
    'enableQuist',
    'hideCancelled',
    'hideConflicting',
    'hideFirstYearSeminars',
    'hideGraduateCourses',
    'hideDiscussionSections',
  ];
  if (isTablet) {
    relevantFilters.push(
      'selectSubjects',
      'selectSkillsAreas',
      'selectSeasons',
      'professorBounds',
    );
  }

  return (
    <Popout
      buttonText="Advanced"
      arrowIcon={false}
      onReset={() => {
        relevantFilters.forEach((k) => filters[k].resetToEmpty());
        if (selectSortBy.value.value === 'average_gut_rating') {
          selectSortBy.resetToEmpty();
          sortOrder.resetToEmpty();
        }
        resetKey.current++;
        setStartTime(Date.now());
      }}
      selectedOptions={
        relevantFilters.filter((k) => filters[k].isNonEmpty).length +
        Number(selectSortBy.value.value === 'average_gut_rating')
      }
      dataTutorial={4}
    >
      <div className={styles.panel}>
        {isTablet && (
          <>
            <IntersectableSelect
              id={`${formLabelId}-subject`}
              options={subjectsOptions}
              handle="selectSubjects"
              placeholder="All Subjects"
              unionIntersectionButtonLabel={(isIntersection) =>
                `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected subjects`
              }
            />
            <IntersectableSelect
              id={`${formLabelId}-area-skills`}
              options={skillsAreasOptions}
              handle="selectSkillsAreas"
              placeholder="All Areas/Skills"
              colors={skillsAreasColors}
              unionIntersectionButtonLabel={(isIntersection) =>
                `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected areas/skills`
              }
            />
            <Select
              id={`${formLabelId}-season`}
              options={seasonsOptions}
              handle="selectSeasons"
              placeholder="Last 5 Years"
            />
          </>
        )}
        <IntersectableSelect
          id={`${formLabelId}-day`}
          options={Object.entries(weekdays).map(([day, value]) => ({
            label: day,
            value,
          }))}
          handle="selectDays"
          placeholder="All Days"
          unionIntersectionButtonLabel={(isIntersection) =>
            `Classes that meet on ${isIntersection ? 'all' : 'any'} of the selected days`
          }
        />
        <React.Fragment key={resetKey.current}>
          <Slider
            handle="timeBounds"
            step={1}
            marks={[84, 120, 156, 192, 228, 264]}
            toLabel={(x) => to12HourTime(toRealTime(x))}
          />
          <Slider
            handle="enrollBounds"
            step={10}
            marks={[1, 18, 160, 528]}
            scaleToUniform={(x) => Math.round(toLinear(x))}
            scaleToReal={(x) => Math.round(toExponential(x))}
          />
          {isTablet && <Slider handle="professorBounds" step={0.1} />}
          <Slider
            handle="numBounds"
            step={10}
            marks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
            toLabel={(x) =>
              x === 1000 ? '1000+' : x.toString().padStart(3, '0')
            }
          />
        </React.Fragment>
        <Select
          id={`${formLabelId}-school`}
          options={schoolsOptions}
          handle="selectSchools"
          placeholder="All Schools"
        />
        <Select
          id={`${formLabelId}-credit`}
          options={credits.map((credit) => ({
            label: String(credit),
            value: credit,
          }))}
          handle="selectCredits"
          placeholder="All Credits"
        />
        <IntersectableSelect
          id={`${formLabelId}-info`}
          options={courseInfoAttributesOptions}
          handle="selectCourseInfoAttributes"
          placeholder="Course Information Attributes"
          unionIntersectionButtonLabel={(isIntersection) =>
            `Classes that contain ${isIntersection ? 'all' : 'any'} of the selected attributes`
          }
        />
        <div className={styles.row}>
          {/* Sort by Guts */}
          <div className={styles.label}>
            {sortByOptions.average_gut_rating.label}:
          </div>
          <ResultsColumnSort selectOption={sortByOptions.average_gut_rating} />
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
      </div>
    </Popout>
  );
}

export default React.forwardRef(AdvancedPanel);
